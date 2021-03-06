const { app } = require("../index");
const { default: mongoose } = require("mongoose")
const bcrypt = require("bcryptjs") //used for encrypting passwords

var Available = require('./schemas/available'),
    Session = require('./schemas/session'),
    Parkingspot = require('./schemas/parkingspot'),
    Reservation = require('./schemas/reservation'),
    Spot_Request = require('./schemas/spot_request'),
    Login = require('./schemas/login'),
    User = require('./schemas/users');

// POST METHODS

// USER-MANAGEMENT

//login-method
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let userid;
    var hashedPW;
    //check if user exists
    User.findOne({ email: email})
        .then ((userresult) => {
            console.log(`userresult: ${userresult}`)
            if(userresult){
                userid = userresult._id;
                const saltRounds = 10
                bcrypt.genSalt(saltRounds, (saltError, salt) => {
                    if (saltError) throw saltError
                    else {
                        bcrypt.hash(password, salt, (hashError, hash) => {
                            if (hashError) throw hashError
                            hashedPW = hash
                        })
                    }
                })
            }
        })
        .then(()=> {
            //search for login credentials
            return Login.findOne({user: userid}).exec()
        })
        .then((loginresult) => {
            //let bcrypt compare the passwords
            if(loginresult){
                return bcrypt.compare(password, loginresult.password)
            } else{
                throw new Error("No login found");
            }
        })
        .then(isValidLogin => {
            if(isValidLogin){
                //login successfull, lets create and return a session
                return Session.create({ 
                    _id: new mongoose.Types.ObjectId(),
                    user: userid,
                    creation: new Date()
                })
            }
            else{
                return false;
            }
        })
        .then((session) => {
            if (session){ //success, send session data back to client
                console.log(`Created session ${session._id} for user ${userid}`);
                res.status(200).json({sessionid: session._id, userid: userid});
            }
            else{ //something went wrong above, return invalid login
                console.log(`Login failed for user ${userid}`);
                res.status(404).json({status: 404, response: `Login failed. Check credentials and try again?`});
            }
        })
        .catch((err) => {
            //something weng wrong, return invalid login
            console.log(`Error at user login, returning 404. Error: ${err}`);
            res.status(404).json({status: 'Login failed. Check email and password again.'})
        })
});

//login with username and session
app.post('/login_session/:userid/:sessionid', (req, res) => {
    const userid = mongoose.Types.ObjectId(req.params["userid"]);
    const sessionid = mongoose.Types.ObjectId(req.params["sessionid"]);
    Session.findById(sessionid) //check if the session exists
        .then(
            sess => {
            if (sess.user == userid) { //check if the session id matches the user
                res.status(200).json({status: 200, response: true}); //success, return true
            } else {
                res.status(404).json({status: 404, response: `No User ${userid} with session ${sessionid} found`}); //failed, return false
            }
        }
    );
});

//Logout: remove Session
app.post('/logout_session/:sessionid', (req, res) => {
    const sessionid = mongoose.Types.ObjectId(req.params["sessionid"]);
    Session.findOneAndDelete({_id: sessionid}, (err, del) => { //search and delete the session
            if (err) {
                res.status(404).json({status: 404, response: `No Session ${sessionid} found.`});
            } else {
                res.status(200).json({status: 200, response: `Removed session ${sessionid}`});
            }
        }
    );
});

// register new user
app.post('/register', (req, res) => {
    //create new user
    User.create({ //user details are taken from the request body
        _id: new mongoose.Types.ObjectId(),
        name: req.body.username,
        tel: req.body.tel,
        email: req.body.mail,
        creation: new Date()
        }, 
        (usererr, user) => {
        if (usererr) {
            console.log(`Error creating User: ${usererr}`)
            res.status(500).json({status: 500, response: `Error registerung new user.`})
        }
        else { //user created successfully, create login credentials
            Login.create({
                _id: new mongoose.Types.ObjectId(),
                user: user._id,
                password: req.body.password, //the password will be encrypted using bcrypt as defined in the login-schema. bcrypt-code is stored there
                creation: new Date()
            }, (loginerr, login) => {
                if(loginerr){
                    console.log(`Error creating Login: ${loginerr}`)
                    res.status(500).json({status: 500, response: `Error registerung new user.`})}
                else{
                    //successfully stored login credentials, create session
                    Session.create({
                        _id: new mongoose.Types.ObjectId(),
                        user: user._id,
                        creation: new Date()
                    }, (sessionerror, session) => {
                        if(sessionerror){
                            console.log(`Error creating Login: ${loginerr}`)
                        } else{
                            //everything was created/stored successfully. Return success message to client
                            console.log(`Registered User ${user} with login id ${login._id} and added session ${session._id}`);
                            res.status(201).json({user: user._id, session: session._id, status: 201, response: "ok"});
                        }
                    })
                }
            })
        }
      })
});


// PARKINGSPOT-MANAGEMENT

// add request for parking spot
app.post('/request_spot', (req, res) => {
    const start = req.body.start; //Start
    const stop = req.body.stop; //Stop
    const contact = req.body.contact; //Contact
    const userid = req.body.userid; //userid is used for auth
    const sessionid = req.body.sessionid; //session is used for auth
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
                if (!start || !stop || !contact) { //make suere all fields are provided
                    console.log("Some fields not provided. Can not create Request.");
                    return null;   
                }
                try {
                    //create the new spot request
                    return Spot_Request.create({_id: new mongoose.Types.ObjectId(), start: start, stop: stop, contact: contact, creation: new Date()})
                } catch (error) {
                    console.log(error);
                    return null;                   
                }
                
            } else {
                return null;
            }
        })
        .then(request => { //return the result to the client
            if(request){ //success
                const statuscode = JSON.parse(`{"status": 200, "response": "${request._id}"}`);
                const mergedresponse = {statuscode, request};
                res.status(200).json(mergedresponse);
                return mergedresponse;
            }
            else{ //error
                if (!res.headersSent){
                    const statuscode = JSON.parse(`{"status": 500, "response": "Could not add new spot request for userid ${userid}"}`);
                    spots = JSON.parse(`[{}]`)
                    const mergedresponse = {statuscode, spots};
                    res.status(500).json(mergedresponse);
                    return null;
                }
            }
        })
});

// remove request for parking spot
app.post('/remove_request', (req, res) => {
    const requestid = req.body.requestid; //Start
    const userid = req.body.userid; //userid is used for auth
    const sessionid = req.body.sessionid; //session is used for auth
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
                //find and delete the spot request
                return Spot_Request.findOneAndDelete({_id: requestid})
            } else {
                return null;
            }
        })
        .then(request => { //return the result to the client
            if(request){ //success
                const statuscode = JSON.parse(`{"status": 200, "response": "${request._id}"}`);
                const mergedresponse = {statuscode, request};
                res.status(200).json(mergedresponse);
                return mergedresponse;
            }
            else{ //error
                if (!res.headersSent){
                    const statuscode = JSON.parse(`{"status": 500, "response": "Could not remove spot request ${requestid}"}`);
                    spots = JSON.parse(`[{}]`)
                    const mergedresponse = {statuscode, spots};
                    res.status(500).json(mergedresponse);
                    return null;
                }
            }
        })
});

// add offer for parking spot
app.post('/offer_spot', (req, res) => {
    const parkingspot = mongoose.Types.ObjectId(req.body.parkingspot); //Start
    const start = req.body.start; //Start
    const stop = req.body.stop; //Stop
    const contact = req.body.contact; //Contact
    const userid = req.body.userid; //userid is used for auth
    const sessionid = req.body.sessionid; //session is used for auth
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
                if (!start || !stop || !contact || !parkingspot) { //make sure all fields are provided
                    console.log("Some fields not provided. Can not create Request.");
                    return null;   
                }
                //create the offer
                return Available.create({_id: new mongoose.Types.ObjectId(), parkingspot: parkingspot, start: start, stop: stop, contact: contact, creation: new Date()})
            } else {
                return null;
            }
        })
        .then(offer => { //return the result to the client
            if(offer){ //success
                const statuscode = JSON.parse(`{"status": 200, "response": "${offer._id}"}`);
                const mergedresponse = {statuscode, request: offer};
                res.status(200).json(mergedresponse);
                return mergedresponse;
            }
            else{ //error
                if (!res.headersSent){
                    const statuscode = JSON.parse(`{"status": 500, "response": "Could not add new spot offer for userid ${userid}"}`);
                    spots = JSON.parse(`[{}]`)
                    const mergedresponse = {statuscode, spots};
                    res.status(500).json(mergedresponse);
                    return null;
                }
            }
        })
});

// remove offer for parking spot
app.post('/remove_offer', (req, res) => {
    const offerid = req.body.offerid; //Start
    const userid = req.body.userid; //userid is used for auth
    const sessionid = req.body.sessionid; //session is used for auth
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
                //find and remove offer
                return Available.findOneAndDelete({_id: offerid})
            } else {
                return null;
            }
        })
        .then(offer => { //return the result to the client
            if(offer){ //success
                const statuscode = JSON.parse(`{"status": 200, "response": "${offer._id}"}`);
                const mergedresponse = {statuscode, request: offer};
                res.status(200).json(mergedresponse);
                return mergedresponse;
            }
            else{
                if (!res.headersSent){ //error
                    const statuscode = JSON.parse(`{"status": 500, "response": "Could not remove offer ${offerid}"}`);
                    spots = JSON.parse(`[{}]`)
                    const mergedresponse = {statuscode, spots};
                    res.status(500).json(mergedresponse);
                    return null;
                }
            }
        })
});

// register a new parking spot in the database
app.post('/register_spot', (req, res) => {
    const nr = req.body.nr;
    const owner = mongoose.Types.ObjectId(req.body.owner);
    const location = req.body.location;
    const userid = req.body.userid; //userid is used for auth
    const sessionid = req.body.sessionid; //session is used for auth
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
                //create a new parkingspot
                return Parkingspot.create({ 
                        _id: new mongoose.Types.ObjectId(),
                        nr: nr,
                        owner: owner,
                        location: location,
                        creation: new Date()
                        })
            } else {
                return null;
            }
        })
        .then(spot => { //return the result to the client
            if(spot){ //success
                const statuscode = JSON.parse(`{"status": 200, "response": "${spot._id}"}`);
                const mergedresponse = {statuscode, request: spot};
                res.status(200).json(mergedresponse);
                return mergedresponse;
            }
            else{ //error
                if (!res.headersSent){
                    const statuscode = JSON.parse(`{"status": 500, "response": "Could not add parkingspot ${nr}"}`);
                    spots = JSON.parse(`[{}]`)
                    const mergedresponse = {statuscode, spots};
                    res.status(500).json(mergedresponse);
                    return null;
                }
            }
        })
});

// remove a registered spot
app.post('/remove_spot', (req, res) => {
    const spotid = req.body.spotid; //spotid
    const userid = req.body.userid; //userid is used for auth
    const sessionid = req.body.sessionid; //session is used for auth
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
                //find and remove parkingspot
                return Parkingspot.findOneAndDelete({_id: spotid})
            } else {
                return null;
            }
        })
        .then(spots => { //return the result to the client
            if(spots){ //success
                const statuscode = JSON.parse(`{"status": 200, "response": "${userid}"}`);
                const mergedresponse = {statuscode, spots};
                res.status(200).json(mergedresponse);
                return mergedresponse;
            }
            else{ //error
                if (!res.headersSent){
                    res.status(404).json({status: 404, response: `No Spots found for userid ${userid}`});
                    return null;
                }
            }
        })
});

// add a new reservation to the database
// this has yet to be implemented
app.post('/reserve_spot', (req, res) => {
    Reservation.create({ 
        _id: new mongoose.Types.ObjectId(),
        parkingspot: req.body.parkingspot,
        client: req.body.client,
        creation: new Date()
        }, 
        (err, doc) => {
            if (err) console.log(err);
        console.log(`Added reservation ${doc}`);
        res.json(doc._id);
      });
});

// redirect all other post-requests to the index.html
app.post('/', function (req, res) {
    return res.redirect('index.html');
});