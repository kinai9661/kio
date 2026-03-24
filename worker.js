/**
 * KIO Gateway - OpenAI Compatible API
 * Reverse-engineers: https://gjosebfngzowbcrwzxnw.supabase.co/functions/v1/submit-image-task
 * into standard OpenAI /v1/images/generations endpoint
 */

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey, x-api-key',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // ── 認證設定 ────────────────────────────────────────────────────
    const SUPABASE_URL    = 'https://gjosebfngzowbcrwzxnw.supabase.co/functions/v1';
    const SUPABASE_ANON  = env.SUPABASE_ANON_KEY  || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdqb3NlYmZuZ3pvd2Jjcnd6eG53Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzIyMzA0MjcsImV4cCI6MjA4NzgwNjQyN30.OlsHb4DZmv22j9FZ1h8pj2tvFnKlS0hsxJJW1NMxR4E';
    const SUPABASE_TOKEN = env.SUPABASE_AUTH_TOKEN || 'eyJhbGciOiJFUzI1NiIsImtpZCI6ImI0OWQ3OTkyLTI0NDItNDE3ZS05MzAxLTIzNzk1ZjE3NTJjNyIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJodHRwczovL2dqb3NlYmZuZ3pvd2Jjcnd6eG53LnN1cGFiYXNlLmNvL2F1dGgvdjEiLCJzdWIiOiJkYjI3NjI1Yi01ZjRjLTRjZjktYWE4MS01OTJkZmYyOTM3N2YiLCJhdWQiOiJhdXRoZW50aWNhdGVkIiwiZXhwIjoxNzc0MzY0MTc2LCJpYXQiOjE3NzQzNjA1NzYsImVtYWlsIjoia2luZXM5NjYxNzZAZ21haWwuY29tIiwicGhvbmUiOiIiLCJhcHBfbWV0YWRhdGEiOnsicHJvdmlkZXIiOiJzc286ZDkwZGM1ZTItMTdjNS00NGY1LWJjMjUtMWFmN2ZjZmJmZTQ1IiwicHJvdmlkZXJzIjpbInNzbzpkOTBkYzVlMi0xN2M1LTQ0ZjUtYmMyNS0xYWY3ZmNmYmZlNDUiXX0sInVzZXJfbWV0YWRhdGEiOnsiY3VzdG9tX2NsYWltcyI6e30sImVtYWlsIjoia2luZXM5NjYxNzZAZ21haWwuY29tIiwiZW1haWxfdmVyaWZpZWQiOnRydWUsImlzcyI6Imh0dHBzOi8vbWVkby5kZXYvZ29vZ2xlX21ldGFkYXRhIiwicGhvbmVfdmVyaWZpZWQiOmZhbHNlLCJzdWIiOiJraW5lczk2NjE3NkBnbWFpbC5jb20ifSwicm9sZSI6ImF1dGhlbnRpY2F0ZWQiLCJhYWwiOiJhYWwxIiwiYW1yIjpbeyJtZXRob2QiOiJzc28vc2FtbCIsInRpbWVzdGFtcCI6MTc3MjkwOTUyNSwicHJvdmlkZXIiOiJkOTBkYzVlMi0xN2M1LTQ0ZjUtYmMyNS0xYWY3ZmNmYmZlNDUifV0sInNlc3Npb25faWQiOiIzNTAxZjQ3NS0wMzEyLTQ3MTctYTU2YS1kN2ZlZWMzZDBkNTAiLCJpc19hbm9ueW1vdXMiOmZhbHNlfQ.bV3Q6DZAtxT_ETsiM0gLFPXiKTqKxPoH1czwlANF6EyQ7C98E_UwwGJZ0oT7Sai0OT_m4kpW8bypPkfquWuI5A';

    // ── Fallback OpenAI 設定 ────────────────────────────────────────
    const OPENAI_API_KEY = env.OPENAI_API_KEY || '';
    const OPENAI_BASE    = env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

    const json = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });

    // ── Supabase 請求頭 ─────────────────────────────────────────────
    const supabaseHeaders = () => ({
      'Content-Type': 'application/json',
      'apikey': SUPABASE_ANON,
      'Authorization': `Bearer ${SUPABASE_TOKEN}`,
    });

    // ── 送出任務到 Supabase ─────────────────────────────────────────
    async function submitImageTask(payload) {
      const res = await fetch(`${SUPABASE_URL}/submit-image-task`, {
        method: 'POST',
        headers: supabaseHeaders(),
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.text();
        throw new Error(`submit-image-task failed: ${res.status} ${err}`);
      }
      return res.json();
    }

    // ── 輪詢任務結果 ────────────────────────────────────────────────
    async function pollTaskResult(taskId, maxWait = 60000, interval = 2000) {
      const deadline = Date.now() + maxWait;
      while (Date.now() < deadline) {
        await new Promise(r => setTimeout(r, interval));
        const res = await fetch(`${SUPABASE_URL}/get-task-result?task_id=${taskId}`, {
          headers: supabaseHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          // 常見狀態欄位名稱:
          const status = data.status || data.state || data.task_status;
          if (status === 'completed' || status === 'done' || status === 'success') return data;
          if (status === 'failed' || status === 'error') {
            throw new Error(data.error || data.message || 'Task failed');
          }
        }
      }
      throw new Error('Task polling timeout after 60s');
    }

    // ── 將 Supabase 結果轉換為 OpenAI 格式 ─────────────────────────
    function toOpenAIImageResponse(taskResult, prompt) {
      // 嘗試多種可能的圖像 URL 欄位
      const imageUrl =
        taskResult.image_url ||
        taskResult.url ||
        taskResult.output_url ||
        taskResult.result?.url ||
        taskResult.result?.image_url ||
        (taskResult.images && taskResult.images[0]) ||
        null;

      const b64 =
        taskResult.b64_json ||
        taskResult.base64 ||
        taskResult.result?.b64_json ||
        null;

      return {
        created: Math.floor(Date.now() / 1000),
        data: [
          {
            ...(imageUrl ? { url: imageUrl } : {}),
            ...(b64 ? { b64_json: b64 } : {}),
            revised_prompt: taskResult.revised_prompt || taskResult.enhanced_prompt || prompt,
          }
        ],
        // 原始 Supabase 回應（debug 用）
        _raw: taskResult,
      };
    }

    // ════════════════════════════════════════════════════════════════
    try {

      // ── GET /health ────────────────────────────────────────────────
      if (request.method === 'GET' && url.pathname === '/health') {
        return json({ status: 'ok', service: 'kio-gateway', version: '2.0.0', backend: 'supabase' });
      }

      // ── GET /v1/models ─────────────────────────────────────────────
      if (request.method === 'GET' && url.pathname === '/v1/models') {
        return json({
          object: 'list',
          data: [
            { id: 'medo-image', object: 'model', created: 1700000000, owned_by: 'medo' },
            { id: 'dall-e-3',   object: 'model', created: 1700000000, owned_by: 'openai' },
          ]
        });
      }

      // ── POST /v1/images/generations ────────────────────────────────
      // OpenAI 標準圖像生成 endpoint，內部對接 Supabase submit-image-task
      if (request.method === 'POST' &&
         (url.pathname === '/v1/images/generations' || url.pathname === '/v1/images/generate')) {

        const body = await request.json();
        const {
          prompt,
          model           = 'medo-image',
          n               = 1,
          size            = '1024x1024',
          quality         = 'standard',
          style           = 'vivid',
          response_format = 'url',
          user,
          ...extra
        } = body;

        if (!prompt) {
          return json({ error: { message: 'prompt is required', type: 'invalid_request_error', code: 'missing_param' } }, 400);
        }

        // 解析尺寸
        const [width, height] = size.split('x').map(Number);

        // ── 構建 Supabase payload ──────────────────────────────────
        // 根據逆向工程常見欄位名稱，盡量覆蓋所有可能格式
        const supabasePayload = {
          prompt,
          model,
          n,
          width:  width  || 1024,
          height: height || 1024,
          size,
          quality,
          style,
          response_format,
          // 額外欄位（部分平台使用）
          num_images:    n,
          image_size:    size,
          aspect_ratio:  width && height ? `${width}:${height}` : '1:1',
          ...extra,
        };

        // Step 1: 送出任務
        const taskResponse = await submitImageTask(supabasePayload);

        // Step 2: 如果直接回傳圖像結果（同步模式）
        const directImage =
          taskResponse.image_url ||
          taskResponse.url ||
          taskResponse.b64_json ||
          taskResponse.base64 ||
          taskResponse.result?.url ||
          taskResponse.data?.[0]?.url;

        if (directImage) {
          return json(toOpenAIImageResponse(taskResponse, prompt));
        }

        // Step 3: 異步任務 - 輪詢等待完成
        const taskId =
          taskResponse.task_id ||
          taskResponse.id ||
          taskResponse.job_id ||
          taskResponse.request_id;

        if (taskId) {
          const result = await pollTaskResult(taskId);
          return json(toOpenAIImageResponse(result, prompt));
        }

        // Step 4: 無法識別格式，原樣回傳（debug 用）
        return json({
          created: Math.floor(Date.now() / 1000),
          data: [{ url: null, _raw: taskResponse }],
          warning: 'Unknown response format from upstream, raw data returned'
        });
      }

      // ── POST /proxy/submit-image-task ──────────────────────────────
      // 直接原始代理（不轉換格式）
      if (request.method === 'POST' && url.pathname === '/proxy/submit-image-task') {
        const body = await request.json();
        const res = await fetch(`${SUPABASE_URL}/submit-image-task`, {
          method: 'POST',
          headers: supabaseHeaders(),
          body: JSON.stringify(body),
        });
        const data = await res.json();
        return json(data, res.status);
      }

      // ── POST /v1/chat/completions ──────────────────────────────────
      // Fallback 到 OpenAI（需要設定 OPENAI_API_KEY）
      if (request.method === 'POST' && url.pathname === '/v1/chat/completions') {
        if (!OPENAI_API_KEY) {
          return json({ error: { message: 'OPENAI_API_KEY not configured', type: 'auth_error' } }, 401);
        }
        const body = await request.json();
        const { stream = false } = body;
        const res = await fetch(`${OPENAI_BASE}/chat/completions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OPENAI_API_KEY}` },
          body: JSON.stringify(body),
        });
        if (stream) {
          return new Response(res.body, {
            status: res.status,
            headers: { 'Content-Type': 'text/event-stream', 'Cache-Control': 'no-cache', ...corsHeaders },
          });
        }
        return json(await res.json(), res.status);
      }

      // ── 404 ───────────────────────────────────────────────────────
      return json({
        error: { message: `Route not found: ${request.method} ${url.pathname}`, type: 'not_found' },
        available_routes: [
          'GET  /health',
          'GET  /v1/models',
          'POST /v1/images/generations',
          'POST /proxy/submit-image-task',
          'POST /v1/chat/completions',
        ]
      }, 404);

    } catch (error) {
      console.error('Worker Error:', error.stack || error.message);
      return json(
        { error: { message: error.message || 'Internal server error', type: 'api_error' } },
        500
      );
    }
  },
};
