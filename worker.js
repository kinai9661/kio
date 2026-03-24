export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    const OPENAI_API_KEY = env.OPENAI_API_KEY || '';
    const BASE_URL = env.OPENAI_BASE_URL || 'https://api.openai.com/v1';

    const jsonResponse = (data, status = 200) =>
      new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      });

    try {

      // ============================================================
      // GET /health - 健康檢查
      // ============================================================
      if (request.method === 'GET' && url.pathname === '/health') {
        return jsonResponse({ status: 'ok', service: 'kio-gateway', version: '1.1.0' });
      }

      // ============================================================
      // POST /v1/images/generations - 圖像生成
      // ============================================================
      if (request.method === 'POST' && url.pathname === '/v1/images/generations') {
        const body = await request.json();
        const {
          prompt,
          model = 'dall-e-3',
          n = 1,
          size = '1024x1024',
          quality = 'standard',
          response_format = 'b64_json',
        } = body;

        if (!prompt) {
          return jsonResponse({ error: { message: 'prompt is required', type: 'invalid_request_error' } }, 400);
        }

        const res = await fetch(`${BASE_URL}/images/generations`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({ prompt, model, n, size, quality, response_format }),
        });

        const data = await res.json();
        return jsonResponse(data, res.status);
      }

      // ============================================================
      // POST /v1/chat/completions - 聊天完成
      // ============================================================
      if (request.method === 'POST' && url.pathname === '/v1/chat/completions') {
        const body = await request.json();
        const { messages, model = 'gpt-4o-mini', stream = false, ...rest } = body;

        const res = await fetch(`${BASE_URL}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${OPENAI_API_KEY}`,
          },
          body: JSON.stringify({ messages, model, stream, ...rest }),
        });

        // 支援 stream 模式
        if (stream) {
          return new Response(res.body, {
            status: res.status,
            headers: {
              'Content-Type': 'text/event-stream',
              'Cache-Control': 'no-cache',
              ...corsHeaders,
            },
          });
        }

        const data = await res.json();
        return jsonResponse(data, res.status);
      }

      // ============================================================
      // POST /proxy/submit-image-task - 逆向代理到 Supabase
      // ============================================================
      if (request.method === 'POST' && url.pathname === '/proxy/submit-image-task') {
        const body = await request.json();

        const supabaseUrl = env.SUPABASE_URL || 'https://gjosebfngzowbcrwzxnw.supabase.co/functions/v1/submit-image-task';
        const supabaseAnonKey = env.SUPABASE_ANON_KEY || '';
        const supabaseAuthToken = env.SUPABASE_AUTH_TOKEN || '';

        const res = await fetch(supabaseUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': supabaseAnonKey,
            'Authorization': `Bearer ${supabaseAuthToken}`,
          },
          body: JSON.stringify(body),
        });

        const data = await res.json();
        return jsonResponse(data, res.status);
      }

      // ============================================================
      // 404 Not Found
      // ============================================================
      return new Response('Not Found', { status: 404, headers: corsHeaders });

    } catch (error) {
      console.error('Worker Error:', error);
      return jsonResponse(
        { error: { message: error.message || 'Internal server error', type: 'api_error' } },
        500
      );
    }
  },
};
