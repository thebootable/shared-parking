var mongoose = require('mongoose');
const sch_reservation = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //ID is generated automatically
    parkingspot: { type: mongoose.Schema.Types.ObjectId, ref: 'Parkingspot' }, //references a parkingspot-ID
    client: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //references a User-ID
    creation: Date //creation date of an entry
})
module.exports = mongoose.model("Reservation", sch_reservation, "reservations")