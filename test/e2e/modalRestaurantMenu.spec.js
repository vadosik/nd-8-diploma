const expect = require('chai').expect;
const { AuthUser } = require('./page-objects/');
const { AuthUserForm } = require('./page-objects/');
const { UserPage } = require('./page-objects/');
const { UserPageModalMenu } = require('./page-objects/');

const authUser = new AuthUser();
const authUserForm = new AuthUserForm();
const userPage = new UserPage();
const userPageModalMenu = new UserPageModalMenu();

describe('Модальное окно с меню ресторана', () => {
  let userData;
  before(() => {
    authUserForm.getPage();
    authUserForm.fillFormAndSubmit();

    authUser.getUserData()
      .then(updatedUserData => userData = updatedUserData)
      .catch(error => {throw error});
  });

  it('На главной странице присутствует модальное окне', () => {
    return expect(userPageModalMenu.isModalWindowExist()).to.eventually.is.true;
  });

  it('На главной странице присутствует кнопка модального окна', () => {
    return expect(userPageModalMenu.isModalBtnExist()).to.eventually.is.true;
  });

  it('Нажатие на кнопку открытия модального окна добавляет класс open самому окну', () => {
    userPageModalMenu.openModal();
    return expect(userPageModalMenu.modalIsOpen()).to.eventually.is.true;
  });

  describe('Товары в меню', () => {

    it('Нажатие на кнопку "Заказать" добавляет товар в БД и в поле AuthService.user.orders', () => {
      const userOrdersCount = userData.orders.length;

      return (async function () {
        const addedItemName = await userPageModalMenu.addRandomMenuItem();
        const updatedUserData = await authUser.getUserData();

        const newUserOrdersCount = updatedUserData.orders.length;
        const lastOrder = updatedUserData.orders[newUserOrdersCount - 1];

        expect(newUserOrdersCount).to.equal(userOrdersCount + 1);
        expect(lastOrder.title).to.equal(addedItemName);
      })();
    });
    
    it('При добавлении заказа, он добавляется в список на странице пользователя', () => {
      return (async function () {
        const initialOrdersCount = await userPage.getOrdersCount();
        const addedOrderName = await userPageModalMenu.addRandomMenuItem();

        const newOrdersCount = await userPage.getOrdersCount();
        const lastOrder = await userPage.lastOrder;
        const lastOrderNameElement = await lastOrder.element(by.css('h5'));

        // метод .getText не работал, как я только не пытался...
        const lastOrderName = await lastOrderNameElement.getAttribute('textContent');

        expect(newOrdersCount).to.equal(initialOrdersCount + 1);
        expect(lastOrderName).to.equal(addedOrderName);
      })();
    });

  });
});
