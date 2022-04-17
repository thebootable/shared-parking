var mongoose = require('mongoose');
const sch_user = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // User-ID is generated automatically
    name: String, //name of the user
    email: { //e-mail address: login
        type: String,
        unique: true,
        required: true
      },
    tel: String, //telephone number
    creation: Date //timestamp  of creation
})
module.exports = mongoose.model("User", sch_user, "users")