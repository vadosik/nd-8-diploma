'use strict';
describe('Модуль AuthUser', () => {
  let authModule;

  before(() => {
    authModule = angular.module('AuthUser');
  });

  it('Модуль зарегистрирован', () => {
    chai.expect(authModule).not.equal(null);
  });

  describe('Подключаемые зависимости', () => {
    const injectedModules = [
      'Router',
      'ngMessages',
      'RestQueries',
      'RealTime'
    ];

    injectedModules.forEach((injectedModule) => {
      it(`Должен включать ${injectedModule}`, () => {
        chai.expect(authModule.requires).to.include(injectedModule);
      });
    });
  });

  describe('Сервис AuthUserService', () => {
    let authUserService;

    beforeEach(module('AuthUser'));

    beforeEach(inject((AuthUserService) => {
      authUserService = AuthUserService;
    }));

    it('Содержит функцию loginUser()', () => {
      chai.expect(authUserService.loginUser).instanceOf(Function);
    });

    it('По умолчанию поле user не определено', () => {
      chai.expect(authUserService.user).is.undefined;
    });

  });
});