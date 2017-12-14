'use strict';
angular.module('App')
  .component('userPageModalMenu', {
    templateUrl: './app/UserPage/UserPageModalMenu.html',
    bindings: {
      menu: '<'
    },
    controller: function () {
      const vm = this;
    }
  });