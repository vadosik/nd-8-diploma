module.exports = {
  url: process.env.MONGO_DB_URL  || 'mongodb://test:test@mig-cafe-shard-00-00-lypoi.mongodb.net:27017,mig-cafe-shard-00-01-lypoi.mongodb.net:27017,mig-cafe-shard-00-02-lypoi.mongodb.net:27017/test?ssl=true&replicaSet=mig-cafe-shard-0&authSource=admin&retryWrites=true&w=majority'
};
