angular.module('RealTime')
  .factory('RealTimeService', function (socketFactory) {
    const myIoSocket = io.connect();

    mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    return mySocket
  });