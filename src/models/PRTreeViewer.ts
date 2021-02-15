import ChangedFiles from './ChangedFiles';
import Viewed from './Viewed';

export default class PRTreeViewer {
  private changedFiles: ChangedFiles;
  private viewed: Viewed;
  private config: MutationObserverInit;
  private observer: MutationObserver;
  private renderedResult: [HTMLUListElement, HTMLDivElement];

  constructor() {
    this.changedFiles = new ChangedFiles();
    this.viewed = new Viewed();
    this.renderedResult = [
      this.changedFiles.render(),
      this.viewed.render()
    ];

    this.setConfig();
    this.setMutationObserver();

    this.setStyle();
  }

  private setStyle() {

  }

  private setConfig() {
    this.config = {
      childList: true,
      subtree: true
    };
  }

  private setMutationObserver() {
    const targetElement = document.getElementById('files_bucket');

    this.observer = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (
          Array.from(
            (mutation.target as HTMLElement).classList
          ).includes('js-diff-progressive-container')
        ) {
          this.renderedResult[0] = this.changedFiles.render();
          this.render();
        }
      });
    });

    this.observer.observe(targetElement, this.config);
  }

  public render() {
    if (document.getElementById('pr-tree-viewer-root')) {
      const rootElement = document.getElementById('pr-tree-viewer-root');
      // @ts-ignore
      rootElement.replaceChildren(...this.renderedResult);
    } else {
      const rootElement = document.createElement('div');
      rootElement.setAttribute('id', 'pr-tree-viewer-root');
      rootElement.append(...this.renderedResult);

      document.body.append(rootElement);
    }
  }
}
