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

      #viewed-btns-wrapper button:disabled {
        cursor: not-allowed;
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

  private controlBtnsClickable(target: HTMLButtonElement, isClickable: boolean) {
    Array.from(target.parentElement.children).forEach((btn: HTMLButtonElement) => {
      btn.disabled = !isClickable;
    });
  }

  private hideAll(target: HTMLButtonElement) {
    this.controlBtnsClickable(target, false);

    const checkBoxes = Array.from(
      document.getElementsByClassName('js-reviewed-checkbox')
    ) as HTMLInputElement[];

    const self = this;
    const maxLoop = checkBoxes.length;
    let requestId = 0;
    let idx = 0;

    (function loop() {
      if (idx >= maxLoop) {
        window.cancelAnimationFrame(requestId);
        self.controlBtnsClickable(target, true);
        return;
      }

      requestId = window.requestAnimationFrame(loop);
      
      if (!checkBoxes[idx].checked) {
        checkBoxes[idx].click();
      }

      idx += 1;
    })();
  }

  private showAll(target: HTMLButtonElement) {
    this.controlBtnsClickable(target, false);

    const checkBoxes = Array.from(
      document.getElementsByClassName('js-reviewed-checkbox')
    ) as HTMLInputElement[];

    const self = this;
    const maxLoop = checkBoxes.length;
    let requestId = 0;
    let idx = 0;

    (function loop() {
      if (idx >= maxLoop) {
        window.cancelAnimationFrame(requestId);
        self.controlBtnsClickable(target, true);
        return;
      }

      requestId = window.requestAnimationFrame(loop);
      
      if (checkBoxes[idx].checked) {
        checkBoxes[idx].click();
      }

      idx += 1;
    })();
  }

  private renderHideBtn() {
    const button = document.createElement('button');

    button.innerText = "Hide all files"
    button.addEventListener('click', e => {
      this.hideAll(e.target as HTMLButtonElement);
    });

    return button;
  }

  private renderShowBtn() {
    const button = document.createElement('button');

    button.innerText = "Show all files"
    button.addEventListener('click', e => {
      this.showAll(e.target as HTMLButtonElement);
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
