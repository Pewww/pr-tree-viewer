import ChangedFiles from './ChangedFiles';
import Viewed from './Viewed';
import { $BORDER } from '../constants/variables';

export default class PRTreeViewer {
  private changedFiles: ChangedFiles;
  private viewed: Viewed;
  private mutationObserver: MutationObserver;
  private resizeObserver: ResizeObserver;
  private renderedResult: [HTMLDivElement, HTMLUListElement];

  constructor() {
    this.changedFiles = new ChangedFiles();
    this.viewed = new Viewed();
    this.renderedResult = [
      this.viewed.render(),
      this.changedFiles.render()
    ];

    this.setMutationObserver();
    this.setResizeObserver();

    this.setStyle();
  }

  private setStyle() {
    const style = document.createElement('style');
    style.type = 'text/css';

    const css = `
      #pr-tree-viewer-root {
        width: 290px;
        min-width: 290px;
        max-width: 600px;
        height: 650px;
        min-height: 650px;
        border: 1px solid ${$BORDER};
        border-radius: 6px;
        display: inline-block;
        vertical-align: top;
        box-sizing: border-box;
        padding: 15px;
        white-space: nowrap;
        overflow: auto;
        resize: both;
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

  private checkIsDiffContainer(target: HTMLElement) {
    return target.classList.contains('js-diff-progressive-container');
  }

  private setMutationObserver() {
    const filesBucketElement = document.getElementById('files_bucket');

    this.mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (this.checkIsDiffContainer(mutation.target as HTMLElement)) {
          this.renderedResult[1] = this.changedFiles.render();
          this.render();
        }
      });
    });

    this.mutationObserver.observe(filesBucketElement, {
      childList: true,
      subtree: true
    });
  }

  private checkIsPrTreeViewerRoot(target: HTMLElement) {
    return target.getAttribute('id') === 'pr-tree-viewer-root';
  }

  private setDiffContainerWidthAgain(size: readonly ResizeObserverSize[]) {
    const diffContainer = document.querySelector('#pr-tree-viewer-root + .js-diff-progressive-container') as HTMLElement;
    const [{ inlineSize }] = size;
    const sizeBuffer = 10;

    if (!diffContainer) {
      return;
    }

    diffContainer.style.width = `calc(100% - ${inlineSize + sizeBuffer}px)`;
  }

  private setResizeObserver() {
    this.resizeObserver = new ResizeObserver(mutations => {
      mutations.forEach(mutation => {
        if (this.checkIsPrTreeViewerRoot(mutation.target as HTMLElement)) {
          this.setDiffContainerWidthAgain(mutation.borderBoxSize);
        }
      });
    });
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

      this.resizeObserver.observe(rootElement);

      const locationTarget = document.getElementById('files');
      locationTarget.prepend(rootElement);
    }
  }
}
