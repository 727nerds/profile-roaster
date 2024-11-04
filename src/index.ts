import { Hono } from 'hono';
import { auth } from 'osu-api-extended';
import { formSchema } from './types';
import { validator } from 'hono/validator';
import buildPrompt from './promptBuilder';

const app = new Hono();
await auth.login({
    type: 'v2',
    client_id: Number(process.env.OSU_CLIENT_ID),
    client_secret: process.env.OSU_CLIENT_SECRET!,
    scopes: ['public'],
    cachedTokenPath: './token.json',
});

app.get('/', (c) => {
    return c.text('Hello Hono!');
});

app.post(
    '/roast/:username',
    validator('form', (value, c) => {
        const result = formSchema.safeParse(value);
        if (!result.success) {
            return c.json({ error: result.error.errors });
        }
        return result.data;
    }),
    async (c) => {
        const { ruleset, language } = c.req.valid('form');
        const username = c.req.param('username')

        const prompt = await buildPrompt(username, ruleset, language);
        return c.json(prompt);
    }
);

export default app;
