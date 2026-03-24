import OpenAI from 'openai';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, apikey',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    // 初始化 OpenAI Client，支援代理到 Supabase 或直連
    const openai = new OpenAI({
      apiKey: env.OPENAI_API_KEY,
      baseURL: env.OPENAI_BASE_URL || 'https://api.openai.com/v1',
    });

    try {
      // === 圖像生成端點 ===
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
          return new Response(JSON.stringify({ error: 'prompt is required' }), {
            status: 400,
            headers: { 'Content-Type': 'application/json', ...corsHeaders },
          });
        }

        const response = await openai.images.generate({
          prompt,
          model,
          n,
          size,
          quality,
          response_format,
        });

        return new Response(JSON.stringify(response), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // === Chat Completions 端點 ===
      if (request.method === 'POST' && url.pathname === '/v1/chat/completions') {
        const body = await request.json();
        const { messages, model = 'gpt-3.5-turbo', stream = false, ...rest } = body;

        const completion = await openai.chat.completions.create({
          messages,
          model,
          stream,
          ...rest,
        });

        return new Response(JSON.stringify(completion), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // === 逆向代理到 Supabase submit-image-task ===
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
        return new Response(JSON.stringify(data), {
          status: res.status,
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      // === 健康檢查 ===
      if (request.method === 'GET' && url.pathname === '/health') {
        return new Response(JSON.stringify({ status: 'ok', service: 'kio-gateway' }), {
          headers: { 'Content-Type': 'application/json', ...corsHeaders },
        });
      }

      return new Response('Not Found', { status: 404, headers: corsHeaders });

    } catch (error) {
      console.error('Error:', error);
      return new Response(
        JSON.stringify({ error: { message: error.message, type: 'api_error' } }),
        { status: 500, headers: { 'Content-Type': 'application/json', ...corsHeaders } }
      );
    }
  },
};
