const SUPABASE_URL = "https://toiedeicmxbawpwtpqvt.supabase.co";

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const targetUrl = new URL(url.pathname + url.search, SUPABASE_URL);

    // Create a new request with the original method, headers (modified), and body
    const modifiedRequest = new Request(targetUrl, {
      method: request.method,
      headers: new Headers(request.headers),
      body: request.body,
    });

    // CRITICAL: Rewrite Host header for Supabase to accept it
    modifiedRequest.headers.set("Host", new URL(SUPABASE_URL).host);

    // Handle WebSocket for Supabase Realtime
    if (request.headers.get("Upgrade") === "websocket") {
      return fetch(targetUrl.toString(), modifiedRequest);
    }

    const response = await fetch(modifiedRequest);
    
    // Create broad CORS headers for the proxy
    const newResponse = new Response(response.body, response);
    newResponse.headers.set("Access-Control-Allow-Origin", "*");
    newResponse.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    newResponse.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, x-client-info, x-supabase-auth, apikey");

    return newResponse;
  },
};
