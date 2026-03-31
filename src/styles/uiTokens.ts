export const APP_FONT_FAMILY = 'Arial, sans-serif';
export const BODY_FONT_FAMILY = "'Roboto Mono', monospace";

export const UI_COLORS = {
	// Ink scale (text / dark UI) — palette "black" slot = dark navy kept as-is
	ink900: '#0f172a',     // dark navy
	ink800: '#404040',     // HSL(0, 0%, 25%)
	ink500: '#337799',     // HSL(200, 50%, 40%) — muted/info
	ink400: '#808080',     // HSL(0, 0%, 50%)
	// Borders
	line300: '#bfbfbf',    // HSL(0, 0%, 75%)
	// Surfaces / backgrounds
	surface0: '#ffffff',   // white
	// Accent / interactive — HSL(240, 50%, 40%)
	accentBlue: '#333399',
	// Error / destructive — HSL(0, 50%, 40%)
	statusError: '#993333',
	// Success — HSL(115, 50%, 40%)
	successGreen: '#3b9933',
} as const;
