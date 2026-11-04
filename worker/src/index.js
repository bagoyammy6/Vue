/**
 * TDX 代理 (Cloudflare Worker)
 *
 * 為什麼需要它？
 * 1. client_secret 不能放在前端：任何人打開 F12 就能看到並盜用你的額度。
 *    金鑰改存在 Worker 的「Secret」(TDX_CLIENT_ID / TDX_CLIENT_SECRET)，前端看不到。
 * 2. 減少 429：
 *    - Access Token 有效 24 小時，Worker 會快取起來，不會每次都重新申請
 *      (TDX 規定 token 端點每個 IP 每分鐘最多 20 次)。
 *    - 回應結果放在 Cloudflare 邊緣快取，同一份資料在 TTL 內所有使用者共用，
 *      實際打到 TDX 的次數會大幅下降。
 *
 * 前端呼叫方式：
 *   GET https://<你的worker>.workers.dev/api/basic/v2/Bike/Station/City/Taipei?$select=...
 *   (路徑和 TDX 官方完全一樣，只是把網域換成 Worker 的網域，不需要帶 Authorization)
 */

const TDX_ORIGIN = "https://tdx.transportdata.tw";
const TOKEN_URL = `${TDX_ORIGIN}/auth/realms/TDXConnect/protocol/openid-connect/token`;

// 只允許代理這些路徑，避免 Worker 被拿去當成任意 TDX API 的免費跳板
const ALLOWED_PREFIXES = [
  "/api/basic/v2/Bike/",
  "/api/basic/v2/Cycling/",
  "/api/basic/v2/Tourism/",
];

// 不同資料更新頻率不同，快取時間 (秒) 也不同
function cacheTtlFor(pathname) {
  if (pathname.includes("/Bike/Availability/")) return 30; // 即時車輛數
  if (pathname.includes("/Bike/Station/")) return 60 * 60; // 站點資料
  return 60 * 60 * 6; // 車道、景點、餐廳
}

// isolate 內的記憶體快取 (同一個 Worker 實例會重複使用)
let memoryToken = null; // { value, expiresAt }

async function getAccessToken(env) {
  const now = Date.now();
  if (memoryToken && memoryToken.expiresAt > now) return memoryToken.value;

  // 跨 isolate 共用：存在 Cache API
  const cache = caches.default;
  const cacheKey = new Request("https://tdx-token.internal/token");
  const cached = await cache.match(cacheKey);
  if (cached) {
    const data = await cached.json();
    if (data.expiresAt > now) {
      memoryToken = data;
      return data.value;
    }
  }

  const res = await fetch(TOKEN_URL, {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      grant_type: "client_credentials",
      client_id: env.TDX_CLIENT_ID,
      client_secret: env.TDX_CLIENT_SECRET,
    }),
  });
  if (!res.ok) {
    throw new Error(`取得 TDX token 失敗：HTTP ${res.status}`);
  }
  const json = await res.json();
  // 提早 5 分鐘視為過期，避免剛好在邊界失效
  const ttlSec = Math.max((json.expires_in || 86400) - 300, 60);
  memoryToken = { value: json.access_token, expiresAt: now + ttlSec * 1000 };
  await cache.put(
    cacheKey,
    new Response(JSON.stringify(memoryToken), {
      headers: { "cache-control": `max-age=${ttlSec}` },
    })
  );
  return memoryToken.value;
}

function corsHeaders(request, env) {
  const origin = request.headers.get("Origin") || "";
  const allowed = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const allowOrigin = allowed.includes(origin) ? origin : allowed[0] || "";
  return {
    "Access-Control-Allow-Origin": allowOrigin,
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Expose-Headers": "Retry-After",
    Vary: "Origin",
  };
}

function json(body, status, extraHeaders) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

export default {
  async fetch(request, env, ctx) {
    const cors = corsHeaders(request, env);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }
    if (request.method !== "GET") {
      return json({ message: "Method Not Allowed" }, 405, cors);
    }

    const url = new URL(request.url);
    if (!ALLOWED_PREFIXES.some((p) => url.pathname.startsWith(p))) {
      return json({ message: "Not Found" }, 404, cors);
    }

    // 統一要求 JSON 格式
    url.searchParams.set("$format", "JSON");
    const upstreamUrl = `${TDX_ORIGIN}${url.pathname}?${url.searchParams}`;

    // 1) 先查邊緣快取
    const cache = caches.default;
    const cacheKey = new Request(upstreamUrl, { method: "GET" });
    const hit = await cache.match(cacheKey);
    if (hit) {
      const res = new Response(hit.body, hit);
      Object.entries(cors).forEach(([k, v]) => res.headers.set(k, v));
      res.headers.set("X-Proxy-Cache", "HIT");
      return res;
    }

    // 2) 沒有快取才真的打 TDX
    let token;
    try {
      token = await getAccessToken(env);
    } catch (err) {
      return json({ message: err.message }, 502, cors);
    }

    let upstream = await fetch(upstreamUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Accept-Encoding": "br, gzip",
      },
    });

    // token 可能被撤銷：清掉快取重拿一次
    if (upstream.status === 401) {
      memoryToken = null;
      await cache.delete(new Request("https://tdx-token.internal/token"));
      try {
        token = await getAccessToken(env);
      } catch (err) {
        return json({ message: err.message }, 502, cors);
      }
      upstream = await fetch(upstreamUrl, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Accept-Encoding": "br, gzip",
        },
      });
    }

    if (!upstream.ok) {
      // 429 時把 Retry-After 傳回前端，讓前端知道要等多久
      const headers = { ...cors };
      const retryAfter = upstream.headers.get("Retry-After");
      if (retryAfter) headers["Retry-After"] = retryAfter;
      const text = await upstream.text();
      return new Response(text, {
        status: upstream.status,
        headers: {
          "content-type": "application/json; charset=utf-8",
          ...headers,
        },
      });
    }

    const ttl = cacheTtlFor(url.pathname);
    const body = await upstream.arrayBuffer();
    const toCache = new Response(body, {
      status: 200,
      headers: {
        "content-type": "application/json; charset=utf-8",
        "cache-control": `public, max-age=${ttl}`,
      },
    });
    ctx.waitUntil(cache.put(cacheKey, toCache.clone()));

    const res = new Response(body, toCache);
    Object.entries(cors).forEach(([k, v]) => res.headers.set(k, v));
    res.headers.set("X-Proxy-Cache", "MISS");
    return res;
  },
};
