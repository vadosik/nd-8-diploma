const expect = require('chai').expect;
const { AuthUser } = require('./page-objects/');
const { AuthUserForm } = require('./page-objects/');
const { UserPageNavBar } = require('./page-objects/');

const authUser = new AuthUser();
const authUserForm = new AuthUserForm();
const userPageNavBar = new UserPageNavBar();

describe('Навигационная панель пользователя', () => {
  let userData;
  before(() => {
    authUserForm.getPage();
    authUserForm.fillFormAndSubmit();

    authUser.getUserData()
      .then(updatedUserData => userData = updatedUserData)
      .catch(error => {throw error});

  });

  it(`Навигационная панель присутствует`, () => {
    return expect(userPageNavBar.isNavBarExist()).to.eventually.is.true;
  });

  it('Отображается корректное имя', () => {
    const userNameInNavBar = userPageNavBar.getNameFromNavBar();
    return expect(userNameInNavBar).to.eventually.is.equal(`Имя: ${userData.name}`);
  });

  it('Отображается корректное количество кредитов', () => {
    const userCreditsInNavBar = userPageNavBar.getCreditsFromNavBar();
    return expect(userCreditsInNavBar).to.eventually.is.equal(`Кредиты: ${userData.credits}`);
  });

  it('Нажатие на кнопку "+100 кредитов" добавляет 100 кредитов', () => {
    const usersCreditsBeforeAdding = userData.credits;
    userPageNavBar.addCreditsBtn.click();

    authUser.getUserData()
      .then(updatedUserData => {
        expect(updatedUserData.credits).is.equal(usersCreditsBeforeAdding + 100);
      })
      .catch(error => {throw error});

  });

  it('Добавление кредитов меняет оторбажаемое количество на панели', () => {
    const userCreditsBeforeAdding = userData.credits;
    userPageNavBar.addCreditsBtn.click();

    return expect(userPageNavBar.getCreditsFromNavBar()).to.eventually.is.not.equal(`Кредиты: ${userCreditsBeforeAdding}`);
  });

});