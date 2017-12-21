const expect = require('chai').expect;
const { AuthUserForm } = require('./page-objects/');
const authUserForm = new AuthUserForm();

describe('Страница авторизации', () => {
  beforeEach(() => {
    authUserForm.getPage();
  });

  it(`Форма с именем ${authUserForm.pageFormName} присутствует`, () => {
    return expect(authUserForm.isFromExist()).to.eventually.is.true;
  });

  describe('Обязательные поля формы', () => {
    // Название шаблонов поиска нужных полей ввода
    const fieldsPatternsNames = authUserForm.fieldNamesPatternsCalled;

    describe('Ввод корректных данных валиден', () => {
      const validDataContainer = authUserForm.validData;

      Object.keys(validDataContainer).forEach(validDataFieldName => {
        const currentFieldValidData = validDataContainer[validDataFieldName];
        const currentFieldPatternName = fieldsPatternsNames[validDataFieldName];
        const currentInputField = authUserForm[currentFieldPatternName];

        it(`Поле ${validDataFieldName}`, () => {
          const checkStatus = authUserForm.setValueAndCheckFieldValid(currentInputField, currentFieldValidData);
          return expect(checkStatus).to.eventually.is.true;
        });
      })
    });

    describe('Ввод некорректных данных невалиден', () => {
      const inValidDataContainer = authUserForm.inValidData;

      Object.keys(inValidDataContainer).forEach(inValidDataFieldName => {
        describe(`Ввод невалидных данных в поле ${inValidDataFieldName}`, () => {
          const currentFieldInValidData = inValidDataContainer[inValidDataFieldName];
          const currentFieldPatternName = fieldsPatternsNames[inValidDataFieldName];
          let currentInputField;

          beforeEach(() => {
            currentInputField = authUserForm[currentFieldPatternName];
          });

          currentFieldInValidData.forEach(inValidData => {
            it(inValidData.description, () => {
              const checkStatus = authUserForm.setValueAndCheckFieldValid(currentInputField, inValidData.data);
              return expect(checkStatus).to.eventually.is.false;
            });
          });
        });
      });
    });

    describe('Поведение ui-router $state', () => {

      describe(`Перенаправление на ${authUserForm.url}`, () => {
        beforeEach(() => {
          browser.get('/');
        });

        it(`При входе на сайт срабатывает перенаправление`, () => {
          expect(browser.getCurrentUrl()).to.eventually.to.include(authUserForm.url);
        });
      });

      describe('Авторизация и изменение $state', () => {

        it(`Корректная отправка формы меняет $state на ${authUserForm.authorizedStateName}`, () => {
          authUserForm.fillFormAndSubmit();

          // Не удалось довести до принципа DRY код ниже
          // Не работает ни промисификация, ни передача внешнего callback
          browser.executeAsyncScript((callback) => {
            const el = document.querySelector('[ng-app="App"]');
            const injector = angular.element(el).injector();
            const service = injector.get('$state');

            callback(service.current.name)
          }).then(stateName => {
            expect(stateName).to.be.equal(authUserForm.authorizedStateName);
          });
        });

        it('Корректная отправка формы добавляет поле user в сервис AuthUserService', () => {
          authUserForm.fillFormAndSubmit();

          browser.executeAsyncScript((callback) => {
            const el = document.querySelector('[ng-app="App"]');
            const injector = angular.element(el).injector();
            const service = injector.get('AuthUserService');

            callback(service)
          }).then(service => {
            expect(service.user).to.not.be.undefined;
          });
        });

      });
    });
  });
});