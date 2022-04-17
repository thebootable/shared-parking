var mongoose = require('mongoose');
const sch_request = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //ID is generated automatically
    start: Date, //From when the parking lot is requested
    stop: Date, //Until when the parking lot is requested
    contact: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, //references a user-ID
    creation: Date //Timestamp of creation of an entry
})
module.exports = mongoose.model("Spot_Request", sch_request, "requests")