//App
var express = require("express");
var cors=require("cors");
const path = require('path');

//Database
const mongoose = require('mongoose');

var dburl = `mongodb://root:rootpassword@mongo:27017/parking_app`;
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
    console.log(`App listening at port ${port} on host ${host}`)
})

//Connect to Database
const options = {
    authSource: 'admin',
}
mongoose.connect(dburl, options);
const db = mongoose.connection;
db.on('error', err => console.log("No connection: ", err))
db.on('open', err => console.log("DB connection opened."))


// INSERT API: api.js
    require("./api/get")
    require("./api/post")