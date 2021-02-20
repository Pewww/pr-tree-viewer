import isEmpty from 'lodash.isempty';
import compact from 'lodash.compact';

import ChangedFiles from './ChangedFiles';
import Viewed from './Viewed';
import Option from './Option';

export default class PrTreeViewer {
  private changedFiles: ChangedFiles;
  private viewed: Viewed;
  private option: Option;
  private mutationObserver: MutationObserver;
  private resizeObserver: ResizeObserver;

  constructor() {
    this.changedFiles = new ChangedFiles();
    this.viewed = new Viewed();
    this.option = new Option();

    this.setMutationObserver();
    this.setResizeObserver();
  }

  private get renderedResult() {
    return [
      this.viewed.render(),
      this.option.render(),
      this.changedFiles.render()
    ];
  }

  private checkIsDiffContainer(target: HTMLElement) {
    return target.classList.contains('js-diff-progressive-container');
  }

  private setMutationObserver() {
    const filesBucketElement = document.getElementById('files_bucket');

    if (!filesBucketElement) {
      return;
    }

    this.mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (this.checkIsDiffContainer(mutation.target as HTMLElement)) {
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
    const renderedResult = compact(this.renderedResult);

    if (isEmpty(renderedResult)) {
      return;
    }

    if (document.getElementById('pr-tree-viewer-root')) {
      const rootElement = document.getElementById('pr-tree-viewer-root');

      this.resizeObserver.observe(rootElement);

      // @ts-ignore
      rootElement.replaceChildren(...renderedResult);
    } else {
      const rootElement = document.createElement('div');
      rootElement.id = 'pr-tree-viewer-root';
      rootElement.append(...renderedResult);

      this.resizeObserver.observe(rootElement);

      const locationTarget = document.getElementById('files');
      locationTarget.prepend(rootElement);
    }
  }
}
