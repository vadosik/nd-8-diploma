'use strict';
angular.module('Router')
  .config(function ($stateProvider, $urlRouterProvider) {

    $stateProvider.state({
      name: 'authorization',
      url: '/authorization',
      component: 'authUser'
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
