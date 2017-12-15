'use strict';
const drone = require('netology-fake-drone-api');

module.exports = (server, db) => {
  const io = require('socket.io')(server);
  const usersCollection = db.collection('users');

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
        try {
          const userData = await usersCollection.findOne({'_id': socket.userData['_id']});
          let ordersCount = userData.orders.length;
          newOrder['_id'] = ++ordersCount;
          userData.credits -= newOrder.price;
          userData.orders.push(newOrder);

          updateUser(userData);

        } catch (error) {
          return console.error(error);
        }
      })();
    });

    socket.on('creditsAdded', function (creditsAmount) {
      (async function() {
        try {
          const userData = await usersCollection.findOne({'_id': socket.userData['_id']});
          userData.credits += creditsAmount;

          updateUser(userData);

        } catch (error) {
          return console.error(error);
        }
      })();
    });

    socket.on('orderUpdate', function (order, newState) {

      if (!order || !newState) {
        throw new Error('Invaalid arguments');
      }

      (async function() {
        try {
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

        } catch (error) {
          return console.error(error);
        }
      })();
    });

    async function updateUser(userData) {
      try {
        const updateAnswer = await usersCollection.findOneAndUpdate({'_id': socket.userData['_id']}, userData);

        if (updateAnswer.ok) {
          socket.emit('userUpdated', userData);
        }

      } catch (error) {
        return console.error(error);
      }
    }

    async function updateOrderState(orderId, newState) {
      try {
        const userData = await usersCollection.findOne({'_id': socket.userData['_id']});

        userData.orders.forEach((el, i) => {
          if (el['_id'] === orderId) {

            if (newState === 'Возникли сложности') {
              userData.credits += el.price;
            }

            userData.orders[i].state = newState;
          }
        });

        updateUser(userData);

      } catch (error) {
        return console.error(error);
      }
    }

    function deleteOrder(orderId) {
      setTimeout(() => {
        (async function () {
          try {
            const userData = await usersCollection.findOne({'_id': socket.userData['_id']});

            userData.orders.forEach((el, i) => {
              if (el['_id'] === orderId) {
                userData.orders.splice(i, 1);
              }
            });

            updateUser(userData);

          } catch (error) {
            return console.error(error);
          }
        })();
      }, 1000 * 120);
    }
  });
};