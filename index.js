const MongoClient    = require('mongodb').MongoClient;
const express        = require('express');
const bodyParser     = require('body-parser');
const app            = express();
const server         = require('http').Server(app);

// Конфигурации сервера и базы данных
const dbUrl          = require('./config/db').url;
const serverPort     = require('./config/server').port;

// Middleware для обработки тела запросов
app.use(bodyParser.urlencoded({"extended": true}));
app.use(bodyParser.json());

// WEB-интерфейс
app.use(express.static('public'));

// Подключение базы данных
MongoClient.connect(dbUrl)
  .then(db => {
    // Подключаем роуты приложения в процедурном стиле
    require('./server/routes')(app, db);
    require('./websocket')(server, db);

    server.listen(serverPort, () => {
      console.log(`The server is running on port ${serverPort}`);
    });

  })
  .catch(console.error);