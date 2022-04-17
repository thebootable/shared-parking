var mongoose = require('mongoose');
const sch_parkingspot = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //Parkplatz-ID wird automatisch generiert
    nr: Number, //human-readable parkingspot-id
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, //references a User-ID
    location: String, //location of the parkingspot
    creation: Date //timestamp of creation
})
module.exports = mongoose.model("Parkingspot", sch_parkingspot, "parkingspots")