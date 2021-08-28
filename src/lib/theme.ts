const Themes = {
  light: 'light',
  dark: 'dark',
  dark_dimmed: 'dark-dimmed'
};

export const checkTheme = () => {
  const isSystemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

  const themeAttribute = document.documentElement.getAttribute(
    isSystemDarkMode
      ? 'data-dark-theme'
      : 'data-light-theme'
  );

  return Themes[themeAttribute];
};
