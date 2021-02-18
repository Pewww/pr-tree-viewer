import isEmpty from 'lodash.isempty';

import { getRandomId } from '../lib/random';
import {
  getImageOfFileExtension,
  getImageOfOpenedFolder,
  getImageOfClosedFolder
} from '../lib/image';
import {
  IMAGE_SIZE,
  $DIFFSTAT_ADDED,
  $DIFFSTAT_DELETED,
  $DIFFSTAT_NEUTRAL
} from '../constants/variables';
import { CustomDiffStatType } from '../enums/DiffStat';

interface IRoot {
  [key: string]: any;
}

interface IVirtualDOM {
  type: string;
  props: {
    name: string;
    fullName: string;
    id: string;
    onClick: (e: MouseEvent) => void;
  },
  children: IVirtualDOM[];
}

interface IDiffStat {
  changed: number;
  types: string[];
}

interface IDiffStats {
  [key: string]: IDiffStat;
}

export default class ChangedFiles {
  private root: IRoot;
  private rootClassName: string;

  constructor() {
    this.root = {};
    this.rootClassName = 'file-info';
    this.setStyle();
  }

  private setStyle() {
    const style = document.createElement('style');
    style.type = 'text/css';

    const css = `
      #pr-tree-viewer {
        font-size: 14px;
        list-style: none;
      }

      #pr-tree-viewer ul {
        padding-left: 15px;
      }

      #pr-tree-viewer ul li {
        list-style: none;
      }

      #pr-tree-viewer img, #pr-tree-viewer span {
        vertical-align: middle;
        margin-left: 5px;
      }

      #pr-tree-viewer ul li.folder > img {
        margin-left: 8px;
      }

      #pr-tree-viewer span.file-name {
        margin-left: 12px;
      }

      #pr-tree-viewer img {
        width: ${IMAGE_SIZE}px;
      }

      #pr-tree-viewer span:hover {
        cursor: pointer;
        text-decoration: underline;
      }

      #pr-tree-viewer #diff-stat {
        display: inline-block;
        vertical-align: middle;
        height: 22px;
        margin-right: 10px;
      }

      #pr-tree-viewer #diff-stat .diff-text {
        font-size: 12px;
        padding-right: 3px;
      }

      #pr-tree-viewer #diff-stat .stat-type {
        display: inline-block;
        vertical-align: middle;
        width: 7px;
        height: 7px;
        margin-left: 1px;
      }

      #pr-tree-viewer #diff-stat .added {
        background-color: ${$DIFFSTAT_ADDED};
      }

      #pr-tree-viewer #diff-stat .deleted {
        background-color: ${$DIFFSTAT_DELETED};
      }

      #pr-tree-viewer #diff-stat .neutral {
        background-color: ${$DIFFSTAT_NEUTRAL};
      }
    `;

    style.appendChild(
      document.createTextNode(css)
    );

    document.head.appendChild(style);
  }

  private getFileSrcs() {
    const fileSrcTags = Array.from(
      document.querySelectorAll(`.${this.rootClassName} a.link-gray-dark`)
    );

    return fileSrcTags.map(({ title }: HTMLElement) =>
      title.includes('→')
        ? title.split('→')[1].trim()
        : title
      );
  }

  private filterToCustomDiffStat(diffStatTag: HTMLElement) {
    const changed = parseInt(
      diffStatTag.innerText.replace(/,/g, ''),
      10
    );
    const types = Array.from(diffStatTag.children).map(diffStat =>
      CustomDiffStatType[diffStat.classList.value]
    );

    return {
      changed,
      types
    };
  }

  private getDiffStats(fileSrcs: string[]) {
    const diffStatTags = Array.from(
      document.querySelectorAll(`.${this.rootClassName} span.diffstat`)
    );
    const customDiffStats = {};

    fileSrcs.forEach((src, index) => {
      customDiffStats[src] = this.filterToCustomDiffStat(
        diffStatTags[index] as HTMLElement
      );
    });

    return customDiffStats;
  }

  private toggle(id: string) {
    const clickedElement = document.getElementById(id);

    if (clickedElement.parentElement.classList.contains('opened')) {
      clickedElement.parentElement.classList.remove('opened');
      clickedElement.previousElementSibling.replaceWith(
        getImageOfClosedFolder()
      );
      (clickedElement.nextElementSibling as HTMLElement).style.display = 'none';
    } else {
      clickedElement.parentElement.classList.add('opened');
      clickedElement.previousElementSibling.replaceWith(
        getImageOfOpenedFolder()
      );
      (clickedElement.nextElementSibling as HTMLElement).style.display = 'block';
    }
  }

  private scrollToDestination(fullName: string) {
    const fileSrcTags = Array.from(
      document.querySelectorAll(`.${this.rootClassName} a.link-gray-dark`)
    );
    const targetIdx = fileSrcTags.findIndex(({ title }: HTMLAnchorElement) =>
      title.endsWith(fullName)
    );

    if (targetIdx === -1) {
      return alert('Cannot find file name!');
    }

    const checkBoxes = Array.from(
      document.getElementsByClassName('js-reviewed-checkbox')
    ) as HTMLInputElement[];    

    if (checkBoxes[targetIdx].checked) {
      checkBoxes[targetIdx].click();
    }

    fileSrcTags[targetIdx].scrollIntoView();
  }

  private createNestedLayer(arr: string[], idx: number, next: IRoot) {
    const currVal = arr[idx];

    if (!currVal) {
      return;
    }

    next[currVal] = {
      ...next[currVal],
    };

    this.createNestedLayer(arr, idx + 1, next[currVal]);
  }

  private createVirtualDOM(target: IRoot, parentName: string) {
    if (isEmpty(target)) {
      return;
    }

    return Object.keys(target).map(key => {
      const id = getRandomId();
      const fullName = parentName
        ? `${parentName}/${key}`
        : key;

      return {
        type: 'li',
        props: {
          name: key,
          fullName,
          id,
          onClick: (e: MouseEvent) => {
            e.stopPropagation();
            isEmpty(target[key])
              ? this.scrollToDestination(fullName)
              : this.toggle(id);
          },
        },
        children: this.createVirtualDOM(
          target[key],
          fullName
        )
      };
    });
  }
  
  private renderDiffStat(diffStat: IDiffStat) {
    const {
      changed,
      types
    } = diffStat;
    
    if (Number.isNaN(changed) || types.includes(undefined)) {
      return;
    }

    const div = document.createElement('div');
    div.setAttribute('id', 'diff-stat');

    const textSpan = document.createElement('span');
    textSpan.classList.add('diff-text');
    textSpan.innerText = changed.toLocaleString();

    const typeSpans = types.map(type => {
      const span = document.createElement('span');
      span.classList.add(type, 'stat-type');

      return span;
    });

    div.append(textSpan, ...typeSpans);

    return div;
  }

  private createElement(node: IVirtualDOM, diffStats: IDiffStats) {
    const element = document.createElement(node.type);
    const {
      id,
      name,
      onClick,
      fullName
    } = node.props;

    const span = document.createElement('span');

    span.setAttribute('id', id);
    span.innerText = name;
    span.addEventListener('click', onClick);

    if (node.children) {
      const ul = document.createElement('ul');
      const image = getImageOfOpenedFolder();

      element.append(image, span, ul);
      element.classList.add('opened', 'folder');
    } else {
      const image = getImageOfFileExtension(name);
      const diffStatElement = this.renderDiffStat(
        diffStats[fullName]
      );
      span.classList.add('file-name');

      const appendingElements = diffStatElement
        ? [span, image, diffStatElement]
        : [span, image];

      element.append(...appendingElements);
    }

    node.children
      ?.map(child => this.createElement(child, diffStats))
      .forEach(elem => {
        element.lastElementChild.appendChild(elem);
      });

    return element;
  }

  public render() {
    const fileSrcs = this.getFileSrcs();
    
    if (isEmpty(fileSrcs)) {
      return null;
    }

    fileSrcs.forEach(src => {
      const splitedSrc = src.split('/');
      this.createNestedLayer(splitedSrc, 0, this.root);
    });

    const virtualDOM = this.createVirtualDOM(this.root, '');
    const elements = [];
    const diffStats = this.getDiffStats(fileSrcs);

    virtualDOM.forEach(node => {
      const element = this.createElement(node, diffStats);
      elements.push(element);
    });

    const rootElement = document.createElement('ul');
    rootElement.setAttribute('id', 'pr-tree-viewer');
    rootElement.append(...elements);

    return rootElement;
  }

  // diff stat optional 하게
}
