// Karma configuration
// Generated on Mon Dec 18 2017 07:19:04 GMT+0300 (RTZ 2 (зима))

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',


    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['mocha', 'sinon', 'promise'],


    // list of files / patterns to load in the browser
    files: [
      'public/js/angular-modules/angular.min.js',
      'node_modules/angular-mocks/angular-mocks.js',
      'public/js/lodash.js',
      'public/js/socket.io.min.js',

      'public/js/angular-modules/angular-ui-router.min.js',
      'public/js/angular-modules/angular-socket.min.js',
      'public/js/angular-modules/restangular.min.js',
      'public/js/angular-modules/angular-messages.min.js',

      'public/app/App.module.js',
      'public/app/UserPage/UserPage.component.js',
      'public/app/UserPage/UserPageNavBar.component.js',
      'public/app/UserPage/UserPageModalMenu.component.js',

      'public/app/KitchenPage/KitchenPage.component.js',

      'public/app/OrderComponents/OrderCard.component.js',
      'public/app/OrderComponents/OrderCardBtn.component.js',

      'public/app/RestaurantMenu/RestaurantMenu.module.js',
      'public/app/RestaurantMenu/RestaurantMenu.service.js',

      'public/app/AuthUser/AuthUser.module.js',
      'public/app/AuthUser/AuthUser.service.js',
      'public/app/AuthUser/AuthUser.component.js',
      'public/app/AuthUser/AuthUserForm.component.js',

      'public/app/Router/Router.module.js',
      'public/app/Router/Router.config.js',

      'public/app/RealTime/RealTime.module.js',
      'public/app/RealTime/RealTime.service.js',

      'public/app/RestQueries/RestQueries.module.js',
      'public/app/RestQueries/RestQueries.config.js',
      'public/app/RestQueries/RestQueries.service.js',

      'node_modules/chai/chai.js',
      'test/angular-unit/**/*.spec.js',
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['mocha'],


    // web server port
    port: 9876,


    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'/*, 'Firefox', 'IE'*/],

    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false,

    // Concurrency level
    // how many browser should be started simultaneous
    concurrency: Infinity
  })
};
