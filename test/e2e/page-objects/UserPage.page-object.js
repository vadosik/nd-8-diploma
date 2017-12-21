module.exports = class UserPage {
  constructor() {
    this.url = '/#!/';
    this.ordersContainerRepeaterName = 'order in $ctrl.user.orders';
  }

  getPage() {
    browser.get(this.url);
  }

  get ordersList() {
    try {
      return element.all(by.repeater(this.ordersContainerRepeaterName));

    } catch (error) {
      return error;
    }
  }

  get lastOrder() {
    try {
      return this.ordersList.last();

    } catch (error) {
      return error;
    }

  }

  async getOrdersCount() {
    try {
      return await this.ordersList.count();

    } catch (error) {
      return error;
    }
  }

  async goToUserPage() {
    try {
      const appRootElement = element(by.css('[ng-app="App"'));

      browser.executeScript(() => {
        const el = document.querySelector('[ng-app="App"]');
        const injector = angular.element(el).injector();
        const service = injector.get('$state');
        service.go('authorized');

      }, appRootElement);

      browser.sleep(500);

    } catch (error) {
      return error;
    }
  }
};