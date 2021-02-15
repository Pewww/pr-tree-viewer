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
    const style = document.createElement('style');
    style.type = 'text/css';

    const css = `
      #pr-tree-viewer-root {
        width: 290px;
        height: 600px;
        border: 1px solid #e1e4e8;
        border-radius: 6px;
        display: inline-block;
        vertical-align: top;
        box-sizing: border-box;
        padding: 15px;
        white-space: nowrap;
        overflow: auto;
      }

      #pr-tree-viewer-root + .js-diff-progressive-container {
        width: calc(100% - 300px);
        display: inline-block;
        vertical-align: top;
        margin-left: 5px;
      }
    `;

    style.appendChild(
      document.createTextNode(css)
    );

    document.head.appendChild(style);
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
          (mutation.target as HTMLElement).classList
          .contains('js-diff-progressive-container')
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

      const locationTarget = document.getElementById('files');
      locationTarget.prepend(rootElement);
    }
  }
}
