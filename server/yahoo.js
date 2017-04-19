/**
 * Created by isak16 on 2017-04-18.
 */

var request = require('request');
var mongoose = require('mongoose');
var aktie = require('./models/aktiePris');

var aktieArr = [
    {namn: "ANOT", url: 'https://query2.finance.yahoo.com/v8/finance/chart/ANOT.ST?formatted=true&crumb=35Vx58SSA.s&lang=en-US&region=US&period1=1334786400&period2=1492552800&interval=1d&events=div%7Csplit&corsDomain=finance.yahoo.com'}
];

var aktieCounter = 0;


// MongoDB
mongoose.connect('mongodb://localhost:27017/aktie');

var reqData = function (url, callback) {
    request(url, function (error, response, body) {
        body = JSON.parse(body);
        callback(body);
    });
};


reqData(aktieArr[aktieCounter], function (response) {
    if(response.chart.error) return;

    var obj = {
        namn: aktieArr[aktieCounter].namn,
        prices: response.chart.result[0]
    };
    aktie.findOneAndUpdate({'namn': aktieArr[aktieCounter].namn}, obj, {upsert: true}, function (err, result) {
        if (err) {
            throw (err)
        } else {
            console.log("Added");
        }
    });
});


