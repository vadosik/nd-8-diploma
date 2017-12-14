'use strict';
module.exports = (db) => {
  const usersCollection = db.collection('users');

  const drone = require('netology-fake-drone-api');
  const app    = require('express')();
  const server = require('http').Server(app);
  const io     = require('socket.io')(server);

  server.listen(5000);

  io.on('connection', function (socket) {

    if (!socket.userData) {
      socket.emit('pullUserData');
    }

    socket.on('pushUserData', function (data) {
      socket.userData = data;
    });

    socket.on('makeNewOrder', function (data) {
      const newOrder = {
        title: data.title,
        image: data.image,
        ingredients: data.ingredients,
        price: data.price,
        state: 'Заказано'
      };
      
      (async function() {
        const userData = await usersCollection.findOne({'_id': socket.userData['_id']});
        let ordersCount = userData.orders.length;
        newOrder['_id'] = ++ordersCount;
        userData.credits -= newOrder.price;
        userData.orders.push(newOrder);

        updateUser(userData);
      })();
    });

    socket.on('creditsAdded', function (creditsAmount) {
      (async function() {
        const userData = await usersCollection.findOne({'_id': socket.userData['_id']});
        userData.credits += creditsAmount;

        updateUser(userData);
      })();

    });

    socket.on('orderUpdate', function (order, newState) {

      if (!order || !newState) {
        throw new Error('Invaalid arguments');
      }

      (async function() {

        await updateOrderState(order['_id'], newState);

        if (newState === 'Доставляется') {
          drone
            .deliver()
            .then(() => {
              updateOrderState(order['_id'], 'Подано');
              deleteOrder(order['_id']);
            })
            .catch(() => {
              updateOrderState(order['_id'], 'Возникли сложности');
              deleteOrder(order['_id']);
            });
        }
      })();

    });

    async function updateUser(userData) {
      const updateAnswer = await usersCollection.findOneAndUpdate({'_id': socket.userData['_id']}, userData);

      if (updateAnswer.ok) {
        socket.emit('userUpdated', userData);
      }
    }

    async function updateOrderState(orderId, newState) {
      const userData = await usersCollection.findOne({'_id': socket.userData['_id']});
      let updateOrderIndex;

      userData.orders.forEach((el, i) => {
        if (el['_id'] === orderId) {
          updateOrderIndex = i;
          userData.orders[updateOrderIndex].state = newState;
        }
      });

      updateUser(userData);
    }

    function deleteOrder(orderId) {
      setTimeout(() => {
        (async function () {

          const userData = await usersCollection.findOne({'_id': socket.userData['_id']});

          userData.orders.forEach((el, i) => {
            if (el['_id'] === orderId) {
              userData.orders.splice(i, 1);
            }
          });

          updateUser(userData);

        })();
      }, 1000 * 120);
    }
  });
};