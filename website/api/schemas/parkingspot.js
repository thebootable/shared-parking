var mongoose = require('mongoose');
const sch_parkingspot = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //Parkplatz-ID wird automatisch generiert
    nr: Number, //menschenlesbare Parkplatznummer
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, //User
    location: String, //Beschreibung wo der Parkplatz ist
    creation: Date //Registrierungsdatum
})
module.exports = mongoose.model("Parkingspot", sch_parkingspot, "parkingspots")