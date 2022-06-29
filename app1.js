
var express = require('express');
var session = require('express-session');
var nodemailer = require('nodemailer');
var app = express();
var fs = require("fs");


var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// use that dependencies
app.use(session({
    secret : 'keyboard cat',
    resave : false,
    saveUninitialized : true
}));


MongoClient.connect(url, function(err, db) {
  var destinations;
  if (err) throw err;
   app.get("/getUser", (req, res) => {

     var dbo = db.db("vishwasdb");
     var collection = dbo.collection("userinfo");

   collection.find({}).sort({_id:-1}).limit(1).toArray((error, result) => {
       if(error) {
           return res.status(500).send(error);
       }
        destinations = result;
       var count = req.query.count != undefined ? req.query.count : req.query.count = 100;
       if(req.query.country){
           var countrySpots = destinations.filter(function(destinations) {
               return destinations.country == req.query.country
           });
           res.end(JSON.stringify(countrySpots.slice(0, count)));
       }
       res.end(JSON.stringify(destinations.slice(0, count)));
   });
    //db.close();
});


app.post('/userinfo', function (req, res) {
  console.log("One User Added");

    //res.status(201).end(JSON.stringify(newDestination));
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
       var dbo = db.db("vishwasdb");
        var myobj = { Name: req.body.Name, City: req.body.City, url:req.body.url};
      // var myobj = destinations;
      dbo.collection("userinfo").insertOne(myobj, function(err, res) {
         if (err) throw err;
        console.log("1 document inserted");

      //  db.close();
      });
    });
})
});


// A promo message to user
var message = "Guru Pornima! Get 100% cachback on saving your first Delivery.";

app.get('/messages', function (req, res) {
    res.end(JSON.stringify(message));
})



//Delete a Destination
app.delete('/checkout/:id', function (req, res) {
    for (var i = 0; i < destinations.length; i++) {
        if(destinations[i].id == req.params.id){
            destinations.splice(i, 1);
            res.status(204).end(JSON.stringify(destinations[i]));
        }
    }
});


// Home Page
app.get('/', (req, res) => res.send('Welcome! to face recognization server'))

// // Configure server
// var server = app.listen(9000, '192.168.2.3', function (req, res) {
//
//     var host = server.address().address
//     var port = server.address().port
//
//     console.log(`Server running at http://${host}:${port}/`);
// })

//////////////////////////////Over the Internet //////////////////////

const PORT = process.env.PORT || 8154;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});
//////////////////////////////////////////////////////////////////////
