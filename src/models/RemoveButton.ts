import $eventBus from './EventBus';

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
    img.src = require('../assets/icons/close.svg');

    button.appendChild(img);

    return button;
  }
}
