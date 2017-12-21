module.exports = class UserPageModalMenu {
  constructor() {
    this.modalBtnClassName = 'modal-trigger';
    this.modalWindowClassName = 'modal-fixed-footer';
    this.modalIsOpenClassName = 'open';
    this.menuItemsRepeater = 'menuItem in $ctrl.menu';

  }

  get modalBtn() {
    return element(by.css(`.${this.modalBtnClassName}`));
  }

  get modalWindow() {
    return element(by.css(`.${this.modalWindowClassName}`));
  }

  get modalMenuItems() {
    return element.all(by.repeater(this.menuItemsRepeater));
  };

  async isModalWindowExist() {
    try {
      return await browser.isElementPresent(by.css(`.${this.modalWindowClassName}`));

    } catch (error) {
      return error;
    }
  }

  async isModalBtnExist() {
    try {
      return await browser.isElementPresent(by.css(`.${this.modalBtnClassName}`));

    } catch (error) {
      return error;
    }
  }

  async openModal() {
    try {
      const modalTriggerBtn = await this.modalBtn;
      modalTriggerBtn.click();

    } catch (error) {
      return error;
    }
  }

  async modalIsOpen() {
    try {
      const modalWindow = await this.modalWindow;
      const modalWindowClasses = await modalWindow.getAttribute('class');

      return modalWindowClasses.split(' ').some(className => className === this.modalIsOpenClassName);

    } catch (error) {
      return error;
    }
  }

  async getRandomMenuItem() {
    try {
      if (!(await this.modalIsOpen())) {
        await this.openModal();
      }

      const menuItems = await this.modalMenuItems;
      const randomItemIndex = getRandomInt(0, (Object.keys(menuItems).length - 1));
      const randomItem = menuItems[randomItemIndex];
      
      const isAddBtnExist = await randomItem.isElementPresent(by.css('.add-item-btn'));

      if (!isAddBtnExist) {
        await randomItem.element(by.css('.not-enough-credits')).click();
      }
      
      return randomItem;

    } catch (error) {
      return error;
    }
  }

  async addRandomMenuItem() {
    try {
      const randomItem = await this.getRandomMenuItem();
      const randomItemName = await randomItem.element(by.css('h5')).getText();
      const randomItemAddBtn = await randomItem.element(by.css('.add-item-btn'));
      await randomItemAddBtn.click();

      return await randomItemName;

    } catch (error) {
      return error;
    }
  }

};

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}