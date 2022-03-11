const mongoose = require('mongoose');
const path = require('path');
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

var dburl = `mongodb://${dbcredentials}${dbhost}:${dbport}/${database}`;
console.log(`Using Database URL ${dburl}`);

//Verbindung zur Datenbank herstellen
const options = {
  authSource: 'admin',
}
mongoose.connect(dburl, options);
const db = mongoose.connection;
db.on('error', err => console.log("No connection: ", err))
db.on('open', err => console.log("DB connection etabliert"))

var Available = require('./schemas/available'),
    Login = require('./schemas/login'),
    Parkingspot = require('./schemas/parkingspot'),
    Reservation = require('./schemas/reservation'),
    Spot_Request = require('./schemas/spot_request'),
    User = require('./schemas/users');

  var tobi = new User({
    name: "Tobi",
    tel: "+49123456",
    passwd: "md5hash6543215635154",
    creation: "2022-03-09T17:30:05.969Z"
  })

  var markus = new User({
    name: "Markus",
    tel: "+491234567",
    passwd: "md5hash6543215635154",
    creation: "2022-03-09T17:31:05.969Z"
  })

  var anton = new User({
    name: "Anton",
    tel: "+491234568",
    passwd: "md5hash6543215635154",
    creation: "2022-03-09T17:30:05.969Z"
  })

  tobi.save();
  markus.save();
  anton.save();

  var parking1 = new Parkingspot({
    _id: 196,
    owner: tobi._id,
    location: "2. UG",
    creation: "2022-03-09T17:30:05.969Z"
  })

  var parking2 = new Parkingspot({
    _id: 197,
    owner: markus._id,
    location: "2. UG",
    creation: "2022-03-09T17:30:05.969Z"
  })

  var parking3 = new Parkingspot({
    _id: 198,
    owner: anton._id,
    location: "2. UG",
    creation: "2022-03-09T17:30:05.969Z"
  })

  parking1.save();
  parking2.save();
  parking3.save();