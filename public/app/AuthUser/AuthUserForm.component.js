'use strict';
angular.module('AuthUser')
  .component('authUserForm', {
    templateUrl: './app/AuthUser/AuthUserForm.html',
    controller: function (AuthUserService) {
      const $ctrl = this;

      $ctrl.nameIsCorrect = false;

      $ctrl.loginUser = function(userData) {
        AuthUserService.loginUser(userData);
      };
    }
  });