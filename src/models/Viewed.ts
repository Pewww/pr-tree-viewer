export default class Viewed {
  private viewedBtns: any;

  constructor() {
    this.viewedBtns = Array.from(
      document.getElementsByClassName('js-reviewed-checkbox')
    );
  }

  public makeAllViewed() {
    this.viewedBtns.forEach(btn => {
      if (!btn.checked) {
        btn.click();
      }
    });
  }

  public render() {
    const div = document.createElement('div');
    return div;
  }
}
