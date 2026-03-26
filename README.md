# KIO Gateway - Image/Video Generation

基於 Cloudflare Workers 的 OpenAI-compatible API Gateway，整合：
- 圖像生成
- 影片生成
- 內建 Web UI（含歷史紀錄 / API Debug / i18n）

---

## 功能特色

- ✅ OpenAI-compatible 請求介面
- ✅ 圖像生成：`/v1/images/generations`
- ✅ 影片生成：`/v1/videos/generations`
- ✅ 內建 UI：多語系（EN / ZH）、預覽、下載、歷史、Debug 面板
- ✅ 本地歷史：圖片/影片 URL 與 base64 均保存至瀏覽器 localStorage

---

## 專案結構

- `worker.js`：Cloudflare Worker 主程式（API + 內建 UI）
- `index.html`：獨立靜態 UI（可另外部署）
- `wrangler.toml`：Worker 設定與變數

---

## API 端點

### 系統
- `GET /`
- `GET /index.html`
- `GET /health`
- `GET /v1/models`

### 生成
- `POST /v1/images/generations`
- `POST /v1/images/generate`
- `POST /v1/videos/generations`
- `POST /v1/videos/generate`

---

## 請求範例

### 1) 圖像生成

```bash
curl -X POST https://<your-worker>.workers.dev/v1/images/generations \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A futuristic city at dusk, neon lights, cinematic",
    "model": "imagen-4",
    "size": "1024x1024",
    "n": 1,
    "response_format": "url"
  }'
```

### 2) 影片生成

```bash
curl -X POST https://<your-worker>.workers.dev/v1/videos/generations \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "A robot walking in rainy cyberpunk street",
    "model": "veo-3.1",
    "size": "1792x1024",
    "n": 1,
    "response_format": "url"
  }'
```

---

## 環境變數

目前程式採「可覆蓋 + fallback」策略。

### 必要（建議使用 `wrangler secret`）
- `MEDO_API_KEY`
- `SUPABASE_ANON_KEY`

---

## 部署

```bash
npm install
npx wrangler secret put MEDO_API_KEY
npx wrangler secret put SUPABASE_ANON_KEY
npx wrangler deploy
```

部署完成後：
- 開啟 `https://<your-worker>.workers.dev/` 使用內建 UI
- 或獨立部署 `index.html`

---

## 備註

- 歷史紀錄保存至瀏覽器 localStorage（包含 URL 與 base64 資料）
- `X-User-Api-Key` 會覆蓋預設 key
- 如需更嚴格安全策略，建議限制 CORS 與移除硬編碼 fallback
