'use strict';
angular.module('App')
  .component('userPageNavBar', {
    templateUrl: './app/UserPage/UserPageNavBar.html',
    bindings: {
      user: '<'
    },
    controller: function (RealTimeService, $timeout, $rootScope) {
      const $ctrl = this;
      
      $ctrl.addCredits = function () {
        RealTimeService.emit('creditsAdded', 100);
        $timeout(function () {
          $rootScope.$emit('creditsChanged');
        });
      }
    }
  });