'use strict';
angular.module('RestaurantMenu')
  .factory('RestaurantMenuService', function (RestQueriesService, $q) {
    const menuItems = (function () {
      return $q(
        function (done, fail) {
          RestQueriesService.getMenuItems()
            .then(function (res) {
              done(res);
            })
            .catch(function (error) {
              fail(error);
            });
        }
      );
    })()
    .then(function (qResponse) {
      return qResponse;
    })
    .catch(function (qError) {
      throw qError;
    });

    return menuItems;
  });