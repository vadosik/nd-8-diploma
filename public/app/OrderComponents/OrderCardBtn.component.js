'use strict';
angular.module('App')
  .component('orderCardBtn', {
    templateUrl: './app/OrderComponents/OrderCardBtn.html',
    bindings: {
      order: '<',
      state: '<'
    },
    controller: function (AuthUserService, $timeout, $rootScope, RealTimeService) {
      const $ctrl = this;

      $timeout(function () {
        $ctrl.calculateIsEnoughCredits();
      }, 0);

      $ctrl.calculateIsEnoughCredits = function () {
        $ctrl.isEnoughCredits = $ctrl.order.price <= AuthUserService.user.credits;

        if (!$ctrl.isEnoughCredits) {
          $ctrl.creditsDifference = $ctrl.order.price - AuthUserService.user.credits;
        }
      };

      $ctrl.addCredits = function () {
        RealTimeService.emit('creditsAdded', $ctrl.creditsDifference);
      };

      $rootScope.$on('creditsChanged', function() {
        $ctrl.calculateIsEnoughCredits();
      });

      $ctrl.makeOrder = function() {
        RealTimeService.emit('makeNewOrder', $ctrl.order);
      };

      $ctrl.startCook = function() {
        RealTimeService.emit('orderUpdate', $ctrl.order, 'Готовится');
      };

      $ctrl.doneCook = function() {
        RealTimeService.emit('orderUpdate', $ctrl.order, 'Доставляется');
      };
    }
  });