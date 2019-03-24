var express = require('express'),
    mongo = require('mongojs'),
    bodyParser = require('body-parser');

var ObjectID = mongo.ObjectID;
var db = mongo('mongodb://localhost:27017/bluddy');
var app = express();
var port = 5000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/api/show', (req, res) => {
    var coll = db.collection('users')
    coll.find().toArray(function (err, docs) {
        res.send(docs);
    });
    
});
  
app.post('/api/register', (req, res) => {
    var coll = db.collection('users')
    coll.createIndex({ 'email': "" }, { unique: true });
    coll.insert({
        'bloodgroup': 'B+',
        'coordinates': {
            'latitude': 0.00,
            'longitude': 0.00 
        },
        'email': 'd1',
        'firstName': 'd1',
        'lastName': 'd1',
        'lastDonate': '',
        'numberOfDonations': 0,
        'password': 'd1',
        'phone': '123',
        'status': 'Active!',
        'lastOpen': req.body.date,
        'appOpenStreak': 0,
        'points': {
           ' appOpen': 0,                     
            'sharePoints': 0,                 
            'donationPoints': 0,              
            'feedbackPoints': 0,             
            'distancePoints':0               
        }
    }), function (err, result) {
        coll.find({ name: req.body.user }).toArray(function (err, docs) {
            console.log(docs[0]);
        });
    }
});
        app.listen(port, () => {
            console.log('Port listening at', port);
        });


        // Object {
        //     "__v": 0,
        //     "_id": "5c961b7f3172bf4f715e89db",
        //     "bloodgroup": "Don't Know",
        //     "coordinates": Object {
        //       "latitude": 37.785834,
        //       "longitude": -122.406417,
        //     },
        //     "email": "dummy1@abc.com",
        //     "firstName": "Dummy1",
        //     "lastName": "D",
        //     "lastdonate": null,
        //     "password": "8cb2237d0679ca88db6464eac60da96345513964",
        //     "phone": "1234567890",
        //     "status": "Active",
        //   }