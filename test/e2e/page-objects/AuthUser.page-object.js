module.exports = class AuthUser {
  getUserData() {
    return new Promise((done, fail) => {
      try {
        browser.executeAsyncScript((callback) => {
          const el = document.querySelector('[ng-app="App"]');
          const injector = angular.element(el).injector();
          const service = injector.get('AuthUserService');

          callback(service)
        }).then(service => {
          done(service.user);
        });
      } catch (error) {
        fail(error);
      }
    });
  }
};