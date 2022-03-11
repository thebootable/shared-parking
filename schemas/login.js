var mongoose = require('mongoose');
const sch_login = new mongoose.Schema({
    _id: String, //Session-ID
    user: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] //User-ID
})
module.exports = mongoose.model("notifications", sch_login, "notifications")