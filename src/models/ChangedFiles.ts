import { getRandomId } from '../lib/random';
import {
  getImageOfFileExtension,
  getImageOfOpenedFolder,
  getImageOfClosedFolder
} from '../lib/image';
import { IMAGE_SIZE } from '../constants/variables';

export default class ChangedFiles {
  private root: {
    [key: string]: object;
  };
  private rootClassName: string;

  constructor() {
    this.root = {};
    this.rootClassName = 'file-info';
    this.setStyle();
  }

  private get fileSrcs() {
    const fileSrcTags = Array.from(
      document.querySelectorAll(`.${this.rootClassName} a.link-gray-dark`)
    );

    return fileSrcTags?.map(({ title }: HTMLElement) =>
      title.includes('→')
        ? title.split('→')[1].trim()
        : title
      ) ?? [];
  }

  private setStyle() {
    const style = document.createElement('style');
    style.type = 'text/css';

    const css = `
      #pr-tree-viewer {
        font-size: 14px;
      }

      #pr-tree-viewer ul {
        padding-left: 15px;
      }

      #pr-tree-viewer li {
        list-style: none;
      }

      #pr-tree-viewer img, #pr-tree-viewer span {
        vertical-align: middle;
        margin-left: 5px;
      }

      #pr-tree-viewer li.folder > img {
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

      #pr-tree-viewer span + img {
        margin-right: 10px;
      }
    `;

    style.appendChild(
      document.createTextNode(css)
    );

    document.head.appendChild(style);
  }

  private toggle(id) {
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

  private scrollToDestination() {

  }

  private createNestedLayer(arr, idx, next) {
    const currVal = arr[idx];

    if (!currVal) {
      return;
    }

    next[currVal] = {
      ...next[currVal]
    };

    this.createNestedLayer(arr, idx + 1, next[currVal]);
  }

  private createVirtualDOM(target) {
    const targetKeys = Object.keys(target);

    if (!targetKeys.length) {
      return;
    }

    return targetKeys.map(key => ({
      type: 'li',
      props: {
        name: key,
        id: getRandomId()
      },
      children: this.createVirtualDOM(
        target[key]
      )
    }));
  }

  private createElement(node) {
    const element = document.createElement(node.type);
    const {
      id,
      name
    } = node.props;

    const span = document.createElement('span');

    span.setAttribute('id', id);
    span.innerText = name;
    span.addEventListener('click', e => {
      e.stopPropagation();
      node.children
        ? this.toggle(id)
        : this.scrollToDestination();
    });

    if (node.children) {
      const ul = document.createElement('ul');
      const image = getImageOfOpenedFolder();

      element.append(image, span, ul);
      element.classList.add('opened', 'folder');
    } else {
      const image = getImageOfFileExtension(name);
      span.classList.add('file-name');

      element.append(span, image);
    }

    node.children
      ?.map(child => this.createElement(child))
      .forEach(elem => {
        element.lastElementChild.appendChild(elem);
      });

    return element;
  }

  public render() {
    this.fileSrcs.forEach(src => {
      const splitedSrc = src.split('/');
      this.createNestedLayer(splitedSrc, 0, this.root);
    });

    const virtualDOM = this.createVirtualDOM(this.root);
    const elements = [];

    virtualDOM.forEach(node => {
      const element = this.createElement(node);
      elements.push(element);
    });

    const rootElement = document.createElement('ul');
    rootElement.setAttribute('id', 'pr-tree-viewer');
    rootElement.append(...elements);

    return rootElement;
  }

  // render - diff stat 추가
}
