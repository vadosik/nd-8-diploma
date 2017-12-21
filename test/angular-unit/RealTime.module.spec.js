'use strict';
describe('Модуль RealTime', () => {
  let realTimeModule;

  before(() => {
    realTimeModule = angular.module('RealTime');
  });

  it('Модуль зарегистрирован', () => {
    chai.expect(realTimeModule).not.equal(null);
  });

  describe('Подключаемые зависимости', () => {
    const injectedModules = ['btford.socket-io'];

    injectedModules.forEach((injectedModule) => {
      it(`Должен включать ${injectedModule}`, () => {
        chai.expect(realTimeModule.requires).to.include(injectedModule);
      });
    });

  });
});