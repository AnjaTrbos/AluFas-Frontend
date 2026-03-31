export const APP_FONT_FAMILY = 'Arial, sans-serif';
export const BODY_FONT_FAMILY = "'Roboto Mono', monospace";

export const UI_COLORS = {
	// Ink scale (text / dark UI) — palette "black" slot = dark navy kept as-is
	ink900: '#0f172a',     // dark navy (kept)
	ink800: '#404040',     // HSL(0, 0%, 25%)
	ink500: '#337799',     // HSL(200, 50%, 40%) — muted/info
	ink400: '#808080',     // HSL(0, 0%, 50%)
	// Borders
	line250: '#bfbfbf',    // HSL(0, 0%, 75%)
	line300: '#bfbfbf',    // HSL(0, 0%, 75%)
	// Surfaces / backgrounds
	surface0: '#ffffff',   // HSL(0, 0%, 100%)
	surface50: '#f2f2f2',  // HSL(0, 0%, 75%) at ~95% lightness tint
	surface75: '#d9d9d9',  // HSL(0, 0%, 75%) slightly darker
	// Accent / interactive — HSL(240, 50%, 40%)
	accentBlue: '#333399',
	statusChecked: '#333399',
	checkedBgLight: '#e8e8f5',
	// Error / destructive — HSL(0, 50%, 40%)
	statusError: '#993333',
	errorBg: '#f5e8e8',
	errorText: '#993333',
	// Success — HSL(115, 50%, 40%)
	successGreen: '#3b9933',
	successGreenDark: '#2e7a27',
} as const;
