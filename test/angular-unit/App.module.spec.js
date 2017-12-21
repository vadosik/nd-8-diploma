'use strict';
describe('Модуль App', () => {
  let module;

  before(() => {
    module = angular.module('App');
  });

  it('Модуль зарегистрирован', () => {
    chai.expect(module).not.equal(null);
  });

  describe('Подключаемые зависимости', () => {
    const injectedModules = [
      'AuthUser',
      'Router',
      'RestQueries',
      'RestaurantMenu',
      'RealTime'
    ];

    injectedModules.forEach((injectedModule) => {
      it(`Должен включать ${injectedModule}`, () => {
        chai.expect(module.requires).to.include(injectedModule);
      });
    });
  });
});