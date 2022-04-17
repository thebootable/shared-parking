var mongoose = require('mongoose');
const bcrypt = require("bcryptjs");

const sch_login = new mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId, //Session-ID, automatically generated
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'user' }, //references a user-ID
    password: {type: String, required: true}, //the saved password
    creation: Date //timestamp of creation or modification
})

sch_login.pre("save", function (next) { //before saving a password: encrypt it using bcrypt
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