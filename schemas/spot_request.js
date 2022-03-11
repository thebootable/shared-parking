var mongoose = require('mongoose');
const sch_request = new mongoose.Schema({
    // _id: String, ID wird automatisch generiert
    start: Date, //Ab wann wird der Parkplatz benötigt
    stop: Date, //Bis wann wird der Parkplatz benötigt
    contact: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
    creation: Date //Timestamp, wann die Anfrage erstellt wurde
})
module.exports = mongoose.model("requests", sch_request, "requests")