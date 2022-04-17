var mongoose = require('mongoose');
const sch_available = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //ID is generated automatically
    parkingspot: { type: mongoose.Schema.Types.ObjectId, ref: 'Parkingspot' }, //references a parkingspot-ID
    start: Date, //From when the parking lot is available
    stop: Date, //Until when the parking lot is available
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creation: Date //creation date of an entry
})
module.exports = mongoose.model("Available", sch_available, "availables")