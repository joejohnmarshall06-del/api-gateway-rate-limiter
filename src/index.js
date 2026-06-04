export class GatewayPolicy {
  constructor(routes) { this.routes = routes; this.buckets = new Map(); }
  decide(req) {
    const route = this.routes.find((r) => match(r.path, req.path));
    if (!route) return { allow: false, status: 404 };
    if (route.auth && !req.headers?.authorization) return { allow: false, status: 401 };
    const key = `${route.path}:${req.ip}`; const bucket = this.buckets.get(key) || { tokens: route.rate, at: Date.now() };
    if (bucket.tokens <= 0) return { allow: false, status: 429 };
    bucket.tokens -= 1; this.buckets.set(key, bucket); return { allow: true, status: 200 };
  }
}
function match(pattern, path) { return pattern.endsWith("*") ? path.startsWith(pattern.slice(0, -1)) : pattern === path; }
