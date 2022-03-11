//App
var express=require("express");
require('dotenv').config();
var cors=require("cors");
const path = require('path');

//Database
const mongoose = require('mongoose')

//Push-Notifications
const webpush = require('web-push');
const { log } = require("console");

var dbhost = process.env.DB_HOST;
var dbport = process.env.DB_PORT;
var dbuser = process.env.DB_USER;
var dbpass = process.env.DB_PASSWORD;
var dbcredentials = "";
if (dbuser != "") {dbcredentials = dbuser + ":" + dbpass + "@"}

const vapidpub = process.env.PUBLIC_VAPID_KEY;
const vapidpriv = process.env.PRIVATE_VAPID_KEY;
const vapidmail = process.env.VAPID_EMAIL;
webpush.setVapidDetails(`mailto:${vapidmail}`, vapidpub, vapidpriv);

const database = 'parking_app';
const collection_user = 'user';
const collection_parking = 'parking';
const collection_spots = 'parkingspots';
const collection_requests = 'requests';
const collection_push_subscribers = 'push_subscribers';

var dburl = `mongodb://${dbcredentials}${dbhost}:${dbport}/${database}`;
console.log(`Using Database URL ${dburl}`);


//Use express
var app=express();
exports.app = app;
app.use(express.json());
app.use(cors()) //alle CORS erlauben

//Provide static pages: WWW-Verzeichnis
app.use(express.static(path.join(__dirname, 'www/')));


//Server starten
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("App listening at http://%s:%s", host, port)
})

//Connect to Database
const options = {
    authSource: 'admin',
}
mongoose.connect(dburl, options);
const db = mongoose.connection;
db.on('error', err => console.log("No connection: ", err))
db.on('open', err => console.log("DB connection etabliert"))


// INSERT API: api.js
    require("./api")