const mongoose = require('mongoose')
require('dotenv').config();

var dbhost = process.env.DB_HOST;
var dbport = process.env.DB_PORT;
var dbuser = process.env.DB_USER;
var dbpass = process.env.DB_PASSWORD;
var dbcredentials = "";
if (dbuser != "") {
  dbcredentials = dbuser + ":" + dbpass + "@"
}

const database = 'parking_app';
const collection_user = 'user';
const collection_parking = 'parking';
const collection_spots = 'parkingspots';
const collection_requests = 'requests';
const collection_push_subscribers = 'push_subscribers';


var url = `mongodb://${dbcredentials}${dbhost}:${dbport}/${database}`;
console.log(`Using Database URL ${url}`);

//Verbindung zur Datenbank herstellen
const options = {
  authSource: 'admin',
}
mongoose.connect(dburl, options);
const db = mongoose.connection;

db.on('error', err => console.log("No connection: ", err))
db.on('open', err => console.log("DB connection etabliert"))

MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(database);
    console.log(`Database ${database} created!`);
    dbo.createCollection(collection_user, function(err, res) {
      if (err) throw err;
      console.log(`Collection ${collection_user} created!`);
    });
    dbo.createCollection(collection_parking, function(err, res) {
      if (err) throw err;
      console.log(`Collection ${collection_parking} created!`);
    });
    dbo.createCollection(collection_requests, function(err, res) {
      if (err) throw err;
      console.log(`Collection ${collection_requests} created!`);
    });
    dbo.createCollection(collection_spots, function(err, res) {
      if (err) throw err;
      console.log(`Collection ${collection_spots} created!`);
    });
    dbo.createCollection(collection_push_subscribers, function(err, res) {
      if (err) throw err;
      console.log(`Collection ${collection_push_subscribers} created!`);
      db.close();
    });
  });