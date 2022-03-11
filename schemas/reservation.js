var mongoose = require('mongoose');
const sch_reservation = new mongoose.Schema({
    // _id: String, ID wird automatisch generiert
    parkingspot: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Parkingspot' }], //Parkplatznummer
    client: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }], //Reservierende Person
    creation: Date //Erstellungsdatum der Reservierung
})
module.exports = mongoose.model("reservations", sch_reservation, "reservations")