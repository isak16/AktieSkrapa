var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');


// MongoDB
mongoose.connect('mongodb://localhost:27017/aktie');

// Express
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
});

// Routes
app.use('/', require('./routes/api.js'));

// Start server
app.listen(1337);

console.log('API is running on port 3000');