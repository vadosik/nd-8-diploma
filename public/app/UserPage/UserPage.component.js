'use strict';
angular.module('App')
  .component('userPage', {
    templateUrl: './app/UserPage/UserPage.html',
    controller: function (AuthUserService, RestaurantMenuService, RealTimeService, $rootScope, $timeout) {
      const $ctrl = this;

      $ctrl.user = AuthUserService.user;

      RestaurantMenuService
        .then(function (qRes) {
          $ctrl.menu = qRes;
        })
        .catch(function (qError) {
          console.log('qError', qError)
        });

      RealTimeService.on('userUpdated', function (userData) {
        $ctrl.user = AuthUserService.user = userData;
        $timeout(function () {
          $rootScope.$emit('creditsChanged');
        });
      });
    }
  });