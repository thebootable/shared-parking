var mongoose = require('mongoose');
const sch_user = new mongoose.Schema({
    // _id: String, User-ID wird automatisch generiert
    name: String, //Name
    tel: String, //Telefonnummer
    passwd: String, //Passwort
    creation: Date //Registrierungsdatum
})
module.exports = mongoose.model("Users", sch_user, "users")