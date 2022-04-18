const { app } = require("../index");
const { default: mongoose } = require("mongoose")

var Available = require('./schemas/available'),
    Session = require('./schemas/session'),
    Parkingspot = require('./schemas/parkingspot'),
    Reservation = require('./schemas/reservation'),
    Spot_Request = require('./schemas/spot_request'),
    User = require('./schemas/users');

// GET METHODS

//return all available/offered spots
app.get('/get_available_spots', (req, res) => {
    Available.find({}) //find all offers
    .populate("contact", 'name') //add the contact name
    .populate("parkingspot", 'nr') //add the human-readable spot number
    .then(
        doc => {
            if (doc.length > 0) {
                const statuscode = JSON.parse(`{"status": 200, "response": "Found available spots, responding."}`); // prepare statuscode-details
                const mergedresponse = {statuscode, doc}; //merge statuscode and content/results
                res.status(200).json(mergedresponse); //return
            } else {
                const statuscode = JSON.parse(`{"status": 404, "response": "No availabe spots found."}`); // prepare statuscode-details
                spots = JSON.parse(`[{}]`) //content/results are empty
                const mergedresponse = {statuscode, spots}; //merge statuscode and content/results
                res.status(404).json(mergedresponse); //return
            }
    });
});

//return all open requests
app.get('/get_requests', (req, res) => {
    Spot_Request.find({}) //find all requests
    .populate("contact", 'name') //add the contact name
    .then(
        doc => {
            if (doc.length > 0) {
                const statuscode = JSON.parse(`{"status": 200, "response": "Found open requests, responding."}`); // prepare statuscode-details
                const mergedresponse = {statuscode, doc}; //merge statuscode and content/results
                res.status(200).json(mergedresponse); //return
            } else {
                const statuscode = JSON.parse(`{"status": 404, "response": "No open requests found."}`); // prepare statuscode-details
                spots = JSON.parse(`[{}]`) //content/results are empty
                const mergedresponse = {statuscode, spots}; //merge statuscode and content/results
                res.status(404).json(mergedresponse); //return
            }
    });
});

//return the requests of a specific user. uses auth with user/session.
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
                //find all requests for the user and add the contact details. limit the returned fields to _id start stop contact creation
                return Spot_Request.find({contact: userid}).populate("contact",  '_id start stop contact creation')
            } else {
                return false;
            }
        })
        .then(doc => {
            if (doc.length > 0) {
                const statuscode = JSON.parse(`{"status": 200, "response": "Found requests for user ${userid}, responding."}`); // prepare statuscode-details
                const mergedresponse = {statuscode, doc}; //merge statuscode and content/results
                res.status(200).json(mergedresponse); //return
            } else {
                const statuscode = JSON.parse(`{"status": 404, "response": "No requests for user ${userid} found."}`); // prepare statuscode-details
                spots = JSON.parse(`[{}]`) //content/results are empty
                const mergedresponse = {statuscode, spots}; //merge statuscode and content/results
                res.status(404).json(mergedresponse); //return
            }
        }
    );
});

//return the offers of a specific user. uses auth with user/session.
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
                    //find all requests for the user and add the contact details. limit the returned fields to _id parkingspot start stop contact creation
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
                const statuscode = JSON.parse(`{"status": 200, "response": "Found offers for user ${userid}, responding."}`); //prepare statuscode-details
                const mergedresponse = {statuscode, doc}; //merge statuscode and content/results
                res.status(200).json(mergedresponse); //return
            } else {
                const statuscode = JSON.parse(`{"status": 404, "response": "No offers for user ${userid} found."}`); //prepare statuscode-details
                spots = JSON.parse(`[{}]`) //content/results are empty
                const mergedresponse = {statuscode, spots}; //merge statuscode and content/results
                res.status(404).json(mergedresponse); //return
            }
        }
    );
});

//return the number of registered parkingspots
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
                //find all parkingspots
                return Parkingspot.find({})
            } else {
                return false;
            }
        })
        .then(doc => {
            if (doc.length > 0) {
                const statuscode = JSON.parse(`{"status": 200, "response": "Found registered parkingspots, responding."}`); //prepare statuscode-details
                spots = JSON.parse(doc.length) //return only the number of parkingspots
                const mergedresponse = {statuscode, spots}; //merge statuscode and content/results
                res.status(200).json(mergedresponse); //return
            } else {
                const statuscode = JSON.parse(`{"status": 404, "response": "No registered Parkingspots found."}`); //prepare statuscode-details
                spots = JSON.parse(0); //return 0
                const mergedresponse = {statuscode, spots}; //merge statuscode and content/results
                res.status(404).json(mergedresponse); //return
            }
        }
    );
});

//return the parkingspots for a specific user
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
                //find all parkingspots for the user
                return Parkingspot.find({owner: userid})
            } else {
                return false;
            }
        })
        .then(spots => {
            if(spots.length > 0){
                const statuscode = JSON.parse(`{"status": 200, "response": "${userid}"}`); //prepare statuscode-details
                const mergedresponse = {statuscode, spots}; //merge statuscode and content/results
                res.status(200).json(mergedresponse); //return
                return true;
            }
            else{
                const statuscode = JSON.parse(`{"status": 404, "response": "No Spots found for userid ${userid}"}`); //prepare statuscode-details
                spots = JSON.parse(`[{}]`) //content/results are empty
                const mergedresponse = {statuscode, spots}; //merge statuscode and content/results
                res.status(404).json(mergedresponse); //return
                return false;
            }
        })
});

//get details for a specific parkingspot
//auth requirement should be added
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

//return all reservations
//should be implemented in a better way, currently not used as reservations are not fully implemented
//auth must be added, see issue #6
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

//get details for a specific reservation
//should be implemented in a better way, currently not used as reservations are not fully implemented
//auth must be added, see issue #7
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

//get all users
//should be implemented in a better way, or is this even needed?
//auth must be added, see issue #8
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

//get details to a specific user, used for the profile overview
//should be implemented in a better way
//auth must be added, see issue #9
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

//get details for a session
//should be implemented in a better way, or is this even needed?
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


// redirect all root get-requests to the root
app.get('/', function (req, res) {
    return res.redirect('index.html');
});

// redirect all other get-requests to the root
app.get('*',function (req, res) {
    res.redirect('/');
});