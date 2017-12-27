'use strict';

const drone = require('netology-fake-drone-api');

module.exports = class SocketModel {
  constructor(db, socket) {
    this.usersCollection = db.collection('users');
    this.socket = socket;
  }

  createNewOrder(data) {
    return {
      title: data.title,
      image: data.image,
      ingredients: data.ingredients,
      price: data.price,
      state: 'Заказано'
    };
  }

  async addNewOrder(data) {
    try {
      const newOrder = this.createNewOrder(data);
      const userData = await this.usersCollection.findOne({'_id': this.socket.userData['_id']});
      let ordersCount = userData.orders.length;

      newOrder['_id'] = ++ordersCount;
      userData.credits -= newOrder.price;
      userData.orders.push(newOrder);

      this.updateUser(userData);

    } catch (error) {
      return console.error(error);
    }
  }

  async orderUpdate(order, newState) {
    try {
      // Обновляю состояние заказа
      await this.updateOrderState(order['_id'], newState);

      // Если новое состояние === 'Доставляется',
      // передаю заказ в drone-api
      if (newState === 'Доставляется') {
        drone
          .deliver()
          .then(() => {
            this.updateOrderState(order['_id'], 'Подано');
            this.deleteOrderDeferred(order['_id']);
          })
          .catch(() => {
            this.updateOrderState(order['_id'], 'Возникли сложности');
            this.deleteOrderDeferred(order['_id']);
          });
      }

    } catch (error) {
      return console.error(error);
    }
  }

  async updateOrderState(orderId, newState) {
    try {
      const userData = await this.usersCollection.findOne({'_id': this.socket.userData['_id']});

      userData.orders.forEach((el, i) => {
        if (el['_id'] === orderId) {

          if (newState === 'Возникли сложности') {
            userData.credits += el.price;
          }

          userData.orders[i].state = newState;
        }
      });

      this.updateUser(userData);

    } catch (error) {
      return console.error(error);
    }
  }

  deleteOrderDeferred(orderId) {
    const deleteAfterMilliseconds = 1000 * 60 * 2;

    // Провожу операцию удаления заказа спустя 2 минуты,
    // использую асинхронную функцию внутри setTimeout,
    // т.к. setTimeout ставит выполнение операции в конец Event Loop
    setTimeout(() => {
      (async function () {
        try {
          const userData = await this.usersCollection.findOne({'_id': this.socket.userData['_id']});

          userData.orders.forEach((el, i) => {
            if (el['_id'] === orderId) {
              userData.orders.splice(i, 1);
            }
          });

          this.updateUser(userData);

        } catch (error) {
          return console.error(error);
        }
      }).bind(this)(); // Сохраняю контекст выхова функции в пределах класса
    }, deleteAfterMilliseconds);
  }

  async addCredits(creditsAmount) {
    try {
      const userData = await this.usersCollection.findOne({'_id': this.socket.userData['_id']});
      userData.credits += creditsAmount;

      this.updateUser(userData);

    } catch (error) {
      return console.error(error);
    }
  }

  async updateUser(userData) {
    try {
      const updateAnswer = await this.usersCollection.findOneAndUpdate({'_id': this.socket.userData['_id']}, userData);

      if (updateAnswer.ok) {
        this.socket.emit('userUpdated', userData);
      }

    } catch (error) {
      return console.error(error);
    }
  }
};