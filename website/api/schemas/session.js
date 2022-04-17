var mongoose = require('mongoose');
const sch_login = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //ID is generated automatically
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, //references a user-ID
    creation: Date //timestamp of creation: login date
})
module.exports = mongoose.model("Session", sch_login, "sessions")