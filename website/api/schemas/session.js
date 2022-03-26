var mongoose = require('mongoose');
const sch_login = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //Session-ID
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, //User-ID
    creation: Date //Login-Zeitpunkt
})
module.exports = mongoose.model("Session", sch_login, "sessions")