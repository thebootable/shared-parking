//this schema is not currently used. It may be implemented to save browser-notification subscribers

var mongoose = require('mongoose');
const sch_subscriber = new mongoose.Schema({
    _id: {type: mongoose.Types.ObjectId, require: true, ref: 'User'},
    subobjects: {type:[Object], default: []},
    time: String
})
module.exports = mongoose.model("push_subscribers", sch_subscriber, "push_subscribers")