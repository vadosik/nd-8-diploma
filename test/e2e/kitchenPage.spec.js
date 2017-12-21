const expect = require('chai').expect;
const { AuthUser } = require('./page-objects/');
const { AuthUserForm } = require('./page-objects/');
const { KitchenPage } = require('./page-objects/');

const authUser = new AuthUser();
const authUserForm = new AuthUserForm();
const kitchenPage = new KitchenPage();

describe('Страница повара', () => {
  let userData;
  before(() => {
    authUserForm.getPage();
    authUserForm.fillFormAndSubmit();

    authUser.getUserData()
      .then(updatedUserData => userData = updatedUserData)
      .catch(error => {throw error});
  });
  
  it(`Изменение стейта на ${kitchenPage.stateName}, переносит нас на ${kitchenPage.url}`, () => {
    kitchenPage.goToKitchen();
    
    return browser.getCurrentUrl().then(url => {
      expect(url).to.include(kitchenPage.url);
    });
  });

  it('Количество заказов в графе "Заказы" соответствует кол-ву заказов в состоянии "Заказано" у объекта AuthService.user.orders', () => {
    kitchenPage.goToKitchen();

    return kitchenPage.getNewOrdersCount()
      .then(newOrdersCount => {
        const newOrdersCountInUserDataOrders = calculateOrdersByState(userData.orders, 'Заказано');

        expect(newOrdersCount).to.equal(newOrdersCountInUserDataOrders);
      });
  });

  it('Количество заказов в графе "Готовится" соответствует кол-ву заказов в состоянии "Готовится" у объекта AuthService.user.orders', () => {
    kitchenPage.goToKitchen();

    return kitchenPage.getCookingOrdersCount()
      .then(cookingOrdersCount => {
        const coockingOrdersCountInUserDataOrders = calculateOrdersByState(userData.orders, 'Готовится');

        expect(cookingOrdersCount).to.equal(coockingOrdersCountInUserDataOrders);
      });
  });

  it('Нажатие на кнопку "Начать готовить" переведёт заказ в графу "Готовится"', () => {
    kitchenPage.goToKitchen();

    return (async function () {
      const initialNewOrdersCount = await kitchenPage.getNewOrdersCount();
      const initialCookingOrdersCount = await kitchenPage.getCookingOrdersCount();

      await kitchenPage.startCookingRandomOrder();

      const newOrdersCountAfterStartCooking = await kitchenPage.getNewOrdersCount();
      const cookingOrdersCountAfterStartCooking = await kitchenPage.getCookingOrdersCount();

      expect(newOrdersCountAfterStartCooking).is.equal(initialNewOrdersCount - 1);
      expect(cookingOrdersCountAfterStartCooking).is.equal(initialCookingOrdersCount + 1);
    })();
  });

  it('Нажатие на кнопку "Готово" удаляет заказ из графы "Готовится" и переводит его в состояние "Доставляется"', () => {
    const initialDeliveringOrdersCount = calculateShippingStates(userData.orders);

    return (async function () {
      await kitchenPage.finishCookingRandomOrder();
      userData = await authUser.getUserData();

      const newDeliveringOrdersCount = calculateShippingStates(userData.orders);
      expect(newDeliveringOrdersCount).to.equal(initialDeliveringOrdersCount + 1);
    })();

  });

});

function calculateOrdersByState(orders, state) {
  return orders.reduce((result, order) => {
    return (order.state === state) ? ++result : result;
  }, 0);
}

function calculateShippingStates(orders) {
  return [
    calculateOrdersByState(orders, 'Доставляется'),
    calculateOrdersByState(orders, 'Подано'),
    calculateOrdersByState(orders, 'Возникли сложности'),
  ].reduce((result, stateCount) => (result += stateCount), 0);
}