const { app } = require("./index");
const { default: mongoose } = require("mongoose")

var Available = require('./schemas/available'),
    Login = require('./schemas/login'),
    Parkingspot = require('./schemas/parkingspot'),
    Reservation = require('./schemas/reservation'),
    Spot_Request = require('./schemas/spot_request'),
    User = require('./schemas/users');

// GET METHODS

app.get('/get_available_spots', (req, res) => {
    Available.find({})
        .then(
            doc => {
            if (doc) {
                console.log("Found available spots, responding.");
                res.json(doc);
            } else {
                res.status(404);
                res.send("No available spots found");
            }
        }
    );
});

app.get('/get_requests', (req, res) => {
    Spot_Request.find({}) //.populate("contact")
        .then(
            doc => {
            if (doc) {
                console.log("Found spot requests, responding.");
                console.log(doc);
                res.json(doc);
            } else {
                res.status(404);
                res.send("No spot requests found");
            }
        }
    );
});

app.get('/get_parkingspots', (req, res) => {
    Parkingspot.find({})
        .then(
            doc => {
            if (doc) {
                console.log("Found registered parkingspots, responding.");
                res.json(doc);
            } else {
                res.status(404);
                res.send("No parkingspots found");
            }
        }
    );
});

app.get('/get_reservations', (req, res) => {
    Reservation.find({})
        .then(
            doc => {
            if (doc) {
                console.log("Found reservations, responding.");
                res.json(doc);
            } else {
                res.status(404);
                res.send("No parkingspots found");
            }
        }
    );
});

app.get('/get_reservation/:reservationid', (req, res) => {
    const id = req.params["reservationid"];
    Reservation.findById(id)
        .populate({path: 'parkingspot', model: 'Parkingspot'})
        .then(
            doc => {
            console.log(doc);
            if (doc) {
                console.log("Found reservation, responding.");
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
                console.log("Found Users, responding.");
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
    User.find({'_id': id})
        .then(
            doc => {
            if (doc) {
                console.log("Found User, responding.");
                res.json(doc);
            } else {
                res.status(404);
                res.send(`No User ${id} found`);
            }
        }
    );
});

app.get('/', function (req, res) {
    return res.redirect('index.html');
});

// POST METHODS

// add request for parking spot
app.post('/request_spot', (req, res) => {
    Spot_Request.create({ 
        start: req.body.start,
        stop: req.body.stop,
        contact: req.body.contact,
        creation: new Date()
        }, 
        (err, doc) => {
            if (err) console.log(err);
        console.log(`Added spot request ${doc}`);
        res.json(doc._id);
      });
});

// register a new parking spot in the database
app.post('/register_spot', (req, res) => {
    Parkingspot.create({ 
        nr: req.body.nr,
        owner: mongoose.Types.ObjectId(req.body.owner),
        location: req.body.location,
        creation: new Date()
        }, 
        (err, doc) => {
            if (err) console.log(err);
        console.log(`Added spot request ${doc}`);
        res.json(doc._id);
      });
});

// add a new reservation to the database
app.post('/reserve_spot', (req, res) => {
    Reservation.create({ 
        parkingspot: mongoose.Types.ObjectId(req.body.parkingspot),
        client: mongoose.Types.ObjectId(req.body.client),
        creation: new Date()
        }, 
        (err, doc) => {
            if (err) console.log(err);
        console.log(`Added reservation ${doc}`);
        res.json(doc._id);
      });
});

//subscribe to push notifications
app.post('/subscribe', (req, res) => {
    console.log("subscribe: " + Date.now());
    const subscription = req.body;
    res.status(201).json({});
    const payload = JSON.stringify({ title: 'Parkplatz-App', body: 'Erfolgreich zu Push-Nachrichten angemeldet.' });
    
    var data = {"subscription": subscription}
    
    dbo.collection(collection_push_subscribers).findOne(data.endpoint,function(err, result){
        if (err) throw err;
        if (!result){
            dbo.collection(collection_push_subscribers).insertOne(data,function(err, collection){
                if (err) throw err;
                console.log("Subscription inserted successfully");
            });
    
            console.log("New subscription: " + subscription);
            
            webpush.sendNotification(subscription, payload).catch(error => {
                console.error(error.stack);
            });
        }
        else{
            console.log("Subscription already exists.");
            return;
        }
    });
    });

//send notification to all subscribers -- THIS HAS TO BE CHANGED AND SHOULD NOT FACE PUBLICLY
app.post('/notify', (req, res) => {
    console.log("notify: " + Date.now());
    const message = JSON.stringify(req.body);
    res.status(201).json({});

    dbo.collection(collection_push_subscribers).find({}).toArray(function(err, result){
        if (err) throw err;
        console.log("Sending notification to everyone: " + message);
        for(let s of result) {
            console.log(s.subscription);
            webpush.sendNotification(s.subscription, message).catch(error => {
                console.error(error.stack);
                });
        }
    });
})