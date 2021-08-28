import PrTreeViewer from './models/PrTreeViewer';
import $eventBus from './models/EventBus';
import { loadFonts } from './lib/fonts';
import './index.css';

// https://github.com/berzniz/github_pr_tree/blob/master/src/js/index.jsx#L13
const start = () => {
  // ID가 계속 쌓이는것을 방지하기 위해 인스턴스 생성 전 초기화
  $eventBus.off('remove');

  const prTreeViewer = new PrTreeViewer();
  prTreeViewer.render();
};

const pjaxContainer = document.querySelector('[data-pjax-container]');
const repoContentPjaxContainer = document.getElementById('repo-content-pjax-container');

const rootMutationObserver = new MutationObserver(start);

if (pjaxContainer) {
  rootMutationObserver.observe(pjaxContainer, {
    childList: true
  });
}

if (repoContentPjaxContainer) {
  rootMutationObserver.observe(repoContentPjaxContainer, {
    childList: true
  });
}

start();
loadFonts();

// chrome.runtime.onMessage.addListener(() => {
//   start();
//   loadFonts();
// });
