'use strict';
angular.module('AuthUser')
  .component('authUserForm', {
    templateUrl: './app/AuthUser/AuthUserForm.html',
    controller: function (AuthUserService) {
      const vm = this;

      vm.nameIsCorrect = false;

      this.loginUser = function(userData) {
        AuthUserService.loginUser(userData);
      };
    }
  });