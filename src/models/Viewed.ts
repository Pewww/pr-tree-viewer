export default class Viewed {
  private viewedBtns: HTMLInputElement[];

  constructor() {
    this.viewedBtns = Array.from(
      document.getElementsByClassName('js-reviewed-checkbox')
    ) as HTMLInputElement[];
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
