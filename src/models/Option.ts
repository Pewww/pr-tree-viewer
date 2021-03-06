import { STORAGE_KEY } from '../constants/storage';

export default class Option {
  private get filesBucketElement() {
    return document.getElementById('files_bucket');
  }

  private get checked() {
    return localStorage.getItem(STORAGE_KEY) === 'YES';
  }

  private onClick(target: HTMLInputElement) {
    localStorage.setItem(STORAGE_KEY, target.checked
      ? 'YES'
      : 'NO'
    );
  }

  public render() {
    if (!this.filesBucketElement) {
      return null;
    }

    const rootElement = document.createElement('div');
    rootElement.id = 'diff-stat-show-setting';

    const label = document.createElement('label');
    label.setAttribute('for', 'diff-stat-show');

    const input = document.createElement('input');
    input.type = 'checkbox'
    input.id = 'diff-stat-show';
    input.checked = this.checked;
    input.addEventListener('click', e => {
      this.onClick(e.target as HTMLInputElement);
    });

    const span = document.createElement('span');
    span.innerText = 'Show Diffstat (Please reload)';

    const line = document.createElement('div');
    line.classList.add('seperate-line');

    label.append(input, span);
    rootElement.append(label, line);

    return rootElement;
  }
}
