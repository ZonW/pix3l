const MongoClient = require('mongodb').MongoClient;
const settings = require('./settings');

const mongoConfig = settings.mongoConfig;

let _connection = undefined;
let _db = undefined;
module.exports = async () => {
    if (!_connection) {
      const remoteServerUrl = "mongodb+srv://" + process.env.ATLAS_ID + ":" + process.env.ATLAS_PSWD + "@cluster0.ujcltsr.mongodb.net/?retryWrites=true&w=majority"
      _connection = await MongoClient.connect(remoteServerUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      _db = await _connection.db(mongoConfig.database);
    }
  
    return _db;
  };