import PrTreeViewer from './models/PrTreeViewer';
import $eventBus from './models/EventBus';
import { loadFonts } from './lib/fonts';
import './index.css';

const start = () => {
  $eventBus.off('remove');

  const prTreeViewer = new PrTreeViewer();
  prTreeViewer.render();
};

const pjaxContainer = document.querySelector('[data-pjax-container]');
const rootMutationObserver = new MutationObserver(start);

rootMutationObserver.observe(pjaxContainer, {
  childList: true
});

start();
loadFonts();
