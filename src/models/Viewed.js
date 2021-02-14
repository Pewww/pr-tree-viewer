export default class Viewed {
  constructor() {
    this.viewedBtns = Array.from(
      document.getElementsByClassName('js-reviewed-checkbox')
    );
  }

  makeAllViewed() {
    this.viewedBtns.forEach(btn => {
      if (!btn.checked) {
        btn.click();
      }
    });
  }
}
