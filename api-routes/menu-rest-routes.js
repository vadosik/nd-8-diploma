const menuApiPath = '/api/v1/menu';

module.exports = (app, db) => {
  const menuCollection = db.collection('menu');

  app.get(menuApiPath, (req, res) => {
    try {
      const menuCursor = menuCollection.find({});
      const menuItems = [];

      menuCursor.forEach(
        function (document) {
          menuItems.push(document);
        },

        function (error) {
          if (error) {
            return sendServerError(error, res);
          }

          return res.send(menuItems);
        }
      );
    } catch (error) {
      return sendServerError(error, res);
    }
  });
};

// States handling
function sendNotValidRequest(response) {
  response.statusCode = 400;
  response.send('Not valid request');
  return false;
}

function sendNotFound(response) {
  response.statusCode = 404;
  response.send('Not found');
  return false;
}

function sendServerError(error, response) {
  console.error(error);
  response.statusCode = 500;
  response.send('Internal server error');
  return false;
}

function serverResponse(data) {
  return {serverResponse: data};
}