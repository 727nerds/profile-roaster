import { TurnstileVerifyResponse } from "./types";

export default async function turnstileVerify(token: string) {
    const secret = process.env.NODE_ENV === 'development' ? '1x0000000000000000000000000000000AA' : process.env.TURNSTILE_SECRET!;
    try {
        const response = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                secret: secret,
                response: token,
            }),
        });
        const data = await response.json() as TurnstileVerifyResponse;

        if (response.ok) {
            return data.success;
        } else {
            return false;
        }
    } catch (error) {
        return false;
    }
}