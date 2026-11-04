/**
 * 將文字轉成安全的 HTML。
 * Leaflet popup 和 v-html 會把字串當成 HTML 解析，
 * 如果資料或使用者輸入裡有 <script> 之類的內容就會被執行 (XSS)。
 */
export function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** 關鍵字標色：先跳脫 HTML，再用「純文字比對」(不是正規表示式) 加上 <span> */
export function highlight(text, keyword) {
  const safe = escapeHtml(text);
  if (!keyword) return safe;
  const safeKeyword = escapeHtml(keyword);
  return safe
    .split(safeKeyword)
    .join(`<span class="highlight">${safeKeyword}</span>`);
}
