'use strict';
angular.module('RestQueries')
  .config(function (RestangularProvider) {
    RestangularProvider.setBaseUrl('api/v1/')
  });