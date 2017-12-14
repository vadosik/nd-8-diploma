'use strict';
angular.module('RestQueries')
  .factory('RestQueriesService', function (Restangular) {
    return {
      loginUser(enteredData) {
        const userQuery = Restangular.all('users');
        return userQuery.post(enteredData);
      },

      getMenuItems() {
        return Restangular.all('menu').getList();
      }
    }
  });