import { Hono } from 'hono';
import { auth } from 'osu-api-extended';
import { formSchema } from './types';
import { validator } from 'hono/validator';
import buildPrompt from './promptBuilder';
import { openai } from './openai';
import { kv } from './kv';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/bun';
import turnstileVerify from './turnstileVerify';
import { logger } from 'hono/logger';
import { basicAuth } from 'hono/basic-auth';
import { metricsMiddleware, register, roastCounter } from './metrics';

const currentlyCooking: string[] = [];

const app = new Hono();
app.use('*', cors());
app.use('*', serveStatic({ root: './public' }));
app.use('*', logger());
app.use('*', metricsMiddleware);

await auth.login({
    type: 'v2',
    client_id: Number(process.env.OSU_CLIENT_ID),
    client_secret: process.env.OSU_CLIENT_SECRET!,
    scopes: ['public'],
    cachedTokenPath: './token.json',
});

app.use(
    '/metrics',
    basicAuth({
        username: process.env.METRICS_USERNAME!,
        password: process.env.METRICS_PASSWORD!,
    })
);
app.get('/metrics', async (c) => {
    const metrics = await register.metrics();
    return c.text(metrics);
});

app.post(
    '/roast/:username',
    validator('form', (value, c) => {
        const result = formSchema.safeParse(value);
        const param = c.req.param('username')?.trim().toLowerCase();
        if (!result.success) {
            return c.json({ error: result.error.errors }, 400);
        }
        if (currentlyCooking.includes(`${param}:${result.data.ruleset}:${result.data.language}`)) {
            return c.json({ error: 'alreadyCooking' }, 429);
        }
        return result.data;
    }),
    async (c) => {
        const { ruleset, language, turnstile } = c.req.valid('form');
        const username = c.req.param('username').trim().toLowerCase();
        const kvKey = `${username}:${ruleset}:${language}`;
        if (!(await turnstileVerify(turnstile))) {
            return c.json({ error: 'Invalid turnstile token' }, 400);
        }
        roastCounter.inc({ username, ruleset });

        if (await kv.has(kvKey)) {
            return c.text(await kv.getItemRaw(kvKey));
        }

        currentlyCooking.push(kvKey);
        const prompt = await buildPrompt(username, ruleset, language);
        const completion = await openai.chat.completions.create({
            model: 'meta-llama/llama-3.1-70b-instruct:free',
            messages: [
                // someday I'll move some of the prompts to the system.
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt },
            ],
        });
        const response = completion.choices[0].message.content!;

        await kv.set(kvKey, response);

        return c.text(response);
    }
);

export default app;
