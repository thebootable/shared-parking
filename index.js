//App
var express=require("express");
require('dotenv').config();
var bodyParser=require("body-parser");
var cors=require("cors");

//Database
const mongoose = require('mongoose')
const path = require('path');


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
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cors()) //alle CORS erlauben

//Provide static pages: WWW-Verzeichnis
app.use(express.static(path.join(__dirname, 'www/')));


//App starten
var server = app.listen(3000, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("App listening at http://%s:%s", host, port)
})

//Connect to Database
//Provide API

//Verbindung zur Datenbank herstellen
const options = {
    authSource: 'admin',
}
mongoose.connect(dburl, options);
const db = mongoose.connection;

db.on('error', err => console.log("No connection: ", err))
db.on('open', err => console.log("DB connection etabliert"))

    //require('./schemes');

// POST METHODEN
    require("./api")
    
    app.post('/request', function(req,res){
        var req_start = req.body.req_start;
        var req_end = req.body.req_end;
        var req_contact = req.body.req_contact;

        var data = {
            "req_start": req_start,
            "req_end":req_end,
            "req_contact":req_contact,
        }
        dbo.collection(collection_requests).insertOne(data,function(err, collection){
            if (err) throw err;
            console.log("Record inserted successfully");
        });
        return res.redirect('http://127.0.0.1:5500/'); 
    })

    //zu Push-Nachrichten subscriben
    app.post('/subscribe', (req, res) => {
        console.log("subscribe: " + Date.now());
        const subscription = req.body;
        res.status(201).json({});
        const payload = JSON.stringify({ title: 'Parkplatz-App', body: 'Erfolgreich zu Push-Nachrichten angemeldet.' });
        
        var data = {"subscription": subscription}
        
        dbo.collection(collection_push_subscribers).findOne(data.endpoint,function(err, result){
            if (err) throw err;
            if (!result){
                dbo.collection(collection_push_subscribers).insertOne(data,function(err, collection){
                    if (err) throw err;
                    console.log("Subscription inserted successfully");
                });
        
                console.log("New subscription: " + subscription);
              
                webpush.sendNotification(subscription, payload).catch(error => {
                  console.error(error.stack);
                });
            }
            else{
                console.log("Subscription already exists.");
                return;
            }
        });
      });

    //Nofitication an alle Subscriber schicken
    app.post('/notify', (req, res) => {
        console.log("notify: " + Date.now());
        const message = JSON.stringify(req.body);
        res.status(201).json({});

        dbo.collection(collection_push_subscribers).find({}).toArray(function(err, result){
            if (err) throw err;
            console.log("Sending notification to everyone: " + message);
            for(let s of result) {
                console.log(s.subscription);
                webpush.sendNotification(s.subscription, message).catch(error => {
                    console.error(error.stack);
                  });
            }
        });
    })

    require('./api');
