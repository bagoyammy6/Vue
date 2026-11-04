/**
 * 所有 TDX 請求都從這裡出去。
 *
 * - 呼叫的是自己的 Cloudflare Worker (VUE_APP_API_BASE)，不再直接打 TDX，
 *   前端完全不需要、也不應該知道 client_secret。
 * - 記憶體快取 + 合併同時發出的相同請求 (in-flight dedupe)：
 *   同一個網址在 TTL 內只會真的送出一次。
 * - 檢查 HTTP 狀態碼：429 時等待後重試一次，仍失敗就丟出 TdxError，
 *   讓畫面可以顯示「請稍後再試」而不是把錯誤物件當成資料渲染。
 */

const API_BASE = (
  process.env.VUE_APP_API_BASE || "https://tdx.transportdata.tw"
).replace(/\/$/, "");

export class TdxError extends Error {
  constructor(status, message) {
    super(message);
    this.name = "TdxError";
    this.status = status;
  }
}

const cache = new Map(); // url -> { expiresAt, data }
const inflight = new Map(); // url -> Promise

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

function buildUrl(path, params = {}) {
  const query = Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null && v !== "")
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
  return `${API_BASE}${path}${query ? `?${query}` : ""}`;
}

async function request(url, retries = 1) {
  const res = await fetch(url);
  if (res.status === 429 && retries > 0) {
    const retryAfter = Number(res.headers.get("Retry-After")) || 2;
    await sleep(Math.min(retryAfter, 10) * 1000);
    return request(url, retries - 1);
  }
  if (!res.ok) {
    const message =
      res.status === 429
        ? "資料請求太頻繁 (429)，請稍等一下再試"
        : `資料載入失敗 (HTTP ${res.status})`;
    throw new TdxError(res.status, message);
  }
  return res.json();
}

/**
 * @param {string} path  例如 "/api/basic/v2/Bike/Station/City/Taipei"
 * @param {object} params 例如 { $select: "StationUID,StationName" }
 * @param {number} ttlMs  快取時間 (毫秒)
 */
export function tdxGet(path, params = {}, ttlMs = 5 * 60 * 1000) {
  const url = buildUrl(path, params);
  const hit = cache.get(url);
  if (hit && hit.expiresAt > Date.now()) return Promise.resolve(hit.data);
  if (inflight.has(url)) return inflight.get(url);

  const p = request(url)
    .then((data) => {
      cache.set(url, { data, expiresAt: Date.now() + ttlMs });
      return data;
    })
    .finally(() => inflight.delete(url));
  inflight.set(url, p);
  return p;
}

/** 統一的錯誤提示 */
export function showApiError(err) {
  // eslint-disable-next-line no-console
  console.error(err);
  alert(err instanceof TdxError ? err.message : "發生未預期的錯誤，請稍後再試");
}
