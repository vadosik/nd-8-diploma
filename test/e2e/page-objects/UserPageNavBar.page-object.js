module.exports = class UserPageNavBar {
  constructor() {
    this.userNameFieldClassName = 'user-name-field';
    this.userCreditsFieldClassName = 'user-credits-field';
    this.addCreditsBtnClassName = 'add-credits-btn';
  }

  getPage() {
    browser.get(this.url);
  }

  get addCreditsBtn() {
    return element(by.css(`a.${this.addCreditsBtnClassName}`));
  }

  async isNavBarExist() {
    try {
      return await browser.isElementPresent(by.css(`user-page-nav-bar`));

    } catch (error) {
      return error;
    }
  }

  async getNameFromNavBar() {
    try {
      const userNameBlock = await element(by.css(`.${this.userNameFieldClassName}`));
      return await userNameBlock.getText();

    } catch (error) {
      return error;
    }
  }

  async getCreditsFromNavBar() {
    try {
      const userNameBlock = await element(by.css(`.${this.userCreditsFieldClassName}`));
      return await userNameBlock.getText();

    } catch (error) {
      return error;
    }
  }

};