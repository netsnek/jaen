import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";

type Bindings = {
  ASSETS: Fetcher;
};

const app = new Hono<{ Bindings: Bindings }>();

// Protect all routes with Basic Auth
app.use(
  "*",
  basicAuth({
    username: "limosen",
    password: "Ankara.1991",
  })
);

// Serve static assets for all other routes (after auth)
// SPA fallback: if the asset is not found, serve index.html
app.get("*", async (c) => {
  const response = await c.env.ASSETS.fetch(c.req.raw);
  if (response.status === 404) {
    // SPA fallback: serve index.html for client-side routes
    const url = new URL(c.req.url);
    url.pathname = "/index.html";
    const fallback = await c.env.ASSETS.fetch(new Request(url.toString(), c.req.raw));
    return new Response(fallback.body, {
      status: 200,
      headers: fallback.headers,
    });
  }
  return response;
});

export default app;
