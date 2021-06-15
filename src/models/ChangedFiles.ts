import isEmpty from 'lodash.isempty';
import * as fileIcons from 'file-icons-js';

import { getRandomId } from '../lib/random';
import { getImageOfOpenedFolder, getImageOfClosedFolder } from '../lib/image';
import { CustomDiffStatType } from '../enums/DiffStat';
import { STORAGE_KEY } from '../constants/storage';

type TRoot = Record<string, any>;

interface IVirtualDOM {
  type: string;
  props: {
    name: string;
    fullName: string;
    id: string;
    onClick: (e: MouseEvent) => void;
  };
  children: IVirtualDOM[];
}

interface IDiffStat {
  changed: number;
  types: string[];
}

type TDiffStats = Record<string, IDiffStat>;

export default class ChangedFiles {
  private root: TRoot;
  private rootClassName: string;

  constructor() {
    this.root = {};
    this.rootClassName = 'file-info';
  }

  private getFileSrcs() {
    const fileSrcTags = Array.from(
      document.querySelectorAll(`.${this.rootClassName} > .diffstat + a`)
    );

    return fileSrcTags.map(({ title }: HTMLElement) =>
      title.includes('→') ? title.split('→')[1].trim() : title
    );
  }

  private filterToCustomDiffStat(diffStatTag: HTMLElement) {
    const changed = parseInt(diffStatTag.innerText.replace(/,/g, ''), 10);
    const types = Array.from(diffStatTag.children).map(
      diffStat => CustomDiffStatType[diffStat.classList.value]
    );

    return {
      changed,
      types
    };
  }

  private getDiffStats(fileSrcs: string[]) {
    const isShowDiffStat = localStorage.getItem(STORAGE_KEY) === 'YES';

    if (!isShowDiffStat) {
      return;
    }

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
      (clickedElement.nextElementSibling as HTMLElement).style.display =
        'block';
    }
  }

  private scrollToDestination(fullName: string) {
    const fileSrcTags = Array.from(
      document.querySelectorAll(`.${this.rootClassName} > a`)
    ) as HTMLAnchorElement[];
    const targetIdx = fileSrcTags.findIndex(({ title }) =>
      title.endsWith(fullName)
    );

    if (targetIdx === -1) {
      return alert('Cannot find file name!');
    }

    location.href = fileSrcTags[targetIdx].href;
  }

  private createNestedLayer(arr: string[], idx: number, next: TRoot) {
    const currVal = arr[idx];

    if (!currVal) {
      return;
    }

    next[currVal] = {
      ...next[currVal]
    };

    this.createNestedLayer(arr, idx + 1, next[currVal]);
  }

  private createVirtualDOM(target: TRoot, parentName: string) {
    if (isEmpty(target)) {
      return;
    }

    return Object.keys(target).map(key => {
      const id = getRandomId();
      const fullName = parentName ? `${parentName}/${key}` : key;

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
          }
        },
        children: this.createVirtualDOM(target[key], fullName)
      };
    });
  }

  private renderDiffStat(diffStat: IDiffStat) {
    const { changed, types } = diffStat;

    if (Number.isNaN(changed) || types.includes(undefined)) {
      return;
    }

    const div = document.createElement('div');
    div.id = 'diff-stat';

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

  private createElement(node: IVirtualDOM, diffStats?: TDiffStats) {
    const element = document.createElement(node.type);
    const { id, name, onClick, fullName } = node.props;

    const span = document.createElement('span');

    span.id = id;
    span.innerText = name;
    span.addEventListener('click', onClick);

    if (node.children) {
      const ul = document.createElement('ul');
      const image = getImageOfOpenedFolder();

      element.append(image, span, ul);
      element.classList.add('opened', 'folder');
    } else {
      const icon = document.createElement('i');
      icon.setAttribute('class', `icon ${fileIcons.getClassWithColor(name)}`);

      const diffStatElement =
        diffStats && this.renderDiffStat(diffStats[fullName]);
      span.classList.add('file-name');

      const appendingElements = diffStatElement
        ? [icon, span, diffStatElement]
        : [icon, span];

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
    rootElement.id = 'pr-changed-files';
    rootElement.append(...elements);

    return rootElement;
  }
}
