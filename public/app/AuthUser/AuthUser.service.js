'use strict';
angular.module('AuthUser')
  .factory('AuthUserService', function ($state, RestQueriesService, RealTimeService) {
    const authUserService = {
      loginUser: loginUser
    };

    RealTimeService.on('pullUserData', function () {
      RealTimeService.emit('pushUserData', authUserService.user);
    });

    return authUserService;

    function loginUser(enteredData) {
      RestQueriesService.loginUser(enteredData)
        .then(function (response) {
          authUserService.user = response.serverResponse;
          RealTimeService.emit('pushUserData', authUserService.user);
          $state.go('authorized');
        })
        .catch(function (error) {
          console.log('Login error', error);
        });
    }
  });