module.exports = class KitchenPage {
  constructor() {
    this.url = '/#!/kitchen';
    this.stateName = 'kitchen';
    this.newOrdersRepeater = 'order in $ctrl.user.orders | filter : {state: \'Заказано\'}';
    this.cookingOrdersRepeater = 'order in $ctrl.user.orders | filter : {state: \'Готовится\'}';
  }

  get newOrdersList() {
    return element.all(by.repeater(this.newOrdersRepeater));
  }

  get cookingOrdersList() {
    return element.all(by.repeater(this.cookingOrdersRepeater));
  }

  async getNewOrdersCount() {
     return await this.newOrdersList.count();
  }

  async getCookingOrdersCount() {
     return await this.cookingOrdersList.count();
  }

  async startCookingRandomOrder() {
    try {
      const isNewOrdersExist = await this.getNewOrdersCount();

      if (!isNewOrdersExist) {
        return null;
      }

      const awaitingOrders = await this.newOrdersList;
      const randomOrderIndex = getRandomInt(0, (Object.keys(awaitingOrders).length - 1));
      const randomOrder = awaitingOrders[randomOrderIndex];

      const randomOrderName = await randomOrder.element(by.css('h5.order-title')).getText();
      const startToCookBtn = await randomOrder.element(by.css('.btn.ng-scope'));
      await startToCookBtn.click();

      return randomOrderName;

    } catch (error) {
      return error;
    }
  }

  async finishCookingRandomOrder() {
    try {
      const isCookingOrdersExist = await this.getCookingOrdersCount();

      if (!isCookingOrdersExist) {
        return null;
      }

      const awaitingOrders = await this.cookingOrdersList;
      const randomOrderIndex = getRandomInt(0, (Object.keys(awaitingOrders).length - 1));
      const randomOrder = awaitingOrders[randomOrderIndex];

      const randomOrderName = await randomOrder.element(by.css('h5.order-title')).getText();
      const finishCookingBtn = await randomOrder.element(by.css('.btn.ng-scope'));
      
      await finishCookingBtn.click();

      return randomOrderName;

    } catch (error) {
      return error;
    }
  }

  async goToKitchen() {
    try {
      const appRootElement = element(by.css('[ng-app="App"'));

      browser.executeScript(() => {
        const el = document.querySelector('[ng-app="App"]');
        const injector = angular.element(el).injector();
        const service = injector.get('$state');
        service.go('kitchen');

      }, appRootElement);

      browser.sleep(500);

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