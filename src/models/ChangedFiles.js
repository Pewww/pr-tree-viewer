import { getRandomId } from '../lib/random';
import {
  getImageOfFileExtension,
  getImageOfOpenedFolder,
  getImageOfClosedFolder
} from '../lib/image';
import { IMAGE_SIZE } from '../constants/variables';

export default class ChangedFiles {
  constructor() {
    this.root = {};
    this.rootClassName = 'file-info';
    this.setStyle();
  }

  get fileSrcs() {
    const fileSrcTags = Array.from(
      document.querySelectorAll(`.${this.rootClassName} .link-gray-dark`)
    );

    return fileSrcTags?.map(({ innerText }) => innerText) ?? [];
  }

  setStyle() {
    const style = document.createElement('style');
    style.type = 'text/css';

    const css = `
      #pr-tree-viewer-root {
        margin-left: 100px;
        font-size: 14px;
      }

      #pr-tree-viewer-root ul {
        padding-left: 20px;
      }

      #pr-tree-viewer-root li {
        list-style: none;
      }

      #pr-tree-viewer-root img, #pr-tree-viewer-root span {
        vertical-align: middle;
        margin-left: 5px;
      }

      #pr-tree-viewer-root img {
        width: ${IMAGE_SIZE}px;
      }

      #pr-tree-viewer-root span:hover {
        cursor: pointer;
        text-decoration: underline;
      }
    `;

    style.appendChild(
      document.createTextNode(css)
    );

    document.head.appendChild(style);
  }

  toggle(id) {
    const clickedElement = document.getElementById(id);

    if (clickedElement.parentElement.classList.contains('opened')) {
      clickedElement.parentElement.classList.remove('opened');
      clickedElement.previousElementSibling.replaceWith(
        getImageOfClosedFolder()
      );
      clickedElement.nextElementSibling.style.display = 'none';
    } else {
      clickedElement.parentElement.classList.add('opened');
      clickedElement.previousElementSibling.replaceWith(
        getImageOfOpenedFolder()
      );
      clickedElement.nextElementSibling.style.display = 'block';
    }
  }

  createNestedLayer(arr, idx, next) {
    const currVal = arr[idx];

    if (!currVal) {
      return;
    }

    next[currVal] = {
      ...next[currVal]
    };

    this.createNestedLayer(arr, idx + 1, next[currVal]);
  }

  createVirtualDOM(target) {
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

  setElementAttributes(element, props) {
    const {
      id,
      name
    } = props;

    const span = document.createElement('span');
    span.innerText = name;

    element.setAttribute('id', id);
    element.addEventListener('click', e => {
      e.stopPropagation();
      this.toggle(id);
    });

    element.appendChild(span);
  }

  createElement(node) {
    const element = document.createElement(node.type);
    const {
      id,
      name
    } = node.props;

    const span = document.createElement('span');
    span.setAttribute('id', id);
    span.innerText = name;

    if (node.children) {
      const ul = document.createElement('ul');
      const image = getImageOfOpenedFolder();

      span.addEventListener('click', e => {
        e.stopPropagation();
        this.toggle(id);
      });

      element.append(image, span, ul);
      element.classList.add('opened');
    } else {
      const image = getImageOfFileExtension(name);
      element.append(span, image);

      // 클릭 이벤트 추가
    }

    node.children
      ?.map(child => this.createElement(child))
      .forEach(elem => {
        element.lastElementChild.appendChild(elem);
      });

    return element;
  }

  appendElementsToRoot(elements) {
    const rootElement = document.createElement('div');
    rootElement.setAttribute('id', 'pr-tree-viewer-root');

    const ul = document.createElement('ul');
    ul.append(...elements);

    rootElement.appendChild(ul);

    return rootElement;
  }

  render() {
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
    rootElement.setAttribute('id', 'pr-tree-viewer-root');
    rootElement.append(...elements);

    return rootElement;
  }

  // render - diff stat 추가
}
