import PrTreeViewer from './models/PrTreeViewer';
import $eventBus from './models/EventBus';
import { loadFonts } from './lib/fonts';
import './index.css';

const start = () => {
  // ID가 계속 쌓이는것을 방지하기 위해 인스턴스 생성 전 초기화
  $eventBus.off('remove');

  const prTreeViewer = new PrTreeViewer();
  prTreeViewer.render();
};

chrome.runtime.onMessage.addListener(() => {
  start();
  loadFonts();
});
