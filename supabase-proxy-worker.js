/**
 * HIMACHAL-SAHAYATA: Supabase Proxy Worker
 * Bypasses regional ISP blocks and optimizes connectivity in India.
 */

const SUPABASE_URL = "https://toiedeicmxbawpwtpqvt.supabase.co";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  // CRITICAL: Added 'x-supabase-api-version' to fix the NetworkError / CORS Preflight block on Auth endpoints!
  "Access-Control-Allow-Headers": "Content-Type, Authorization, x-client-info, x-supabase-auth, apikey, x-supabase-api-version, prefer, range",
};

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);

    // 1. Handle CORS Preflight (OPTIONS) requests immediately
    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }
    
    // 2. Construct the target Supabase URL
    const targetUrl = new URL(url.pathname + url.search, SUPABASE_URL);

    // 3. Prepare the modified request
    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: new Headers(request.headers),
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.arrayBuffer() : null,
    });

    // 4. CRITICAL: Rewrite the 'Host' header so Supabase recognizes the target
    modifiedRequest.headers.set("Host", new URL(SUPABASE_URL).host);

    // 5. Handle WebSockets for Supabase Realtime functionality
    if (request.headers.get("Upgrade") === "websocket") {
      return fetch(targetUrl.toString(), modifiedRequest);
    }

    // 6. Forward the request to Supabase
    const response = await fetch(modifiedRequest);
    
    // 7. Append CORS headers to the actual Supabase response
    const newResponse = new Response(response.body, response);
    Object.entries(CORS_HEADERS).forEach(([key, value]) => {
      newResponse.headers.set(key, value);
    });

    return newResponse;
  },
};
