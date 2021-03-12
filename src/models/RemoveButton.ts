import $eventBus from './EventBus';
import { isDarkMode } from '../lib/mode';

export default class RemoveButton {
  private get filesBucketElement() {
    return document.getElementById('files_bucket');
  }

  private onClick() {
    $eventBus.emit('remove', 'remove viewer element');
  }

  public render() {
    if (!this.filesBucketElement) {
      return null;
    }

    const button = document.createElement('button');
    button.className = 'remove-btn';
    button.addEventListener('click', () => {
      this.onClick();
    });

    const img = new Image();
    const src = isDarkMode()
      ? require('../assets/icons/close-in-dark-mode.svg')
      : require('../assets/icons/close.svg');

    img.src = src;

    button.appendChild(img);

    return button;
  }
}
