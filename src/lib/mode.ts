export const isDarkMode = () => {
  // Cookies에서 가져오려 했지만 color_mode 필드에 HttpOnly 속성이 걸려있다..
  return document.documentElement.getAttribute('data-color-mode') === 'dark';
};
