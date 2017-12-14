'use strict';
angular.module('AuthUser', ['Router', 'ngMessages', 'RestQueries', 'RealTime']);

angular.module('AuthUser')
  .run(function ($state, $transitions, AuthUserService, $timeout) {

    $transitions.onStart({to: '*'}, function () {
      if (!AuthUserService.user) {
        $timeout(function () {
          $state.go('authorization');
        });
        return;
      }
    });

  });