var mongoose = require('mongoose');
const sch_parkingspot = new mongoose.Schema({
    //_id: Number, //Parkplatz-ID wird automatisch generiert
    nr: Number, //menschenlesbare Parkplatznummer
    owner: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], //User
    location: String, //Beschreibung wo der Parkplatz ist
    creation: Date //Registrierungsdatum
})
module.exports = mongoose.model("parkingspots", sch_parkingspot, "parkingspots")