# KIO - OpenAI Compatible Image Generation Gateway

一個基於 Cloudflare Workers 的 OpenAI 相容 API 閘道，支援圖像生成功能，並附帶完整的 Web UI 介面。

## 功能特色

- ✅ OpenAI Compatible API Gateway
- ✅ 圖像生成 (DALL-E 3 / DALL-E 2 / GPT Image 1)
- ✅ 支援逆向工程輸出站 (Supabase Edge Function 代理)
- ✅ 完整響應式 Web UI
- ✅ 一鍵下載生成圖片

## 部署方式

### Cloudflare Workers

```bash
npm install
npx wrangler secret put OPENAI_API_KEY
npx wrangler deploy
```

### 使用 UI

直接開啟 `index.html` 或部署到 Cloudflare Pages / Vercel。

## API 端點

```
POST /v1/images/generations
POST /v1/chat/completions
```

## 參數說明

```json
{
  "prompt": "圖像描述",
  "model": "dall-e-3",
  "size": "1024x1024",
  "quality": "standard",
  "n": 1,
  "response_format": "b64_json"
}
```
