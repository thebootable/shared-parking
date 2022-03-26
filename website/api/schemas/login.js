var mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const sch_login = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //Session-ID
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, //User-ID
    password: {type: String, required: true}, //Das gespeicherte Passwort
    creation: Date //Erstellungs- oder Änderungs-Zeitpunkt
})

sch_login.pre("save", function (next) {
    const user = this
  
    if (this.isModified("password") || this.isNew) {
      bcrypt.genSalt(10, function (saltError, salt) {
        if (saltError) {
          return next(saltError)
        } else {
          bcrypt.hash(user.password, salt, function(hashError, hash) {
            if (hashError) {
              return next(hashError)
            }
  
            user.password = hash
            next()
          })
        }
      })
    } else {
      return next()
    }
  })

module.exports = mongoose.model("Login", sch_login, "logins")