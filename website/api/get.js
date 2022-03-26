const { app } = require("../index");
const { default: mongoose } = require("mongoose")

var Available = require('./schemas/available'),
    Session = require('./schemas/session'),
    Parkingspot = require('./schemas/parkingspot'),
    Reservation = require('./schemas/reservation'),
    Spot_Request = require('./schemas/spot_request'),
    User = require('./schemas/users');

// GET METHODS

app.get('/get_available_spots', (req, res) => {
    Available.find({})
    .populate("contact", 'name')
    .populate("parkingspot", 'nr')
    .then(
        doc => {
            if (doc.length > 0) {
                const statuscode = JSON.parse(`{"status": 200, "response": "Found available spots, responding."}`);
                const mergedresponse = {statuscode, doc};
                res.status(200).json(mergedresponse);
            } else {
                const statuscode = JSON.parse(`{"status": 404, "response": "No availabe spots found."}`);
                spots = JSON.parse(`[{}]`)
                const mergedresponse = {statuscode, spots};
                res.status(404).json(mergedresponse);
            }
    });
});

app.get('/get_requests', (req, res) => {
    Spot_Request.find({})
    .populate("contact", 'name')
    .then(
        doc => {
            if (doc.length > 0) {
                const statuscode = JSON.parse(`{"status": 200, "response": "Found open requests, responding."}`);
                const mergedresponse = {statuscode, doc};
                res.status(200).json(mergedresponse);
            } else {
                const statuscode = JSON.parse(`{"status": 404, "response": "No open requests found."}`);
                spots = JSON.parse(`[{}]`)
                const mergedresponse = {statuscode, spots};
                res.status(404).json(mergedresponse);
            }
    });
});

app.get('/get_my_requests/:userid/:sessionid', (req, res) => {
    const userid = mongoose.Types.ObjectId(req.params["userid"]); //user is used for auth
    const sessionid = mongoose.Types.ObjectId(req.params["sessionid"]); //session is used for auth
    Session.findById(sessionid) //check auth: is session valid?
        .then(sess => {
            if (sess.user.equals(userid)) {
                return true //session valid
            } else {
                res.status(401).json({status: 401, response: `Session ${sessionid} invalid.`});
                return false; //session invalid: "Unauthorized"
            }
        })       
        .then(login => {
            if (login) {
                return Spot_Request.find({contact: userid}).populate("contact",  '_id start stop contact creation')
            } else {
                return false;
            }
        })
        .then(doc => {
            if (doc.length > 0) {
                const statuscode = JSON.parse(`{"status": 200, "response": "Found requests for user ${userid}, responding."}`);
                const mergedresponse = {statuscode, doc};
                res.status(200).json(mergedresponse);
            } else {
                const statuscode = JSON.parse(`{"status": 404, "response": "No requests for user ${userid} found."}`);
                spots = JSON.parse(`[{}]`)
                const mergedresponse = {statuscode, spots};
                res.status(404).json(mergedresponse);
            }
        }
    );
});

app.get('/get_my_offers/:userid/:sessionid', (req, res) => {
    const userid = mongoose.Types.ObjectId(req.params["userid"]); //user is used for auth
    const sessionid = mongoose.Types.ObjectId(req.params["sessionid"]); //session is used for auth

    Session.findById(sessionid) //check auth: is session valid?
        .then(sess => {
            if (sess.user.equals(userid)) {
                return true //session valid
            } else {
                res.status(401).json({status: 401, response: `Session ${sessionid} invalid.`});
                return false; //session invalid: "Unauthorized"
            }
        })       
        .then(login => {
            if (login) {
                try {
                    return Available.find({contact: userid}).populate("parkingspot").populate("contact",  '_id parkingspot start stop contact creation')
                } catch (error) {
                    console.log(error);
                    return null;
                }
                
            } else {
                return false;
            }
        })
        .then(doc => {
            if (doc.length > 0) {
                const statuscode = JSON.parse(`{"status": 200, "response": "Found offers for user ${userid}, responding."}`);
                const mergedresponse = {statuscode, doc};
                res.status(200).json(mergedresponse);
            } else {
                const statuscode = JSON.parse(`{"status": 404, "response": "No offers for user ${userid} found."}`);
                spots = JSON.parse(`[{}]`)
                const mergedresponse = {statuscode, spots};
                res.status(404).json(mergedresponse);
            }
        }
    );
});

app.get('/get_parkingspots/:userid/:sessionid', (req, res) => {
    const userid = mongoose.Types.ObjectId(req.params["userid"]); //user is used for auth
    const sessionid = mongoose.Types.ObjectId(req.params["sessionid"]); //session is used for auth
    Session.findById(sessionid) //check auth: is session valid?
        .then(sess => {
            if (sess.user.equals(userid)) {
                return true //session valid
            } else {
                res.status(401).json({status: 401, response: `Session ${sessionid} invalid.`});
                return false; //session invalid: "Unauthorized"
            }
        })
        .then(login => {
            if (login) {
                return Parkingspot.find({})
            } else {
                return false;
            }
        })
        .then(doc => {
            if (doc.length > 0) {
                const statuscode = JSON.parse(`{"status": 200, "response": "Found registered parkingspots, responding."}`);
                const mergedresponse = {statuscode, doc};
                res.status(200).json(mergedresponse);
            } else {
                const statuscode = JSON.parse(`{"status": 404, "response": "No registered Parkingspots found."}`);
                spots = JSON.parse(`[{}]`)
                const mergedresponse = {statuscode, spots};
                res.status(404).json(mergedresponse);
            }
        }
    );
});

app.get('/get_my_parkingspots/:userid/:sessionid', (req, res) => { 
    const userid = mongoose.Types.ObjectId(req.params["userid"]); //user is used for auth
    const sessionid = mongoose.Types.ObjectId(req.params["sessionid"]); //session is used for auth
    Session.findById(sessionid) //check auth: is session valid?
        .then(sess => {
            if (sess.user.equals(userid)) {
                return true //session valid
            } else {
                res.status(401).json({status: 401, response: `Session ${sessionid} invalid.`});
                return false; //session invalid: "Unauthorized"
            }
        })
        .then(login => {
            if (login) {
                return Parkingspot.find({owner: userid})
            } else {
                return false;
            }
        })
        .then(spots => {
            if(spots.length > 0){
                const statuscode = JSON.parse(`{"status": 200, "response": "${userid}"}`);
                const mergedresponse = {statuscode, spots};
                res.status(200).json(mergedresponse);
                return true;
            }
            else{
                const statuscode = JSON.parse(`{"status": 404, "response": "No Spots found for userid ${userid}"}`);
                spots = JSON.parse(`[{}]`)
                const mergedresponse = {statuscode, spots};
                res.status(404).json(mergedresponse);
                return false;
            }
        })
});

app.get('/get_parkingspot/:parkingspotid', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params["parkingspotid"]);
    Parkingspot.findById(id)
        .then(
            doc => {
            if (doc) {
                res.json(doc);
            } else {
                res.status(404);
                res.send(`No reservation ${id} found`);
            }
        }
    );
});

app.get('/get_reservations', (req, res) => {
    Reservation.find({})
        .then(
            doc => {
            if (doc) {
                res.json(doc);
            } else {
                res.status(404);
                res.send("No reservations found");
            }
        }
    );
});

app.get('/get_reservation/:reservationid', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params["reservationid"]);
    Reservation.findById(id)
        .populate('parkingspot')
        .populate({path: 'client', model: 'User'})
        .catch((err) => {
            console.error(`Error: called .catch on 'get_reservation' with id: ${id} at step 'populate': '${err}'`);
        })
        .then(doc => {
            if (doc) {
                res.json(doc);
            } else {
                res.status(404);
                res.send(`No reservation ${id} found`);
            }
        }
    );
});

app.get('/get_users', (req, res) => {
    User.find({})
        .then(
            doc => {
            if (doc) {
                res.json(doc);
            } else {
                res.status(404);
                res.send("No users found");
            }
        }
    );
});

app.get('/get_user/:userid', (req, res) => {
    const id = mongoose.Types.ObjectId(req.params["userid"]);
    User.findById(id)
        .then(
            doc => {
            if (doc) {
                res.json(doc);
            } else {
                res.status(404);
                res.send(`No User ${id} found`);
            }
        }
    );
});

app.get('/get_session/:userid/:sessionid', (req, res) => {
    const userid = mongoose.Types.ObjectId(req.params["userid"]);
    const sessionid = mongoose.Types.ObjectId(req.params["sessionid"]);
    Session.findById(sessionid)
        .then(
            sess => {
            if (sess.user == userid) {
                console.log(sess, userid, sessionid);
                res.status(200);
                res.send(`Session valid.`);
            } else {
                console.log(sess, userid, sessionid);
                res.status(404);
                res.send(`No User ${userid} with session ${sessionid} found`);
            }
        }
    );
});

app.get('/', function (req, res) {
    return res.redirect('index.html');
});