const usersRestRoutes = require('./users-rest-routes');
const menuRestRoutes = require('./menu-rest-routes');

module.exports = (app, db) => {
  usersRestRoutes(app, db);
  menuRestRoutes(app, db);
  // Other routes in the future
};