import PrTreeViewer from './models/PrTreeViewer';

const start = () => {
  const prTreeViewer = new PrTreeViewer();
  prTreeViewer.render();
};

const pjaxContainer = document.querySelector('[data-pjax-container]');
const rootMutationObserver = new MutationObserver(start);

rootMutationObserver.observe(pjaxContainer, {
  childList: true
});

start();
