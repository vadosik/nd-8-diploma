'use strict';
angular.module('App')
  .component('userPage', {
    templateUrl: './app/UserPage/UserPage.html',
    controller: function (AuthUserService, RestaurantMenuService, RealTimeService, $rootScope, $timeout) {
      const vm = this;

      vm.user = AuthUserService.user;

      RestaurantMenuService
        .then(function (qRes) {
          vm.menu = qRes;
        })
        .catch(function (qError) {
          console.log('qError', qError)
        });

      RealTimeService.on('userUpdated', function (userData) {
        vm.user = AuthUserService.user = userData;
        $timeout(function () {
          $rootScope.$emit('creditsChanged');
        });
      });
    }
  });