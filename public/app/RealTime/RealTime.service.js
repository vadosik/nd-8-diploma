angular.module('RealTime')
  .factory('RealTimeService', function (socketFactory) {
    const myIoSocket = io.connect(':3000');

    mySocket = socketFactory({
      ioSocket: myIoSocket
    });

    return mySocket
  });