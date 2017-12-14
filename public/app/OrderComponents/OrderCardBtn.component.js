'use strict';
angular.module('App')
  .component('orderCardBtn', {
    templateUrl: './app/OrderComponents/OrderCardBtn.html',
    bindings: {
      order: '<',
      state: '<'
    },
    controller: function (AuthUserService, $timeout, $rootScope, RealTimeService) {
      const vm = this;

      $timeout(function () {
        vm.calculateIsEnoughCredits();
      }, 0);

      vm.calculateIsEnoughCredits = function () {
        vm.isEnoughCredits = vm.order.price <= AuthUserService.user.credits;

        if (!vm.isEnoughCredits) {
          vm.creditsDifference = vm.order.price - AuthUserService.user.credits;
        }
      };

      vm.addCredits = function () {
        RealTimeService.emit('creditsAdded', vm.creditsDifference);
      };

      $rootScope.$on('creditsChanged', function() {
        vm.calculateIsEnoughCredits();
      });

      vm.makeOrder = function() {
        RealTimeService.emit('makeNewOrder', vm.order);
      };

      vm.startCook = function() {
        RealTimeService.emit('orderUpdate', vm.order, 'Готовится');
      };

      vm.doneCook = function() {
        RealTimeService.emit('orderUpdate', vm.order, 'Доставляется');
      };
    }
  });