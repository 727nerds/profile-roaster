import { Hono } from 'hono';
import { auth } from 'osu-api-extended';
import { formSchema } from './types';
import { validator } from 'hono/validator';
import buildPrompt from './promptBuilder';
import { openai } from './openai';
import { kv } from './kv';
import { cors } from 'hono/cors';

const app = new Hono();
app.use('*', cors())
await auth.login({
    type: 'v2',
    client_id: Number(process.env.OSU_CLIENT_ID),
    client_secret: process.env.OSU_CLIENT_SECRET!,
    scopes: ['public'],
    cachedTokenPath: './token.json',
});

app.get('/', (c) => {
    return c.text('hlelo hono')
})


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
        const kvKey = `${username.toLowerCase()}:${ruleset}`

        if (await kv.has(kvKey)) {
            return c.text(await kv.getItemRaw(kvKey))
        }

        const prompt = await buildPrompt(username, ruleset, language);
        const completion = await openai.chat.completions.create({
            model: 'meta-llama/llama-3.1-70b-instruct:free',
            messages: [
                // someday I'll move some of the prompts to the system.
                { role: 'system', content: 'You are a helpful assistant.' },
                { role: 'user', content: prompt }
            ]
        })
        const response = completion.choices[0].message.content!

        await kv.set(kvKey, response)

        return c.text(response);
    }
);

export default app;
