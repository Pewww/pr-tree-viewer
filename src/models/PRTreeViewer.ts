import isEmpty from 'lodash.isempty';
import compact from 'lodash.compact';

import ChangedFiles from './ChangedFiles';
import Viewed from './Viewed';
import Option from './Option';
import $eventBus from './EventBus';

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
    this.observeEventBus();
  }

  public static get diffContainerElements() {
    return Array.from(
      document.getElementsByClassName('js-diff-progressive-container')
    ) as HTMLElement[];
  }

  private get rootElement() {
    return document.getElementById('pr-tree-viewer-root');
  }

  private get filesBucketElement() {
    return document.getElementById('files_bucket');
  }

  private get renderedResult() {
    return [
      this.viewed.render(),
      this.option.render(),
      this.changedFiles.render()
    ];
  }

  private removeAll() {
    const diffContainers = PrTreeViewer.diffContainerElements;
    const protip = document.getElementsByClassName('protip')[0];

    this.resetMutationObserver();
    this.resetResizeObserver();

    this.rootElement.remove();
    diffContainers.forEach(diffContainer => {
      diffContainer.removeAttribute('style');
      diffContainer.classList.add('reset-container-style');
    });
    protip.classList.add('reset-container-style');
  }

  private observeEventBus() {
    if (!this.filesBucketElement) {
      return;
    }

    const { unsubscribe } = $eventBus.on('remove', () => {
      this.removeAll();
      unsubscribe();
    });
  }

  private checkIsDiffContainer(target: HTMLElement) {
    return target.classList.contains('js-diff-progressive-container');
  }

  private checkIsToolBarClassChanged(mutation: MutationRecord) {
    return mutation.type === 'attributes'
      && mutation.oldValue !== (mutation.target as HTMLElement).className;
  }

  private changeRootElementPosition(target: HTMLElement) {
    const rootElement = this.rootElement;

    if (target.classList.contains('is-stuck')) {
      rootElement.classList.add('is-pr-tree-viewer-stuck');
    } else {
      rootElement.classList.remove('is-pr-tree-viewer-stuck');
    }
  }

  private setMutationObserver() {
    const filesBucketElement = this.filesBucketElement;
    const prToolBar = document.getElementsByClassName('pr-toolbar')[0];

    if (!filesBucketElement || !prToolBar) {
      return;
    }

    this.mutationObserver = new MutationObserver(mutations => {
      mutations.forEach(mutation => {
        if (this.checkIsToolBarClassChanged(mutation)) {
          this.changeRootElementPosition(mutation.target as HTMLElement);
        }

        if (this.checkIsDiffContainer(mutation.target as HTMLElement)) {
          this.render();
        }
      });
    });

    this.mutationObserver.observe(filesBucketElement, {
      childList: true,
      subtree: true
    });

    this.mutationObserver.observe(prToolBar, {
      attributes: true,
      attributeFilter: ['class'],
      attributeOldValue: true
    });
  }

  private resetMutationObserver() {
    this.mutationObserver.disconnect();
  }

  private checkIsPrTreeViewerRoot(target: HTMLElement) {
    return target.getAttribute('id') === 'pr-tree-viewer-root';
  }

  private setDiffContainersWidthAgain(size: readonly ResizeObserverSize[]) {
    const diffContainers = PrTreeViewer.diffContainerElements;
    const [{ inlineSize }] = size;
    const sizeBuffer = 5;

    if (isEmpty(diffContainers)) {
      return;
    }

    diffContainers.forEach(diffContainer => {
      diffContainer.style.width = `calc(100% - ${inlineSize + sizeBuffer}px)`; 
    });
  }

  private setResizeObserver() {
    this.resizeObserver = new ResizeObserver(mutations => {
      mutations.forEach(mutation => {
        if (this.checkIsPrTreeViewerRoot(mutation.target as HTMLElement)) {
          this.setDiffContainersWidthAgain(mutation.borderBoxSize);
        }
      });
    });
  }

  private resetResizeObserver() {
    this.resizeObserver.disconnect();
  }

  public render() {
    const renderedResult = compact(this.renderedResult);

    if (isEmpty(renderedResult)) {
      return;
    }

    if (this.rootElement) {
      const rootElement = this.rootElement;

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
