const { app } = require("./index");
const { default: mongoose } = require("mongoose")

// GET METHODEN

app.get('/get_available_spots', (req, res) => {
    Available.find({})
        .then(
            doc => {
            if (doc.length > 0) {
                console.log("Found available spots, responding.");
                res.json(doc);
            } else {
                res.status(404);
                res.send("No available spots found");
            }
        }
    );
});

app.get('/get_requests', (req, res) => {
    Spot_Request.find({})
        .then(
            doc => {
            if (doc.length > 0) {
                console.log("Found spot requests, responding.");
                res.json(doc);
            } else {
                res.status(404);
                res.send("No spot requests found");
            }
        }
    );
});

app.get('/get_parkingspots', (req, res) => {
    Parkingspot.find({})
        .then(
            doc => {
            if (doc.length > 0) {
                console.log("Found registered parkingspots, responding.");
                res.json(doc);
            } else {
                res.status(404);
                res.send("No parkingspots found");
            }
        }
    );
});

app.get('/get_reservations', (req, res) => {
    Reservation.find({})
        .then(
            doc => {
            if (doc.length > 0) {
                console.log("Found reservations, responding.");
                res.json(doc);
            } else {
                res.status(404);
                res.send("No parkingspots found");
            }
        }
    );
});

app.get('/get_reservation/:reservationid', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params["reservationid"]);
    Reservation.find({'_id': id})
        .then(
            doc => {
            if (doc.length > 0) {
                console.log("Found reservation, responding.");
                res.json(doc);
            } else {
                res.status(404);
                res.send(`No reservation ${id} found`);
            }
        }
    );
});

app.get('/get_users', (req, res) => {
    User.find({})
        .then(
            doc => {
            if (doc.length > 0) {
                console.log("Found Users, responding.");
                res.json(doc);
            } else {
                res.status(404);
                res.send("No users found");
            }
        }
    );
});

app.get('/get_user/:userid', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params["userid"]);
    User.find({'_id': id})
        .then(
            doc => {
            if (doc.length > 0) {
                console.log("Found User, responding.");
                res.json(doc);
            } else {
                res.status(404);
                res.send(`No User ${id} found`);
            }
        }
    );
});

app.get('/', function (req, res) {
    return res.redirect('index.html');
});

//Schemas definieren
const sch_subscriber = new mongoose.Schema()
const Push_Subscriber = mongoose.model("push_subscribers", sch_subscriber)

const sch_parkingspot = new mongoose.Schema({
    _id: Number, //Parkplatz-Nummer
    owner: String, //User
    state: String, //belegt?
    creation: Date //Registrierungsdatum
})
const Parkingspot = mongoose.model("parkingspots", sch_parkingspot)

const sch_reservation = new mongoose.Schema({
    // _id: String, ID wird automatisch generiert
    parkingspot: Number, //Parkplatznummer
    client: String, //Reservierende Person
    creation: Date //Erstellungsdatum der Reservierung
})
const Reservation = mongoose.model("reservations", sch_reservation)

const sch_request = new mongoose.Schema({
    // _id: String, ID wird automatisch generiert
    start: Date, //Ab wann wird der Parkplatz benötigt
    stop: Date, //Bis wann wird der Parkplatz benötigt
    creation: Date //Timestamp, wann die Anfrage erstellt wurde
})
const Spot_Request = mongoose.model("requests", sch_request)

const sch_available = new mongoose.Schema({
    // _id: String, ID wird automatisch generiert
    parkingspot: Number, //Parkplatznummer
    start: Date, //Ab wann ist der Parkplatz frei
    stop: Date, //Bis wann ist der Parkplatz frei
    creation: Date //Erstellungsdatum der Verfügbarkeit
})
var Available = mongoose.model("availables", sch_available)

const sch_user = new mongoose.Schema({
    // _id: String, User-ID wird automatisch generiert
    name: String, //Name
    tel: String, //Telefonnummer
    passwd: String, //Passwort
    creation: Date //Registrierungsdatum
})
const User = mongoose.model("user", sch_user)

const sch_login = new mongoose.Schema({
    _id: String, //Session-ID
    user: String //User-ID
})
const Login = mongoose.model("notifications", sch_login)