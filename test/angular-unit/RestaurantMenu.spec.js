'use strict';
describe('Модуль RestaurantMenu', () => {
  let restaurantMenuModule;

  before(() => {
    restaurantMenuModule = angular.module('RestaurantMenu');
  });

  it('Модуль зарегистрирован', () => {
    chai.expect(restaurantMenuModule).not.equal(null);
  });

  describe('Подключаемые зависимости', () => {
    const injectedModules = ['RestQueries'];

    injectedModules.forEach((injectedModule) => {
      it(`Должен включать ${injectedModule}`, () => {
        chai.expect(restaurantMenuModule.requires).to.include(injectedModule);
      });
    });

  });
});