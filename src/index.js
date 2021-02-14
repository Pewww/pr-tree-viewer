import ChangedFiles from './models/ChangedFiles';
import Viewed from './models/Viewed';

const changedFiles = new ChangedFiles();
const renderedResult = changedFiles.render();

console.log(renderedResult);

document.body.appendChild(renderedResult);

setTimeout(() => {
  new Viewed().makeAllViewed();
}, 3000);
