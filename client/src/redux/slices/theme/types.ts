export type ThemeSliceState = {
	currentTheme: AllowedThemes;
};

export enum AllowedThemes {
	LIGHT = 'light',
	DARK = 'dark',
}
