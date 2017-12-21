const usersApiPath = '/api/v1/users';

module.exports = (app, db) => {
  const usersCollection = db.collection('users');

  app.post(usersApiPath, (req, res) => {
    try {
      const incomingData = req.body;
      const incomingEmail = incomingData.email;
      const incomingName = incomingData.name;

      if (!incomingEmail || !incomingName) {
        return sendNotValidRequest(res);
      }

      const userIdSelector = {'_id': incomingEmail};

      (async function() {
        const searchableUser = await usersCollection.findOne(userIdSelector);

        if (!searchableUser) {
          const newUser = new User(incomingEmail, incomingName);
          usersCollection.insertOne(newUser);

          return res.send(serverResponse(newUser));

        } else if (incomingName !== searchableUser.name) {
          usersCollection.updateOne(userIdSelector, {$set: {'name': incomingName}});
          searchableUser.name = incomingName;
        }

        return res.send(serverResponse(searchableUser));
      })();

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

class User {
  constructor(email, name) {
    this['_id'] = email;
    this.name = name;
    this.orders = [];
    this.credits = 100;
  }
}