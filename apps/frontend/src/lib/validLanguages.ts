// copy paste of types.ts in backend
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