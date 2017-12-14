'use strict';
angular.module('Router')
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state({
      name: 'authorization',
      url: '/authorization',
      component: 'authUser'
    });

    $stateProvider.state({
      name: 'logout',
      url: '/logout',
      controller: function ($rootScope, $scope, $state, AuthUserService) {
        delete AuthUserService.user;
        $state.go('authorization');
      }
    });

    $stateProvider.state({
      name: 'kitchen',
      url: '/kitchen',
      component: 'kitchenPage'
    });

    $stateProvider.state({
      name: 'authorized',
      url: '/',
      component: 'userPage'
    });

    $urlRouterProvider.otherwise('/');

  });
