const { app } = require("../index");
const { default: mongoose } = require("mongoose")
const bcrypt = require("bcryptjs")

var Available = require('./schemas/available'),
    Session = require('./schemas/session'),
    Parkingspot = require('./schemas/parkingspot'),
    Reservation = require('./schemas/reservation'),
    Spot_Request = require('./schemas/spot_request'),
    Login = require('./schemas/login'),
    User = require('./schemas/users');

// POST METHODS

// USER-MANAGEMENT

//Login-Methode
app.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    let userid;
    var hashedPW;
    //prüfen, ob der User existiert
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
            //nach Login suchen
            return Login.findOne({user: userid}).exec()
        })
        .then((loginresult) => {
            //Passwörter vergleichen
            if(loginresult){
                return bcrypt.compare(password, loginresult.password)
            } else{
                throw new Error("No login found");
            }
        })
        .then(isValidLogin => {
            if(isValidLogin){
                //Login erfolgreich, Session erzeugen und zurückgeben
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
            if (session){
                console.log(`Created session ${session._id} for user ${userid}`);
                res.status(200).json({sessionid: session._id, userid: userid});
            }
            else{
                console.log(`Login failed for user ${userid}`);
                res.status(404).json({status: 404, response: `Login failed. Check credentials and try again?`});
            }
        })
        .catch((err) => {
            //Login nicht erfolgreich
            console.log(`Error at user login, returning 404. Error: ${err}`);
            res.status(404).json({status: 'Login failed. Check email and password again.'})
        })
});

//Login via Session
app.post('/login_session/:userid/:sessionid', (req, res) => {
    const userid = mongoose.Types.ObjectId(req.params["userid"]);
    const sessionid = mongoose.Types.ObjectId(req.params["sessionid"]);
    Session.findById(sessionid)
        .then(
            sess => {
            if (sess.user == userid) {
                res.status(200).json({status: 200, response: true});
            } else {
                res.status(404).json({status: 404, response: `No User ${userid} with session ${sessionid} found`});
            }
        }
    );
});

//Logout: remove Session
app.post('/logout_session/:sessionid', (req, res) => {
    const sessionid = mongoose.Types.ObjectId(req.params["sessionid"]);
    Session.findOneAndDelete({_id: sessionid}, (err, del) => {
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
    User.create({ 
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
        else {
            Login.create({
                _id: new mongoose.Types.ObjectId(),
                user: user._id,
                password: req.body.password,
                creation: new Date()
            }, (loginerr, login) => {
                if(loginerr){
                    console.log(`Error creating Login: ${loginerr}`)
                    //res.status(500);
                    res.status(500).json({status: 500, response: `Error registerung new user.`})}
                else{
                    //create session
                    Session.create({
                        _id: new mongoose.Types.ObjectId(),
                        user: user._id,
                        creation: new Date()
                    }, (sessionerror, session) => {
                        if(sessionerror){
                            console.log(`Error creating Login: ${loginerr}`)
                        } else{
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
                if (!start || !stop || !contact) {
                    console.log("Some fields not provided. Can not create Request.");
                    return null;   
                }
                try {
                    return Spot_Request.create({_id: new mongoose.Types.ObjectId(), start: start, stop: stop, contact: contact, creation: new Date()})
                } catch (error) {
                    console.log(error);
                    return null;                   
                }
                
            } else {
                return null;
            }
        })
        .then(request => {
            if(request){
                const statuscode = JSON.parse(`{"status": 200, "response": "${request._id}"}`);
                const mergedresponse = {statuscode, request};
                res.status(200).json(mergedresponse);
                return mergedresponse;
            }
            else{
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
                return Spot_Request.findOneAndDelete({_id: requestid})
            } else {
                return null;
            }
        })
        .then(request => {
            if(request){
                const statuscode = JSON.parse(`{"status": 200, "response": "${request._id}"}`);
                const mergedresponse = {statuscode, request};
                res.status(200).json(mergedresponse);
                return mergedresponse;
            }
            else{
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
                if (!start || !stop || !contact || !parkingspot) {
                    console.log("Some fields not provided. Can not create Request.");
                    return null;   
                }
                return Available.create({_id: new mongoose.Types.ObjectId(), parkingspot: parkingspot, start: start, stop: stop, contact: contact, creation: new Date()})
            } else {
                return null;
            }
        })
        .then(offer => {
            if(offer){
                const statuscode = JSON.parse(`{"status": 200, "response": "${offer._id}"}`);
                const mergedresponse = {statuscode, request: offer};
                res.status(200).json(mergedresponse);
                return mergedresponse;
            }
            else{
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
                return Available.findOneAndDelete({_id: offerid})
            } else {
                return null;
            }
        })
        .then(offer => {
            if(offer){
                const statuscode = JSON.parse(`{"status": 200, "response": "${offer._id}"}`);
                const mergedresponse = {statuscode, request: offer};
                res.status(200).json(mergedresponse);
                return mergedresponse;
            }
            else{
                if (!res.headersSent){
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
        .then(spot => {
            if(spot){
                const statuscode = JSON.parse(`{"status": 200, "response": "${spot._id}"}`);
                const mergedresponse = {statuscode, request: spot};
                res.status(200).json(mergedresponse);
                return mergedresponse;
            }
            else{
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
                return Parkingspot.findOneAndDelete({_id: spotid})
            } else {
                return null;
            }
        })
        .then(spots => {
            if(spots){
                const statuscode = JSON.parse(`{"status": 200, "response": "${userid}"}`);
                const mergedresponse = {statuscode, spots};
                res.status(200).json(mergedresponse);
                return mergedresponse;
            }
            else{
                if (!res.headersSent){
                    res.status(404).json({status: 404, response: `No Spots found for userid ${userid}`});
                    return null;
                }
            }
        })
});

// add a new reservation to the database
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

app.post('/', function (req, res) {
    return res.redirect('index.html');
});

app.get('*',function (req, res) {
    res.redirect('/');
});