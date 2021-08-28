const Themes = {
  light: 'light',
  dark: 'dark',
  dark_dimmed: 'dark-dimmed'
};

export const checkTheme = () => {
  const dataColorMode = document.documentElement.getAttribute('data-color-mode');
  let theme;

  switch(dataColorMode) {
    // Sync with system
    case 'auto': {
      const isSystemDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;

      const themeAttribute = document.documentElement.getAttribute(
        isSystemDarkMode
          ? 'data-dark-theme'
          : 'data-light-theme'
      );

      theme = Themes[themeAttribute];

      break;
    };
    // Single theme - light
    case 'light': {
      theme = 'light';

      break;
    };
    // Single theme - dark, dark_dimmed
    case 'dark': {
      const themeAttribute = document.documentElement.getAttribute('data-dark-theme');

      theme = Themes[themeAttribute];

      break;
    };
  }
  
  return theme;
};
