var mongoose = require('mongoose');
const sch_available = new mongoose.Schema({
    // _id: String, ID wird automatisch generiert
    parkingspot: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parkingspot' }], //Parkplatznummer
    start: Date, //Ab wann ist der Parkplatz frei
    stop: Date, //Bis wann ist der Parkplatz frei
    contact: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    creation: Date //Erstellungsdatum der Verfügbarkeit
})
module.exports = mongoose.model("availables", sch_available, "availables")