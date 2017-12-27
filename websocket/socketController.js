'use strict';
const SocketModel = require('./socketModel');

module.exports = (server, db) => {
  const io = require('socket.io')(server);

  io.on('connection', function (socket) {
    const socketModel = new SocketModel(db, socket);

    // Поле userData содержит информацию о пользователе с клиента.
    // Если поле отсутствует, значит произошло новое подключение
    // и мы запрашиваем данные с клиента с помощью события pullUserData
    if (!socket.userData) {
      socket.emit('pullUserData');
    }

    // При проталкивании данных пользователя с клиента,
    // перезаписывает их в поле user данного сокета
    socket.on('pushUserData', function (data) {
      socket.userData = data;
    });

    socket.on('makeNewOrder', function (data) {
      socketModel.addNewOrder(data);
    });

    socket.on('creditsAdded', function (creditsNewValue) {
      socketModel.addCredits(creditsNewValue);
    });

    socket.on('orderUpdate', function (order, newState) {
      if (!order || !newState) {
        throw new Error('Invalid arguments');
      }
      socketModel.orderUpdate(order, newState);
    });
  });
};