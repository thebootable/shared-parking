const { default: mongoose } = require("mongoose")


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

/* const sch_available = new mongoose.Schema({
    // _id: String, ID wird automatisch generiert
    parkingspot: Number, //Parkplatznummer
    start: Date, //Ab wann ist der Parkplatz frei
    stop: Date, //Bis wann ist der Parkplatz frei
    creation: Date //Erstellungsdatum der Verfügbarkeit
})
var Available = mongoose.model("availables", sch_available) */

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

module.exports = Push_Subscriber;
module.exports = Parkingspot;
module.exports = Reservation;
module.exports = Spot_Request;
//module.exports = Available;
module.exports = User;
module.exports = Login;