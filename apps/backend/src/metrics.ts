// source: https://github.com/orgs/honojs/discussions/3216

import { MiddlewareHandler } from 'hono';
import { Counter, Registry } from 'prom-client';

export const register = new Registry();
export const roastCounter = new Counter({
    name: 'roast_requests_total',
    help: 'Total number of roast requests',
    labelNames: ['username', 'ruleset'],
    registers: [register],
});

export const httpRequestCounter = new Counter({
    name: 'http_requests_total',
    help: 'Total number of HTTP requests',
    labelNames: ['method'],
    registers: [register],
});

export const httpResponseCounter = new Counter({
    name: 'http_responses_total',
    help: 'Total number of HTTP responses',
    labelNames: ['status', 'path'],
    registers: [register],
});

/** Prometheus metrics middleware that tracks HTTP requests by methods and responses by status code. */
export const metricsMiddleware: MiddlewareHandler = async (c, next) => {
    // HTTP Request.
    const { method } = c.req;
    httpRequestCounter.inc({ method });

    // Wait for other handlers to run.
    await next();

    // HTTP Response.
    const { status } = c.res;
    // Get a parameterized path name like `/posts/:id` instead of `/posts/1234`.
    // Tries to find actual route names first before falling back on potential middleware handlers like `app.use('*')`.
    const path = c.req.matchedRoutes.find((r) => r.method !== 'ALL')?.path ?? c.req.routePath;
    httpResponseCounter.inc({ status, path });
};
