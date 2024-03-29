import isEmpty from 'lodash.isempty';

export default class Viewed {
  private get checkBoxes() {
    return Array.from(
      document.getElementsByClassName('js-reviewed-checkbox')
    ) as HTMLInputElement[];
  }

  private controlBtnsClickable(
    target: HTMLButtonElement,
    isClickable: boolean
  ) {
    Array.from(target.parentElement.children).forEach(
      (btn: HTMLButtonElement) => {
        btn.disabled = !isClickable;
      }
    );
  }

  private toggle(isVisible: boolean, target: HTMLButtonElement) {
    this.controlBtnsClickable(target, false);

    const checkBoxes = this.checkBoxes;

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

      const checkCondition = isVisible
        ? checkBoxes[idx].checked
        : !checkBoxes[idx].checked;

      if (checkCondition) {
        checkBoxes[idx].click();
      }

      idx += 1;
    })();
  }

  private renderHideBtn() {
    const button = document.createElement('button');

    button.innerText = 'Hide all files';
    button.addEventListener('click', e => {
      this.toggle(false, e.target as HTMLButtonElement);
    });

    return button;
  }

  private renderShowBtn() {
    const button = document.createElement('button');

    button.innerText = 'Show all files';
    button.addEventListener('click', e => {
      this.toggle(true, e.target as HTMLButtonElement);
    });

    return button;
  }

  public render() {
    if (isEmpty(this.checkBoxes)) {
      return null;
    }

    const rootElement = document.createElement('div');
    rootElement.id = 'viewed-btns-wrapper';
    rootElement.append(this.renderHideBtn(), this.renderShowBtn());

    return rootElement;
  }
}
