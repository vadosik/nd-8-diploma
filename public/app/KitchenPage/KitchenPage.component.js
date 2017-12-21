'use strict';
angular.module('App')
  .component('kitchenPage', {
    templateUrl: './app/KitchenPage/KitchenPage.html',
    controller: function (AuthUserService, RealTimeService) {
      const $ctrl = this;

      $ctrl.user = AuthUserService.user;

      RealTimeService.on('userUpdated', function (userData) {
        $ctrl.user = AuthUserService.user = userData;
      });
    }
  });