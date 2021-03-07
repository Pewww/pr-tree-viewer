import isEmpty from 'lodash.isempty';
import compact from 'lodash.compact';

import ChangedFiles from './ChangedFiles';
import Viewed from './Viewed';
import Option from './Option';
import RemoveButton from './RemoveButton';
import $eventBus from './EventBus';

export default class PrTreeViewer {
  private changedFiles: ChangedFiles;
  private viewed: Viewed;
  private option: Option;
  private removeButton: RemoveButton;
  private mutationObserver: MutationObserver;
  private resizeObserver: ResizeObserver;

  constructor() {
    this.changedFiles = new ChangedFiles();
    this.viewed = new Viewed();
    this.option = new Option();
    this.removeButton = new RemoveButton();

    this.setMutationObserver();
    this.setResizeObserver();
    this.observeEventBus();
  }

  private get rootElement() {
    return document.getElementById('pr-tree-viewer-root');
  }
  
  private get filesElement() {
    return document.getElementById('files');
  }

  private get commitElement() {
    return document.getElementsByClassName('commit')[0] as HTMLElement;
  }

  private get filesBucketElement() {
    return document.getElementById('files_bucket');
  }

  private get diffbarElement() {
    return document.getElementsByClassName('diffbar')[0] as HTMLElement;
  }

  private get renderedResult() {
    return [
      this.viewed.render(),
      this.removeButton.render(),
      this.option.render(),
      this.changedFiles.render()
    ];
  }

  private removeExtension() {
    this.resetMutationObserver();
    this.resetResizeObserver();

    this.rootElement.remove();
    this.setInterlockedElementsMarginAgain(0);
  }

  private observeEventBus() {
    if (!this.filesBucketElement) {
      return;
    }

    $eventBus.on('remove', () => {
      this.removeExtension();
    });
  }

  private checkIsDiffContainer(target: HTMLElement) {
    return target.classList.contains('js-diff-progressive-container');
  }

  private setMutationObserver() {
    const filesBucketElement = this.filesBucketElement;

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

  private resetMutationObserver() {
    this.mutationObserver.disconnect();
  }

  private checkIsPrTreeViewerRoot(target: HTMLElement) {
    return target.getAttribute('id') === 'pr-tree-viewer-root';
  }

  private setInterlockedElementsMarginAgain(size: number) {
    const filesElement = this.filesElement;
    const commitElement = this.commitElement;

    if (!filesElement) {
      return;
    }

    filesElement.style.marginLeft = `${size}px`;

    if (commitElement) {
      commitElement.style.marginLeft = `${size}px`;
    }
  }

  private calculateMarginOfResizedElement(size: readonly ResizeObserverSize[]) {
    const [{ inlineSize }] = size;
    const sizeBuffer = 5;

    return inlineSize + sizeBuffer;
  }

  private setResizeObserver() {
    this.resizeObserver = new ResizeObserver(mutations => {
      mutations.forEach(mutation => {
        if (this.checkIsPrTreeViewerRoot(mutation.target as HTMLElement)) {
          this.setInterlockedElementsMarginAgain(
            this.calculateMarginOfResizedElement(mutation.borderBoxSize)
          );
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

      const locationTarget = this.diffbarElement;
      locationTarget.insertAdjacentElement('afterend', rootElement);
    }
  }
}
