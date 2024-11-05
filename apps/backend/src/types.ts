import { z } from "zod";

export type Ruleset = 'osu' | 'taiko' | 'fruits' | 'mania'

// github roast's languages for now
// https://github.com/codenoid/github-roast/blob/d59d9653c18a7d7ab6ce61af0496ecd927cfd912/src/routes/llama/%2Bserver.js#L15C1-L27C3
export const validLanguages = [
	'english',
	'indonesian',
	'indian',
	'chinese',
	'japanese',
	'korean',
	'french',
	'polish',
	'vietnamese',
	'arabic',
	'traditionalChinese'
] as const;
export type Language = typeof validLanguages[number];

export const formSchema = z.object({
    ruleset: z.union([z.literal('osu'), z.literal('taiko'), z.literal('fruits'), z.literal('mania')]),
    language: z.enum(validLanguages),
	turnstile: z.string().min(1),
});

export interface TurnstileVerifyResponse {
	success: boolean;
	challenge_ts: string;
	hostname: string;
	'error-codes': string[];
	action?: string;
	cdata?: string;
}