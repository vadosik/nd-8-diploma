'use strict';
angular.module('AuthUser')
  .component('authUser', {
    templateUrl: './app/AuthUser/AuthUser.html',
    controller: function (AuthUserService) {
      const vm = this;

      this.loginUser = AuthUserService.loginUser;
    }
  });