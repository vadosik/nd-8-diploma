'use strict';
angular.module('App')
  .component('kitchenPage', {
    templateUrl: './app/KitchenPage/KitchenPage.html',
    controller: function (AuthUserService, RealTimeService) {
      const vm = this;

      vm.user = AuthUserService.user;

      RealTimeService.on('userUpdated', function (userData) {
        vm.user = AuthUserService.user = userData;
      });
    }
  });