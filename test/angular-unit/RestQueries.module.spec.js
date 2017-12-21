'use strict';
describe('Модуль RestQueries', () => {
  let restQueriesModule;

  before(() => {
    restQueriesModule = angular.module('RestQueries');
  });

  it('Модуль зарегистрирован', () => {
    chai.expect(restQueriesModule).not.equal(null);
  });

  describe('Подключаемые зависимости', () => {
    const injectedModules = ['restangular'];

    injectedModules.forEach((injectedModule) => {
      it(`Должен включать ${injectedModule}`, () => {
        chai.expect(restQueriesModule.requires).to.include(injectedModule);
      });
    });
  });

  describe('RestQueriesService', () => {
    let restQueriesService;

    beforeEach(module('RestQueries'));

    beforeEach(inject((RestQueriesService) => {
      restQueriesService = RestQueriesService;
    }));

    it('Содержит функцию loginUser()', () => {
      chai.expect(restQueriesService.loginUser).instanceOf(Function);
    });

    it('Содержит функцию getMenuItems()', () => {
      chai.expect(restQueriesService.getMenuItems).instanceOf(Function);
    });

  });
});