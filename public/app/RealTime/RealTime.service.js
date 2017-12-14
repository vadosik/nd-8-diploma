angular.module('RealTime')
  .factory('RealTimeService', function (socketFactory) {
    const myIoSocket = io.connect(':5000');

    mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    return mySocket
  });