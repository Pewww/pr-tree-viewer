import { $BORDER, $SKY, $WHITE } from '../constants/variables';

export default class Viewed {
  constructor() {
    this.setStyle();
  }

  private setStyle() {
    const style = document.createElement('style');
    style.type = 'text/css';

    const css = `
      #viewed-btns-wrapper {
        width: 100%;
        text-align: center;
        margin-bottom: 10px;
      }

      #viewed-btns-wrapper button {
        border: 0;
        padding: 8px 20px;
        border: 1px solid ${$BORDER};
        border-radius: 6px;
        color: ${$SKY};
        font-weight: 600;
        background-color: ${$WHITE};
      }

      #viewed-btns-wrapper button:first-child {
        margin-right: 5px;
      }
    `;

    style.appendChild(
      document.createTextNode(css)
    );

    document.head.appendChild(style);
  }

  private hideAll() {
    const viewedBtns = Array.from(
      document.getElementsByClassName('js-reviewed-checkbox')
    ) as HTMLInputElement[];

    viewedBtns.forEach(btn => {
      if (!btn.checked) {
        btn.click();
      }
    });
  }

  private showAll() {
    const viewedBtns = Array.from(
      document.getElementsByClassName('js-reviewed-checkbox')
    ) as HTMLInputElement[];

    viewedBtns.forEach(btn => {
      if (btn.checked) {
        btn.click();
      }
    });
  }

  private renderHideBtn() {
    const button = document.createElement('button');

    button.innerText = "Hide all files"
    button.addEventListener('click', () => {
      this.hideAll();
    });

    return button;
  }

  private renderShowBtn() {
    const button = document.createElement('button');

    button.innerText = "Show all files"
    button.addEventListener('click', () => {
      this.showAll();
    });

    return button;
  }

  public render() {
    const rootElement = document.createElement('div');
    rootElement.setAttribute('id', 'viewed-btns-wrapper');
    rootElement.append(
      this.renderHideBtn(),
      this.renderShowBtn()
    );

    return rootElement;
  }
}
