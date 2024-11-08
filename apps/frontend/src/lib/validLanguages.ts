// copy paste of types.ts in backend
export const validLanguages = [
	'english',
	'spanish',
	'german',
	'italian',
	'indonesian',
	'indian',
	'chinese',
	'japanese',
	'korean',
	'french',
	'polish',
	'vietnamese',
	'arabic',
] as const;
export type Language = typeof validLanguages[number];