import { woff2Fonts } from '../constants/fonts';

// woff2 폰트를 불리오는데에 실패하여 강제 주입
export const loadFonts = () => {
  woff2Fonts
    .map(({ name, fileName }) => {
      const fontUrl = chrome.runtime.getURL(`fonts/${fileName}`);

      return new FontFace(name, `url("${fontUrl}") format("woff2")`);
    })
    .forEach(async fontFace => {
      const loadedFont = await fontFace.load();
      document.fonts.add(loadedFont);
    });
};
