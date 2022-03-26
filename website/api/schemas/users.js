var mongoose = require('mongoose');
const sch_user = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, // User-ID
    name: String, //Name
    email: { //E-Mail-Adresse: Login
        type: String,
        unique: true,
        required: true
      },
    tel: String, //Telefonnummer
    creation: Date //Registrierungsdatum
})
module.exports = mongoose.model("User", sch_user, "users")