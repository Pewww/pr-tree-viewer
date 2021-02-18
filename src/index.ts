import PRTreeViewer from './models/PRTreeViewer';

const start = () => {
  const prTreeViewer = new PRTreeViewer();
  prTreeViewer.render();
};

const pjaxContainer = document.querySelector('[data-pjax-container]');
const rootMutationObserver = new MutationObserver(start);

rootMutationObserver.observe(pjaxContainer, {
  childList: true
});

start();
