import { GITHUB_ENTERPRISE_FILES_URL_EXP } from './constants/regex';

chrome.tabs.onUpdated.addListener((
  tabId: number,
  changeInfo: chrome.tabs.TabChangeInfo,
  tab: chrome.tabs.Tab
) => {
  if (changeInfo?.status === 'complete' && GITHUB_ENTERPRISE_FILES_URL_EXP.test(tab.url)) {
    chrome.tabs.sendMessage(tabId, {
      message: 'Tab Updated!'
    });
  }
});
