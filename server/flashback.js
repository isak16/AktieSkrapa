/**
 * Created by isak16 on 2017-04-18.
 */

var request = require('request');
var cheerio = require('cheerio');
var mongoose = require('mongoose');
var aktie = require('./models/aktiePris');
var iconv  = require('iconv-lite');


var aktieArr = [
    {url: 'https://www.flashback.org/t2330750', namn: "ANOT"}
    ];

var counter = 0;
var aktieCounter = 0;

var bodyChecker;

var tempArrMessages = [];
var tempArrtimestamp = [];

// MongoDB
mongoose.connect('mongodb://localhost:27017/aktie');

var reqData = function (url, callback) {
    request({uri: url, encoding: null}, function (error, response, body) {
        body = iconv.decode(new Buffer(body), "ISO-8859-1");



        if(error) return;
        if(body === bodyChecker){
            console.log("All done");
            callback({
                messages: {messages: tempArrMessages, timestamp: tempArrtimestamp}
            });
            return;
        }
        bodyChecker = body;

        var $ = cheerio.load(body);
        $("#posts").children("div").each(function (index) {
            var data = $(this).text();
            var timestamp = data.substring(19, 36);
            var message = data.substring(data.lastIndexOf("Inlägg:")+30 , data.lastIndexOf("Visa allmän profil")-60).trim();
            if(message != "" && timestamp != ""){
                tempArrMessages.push(message);
                tempArrtimestamp.push(formatToUnix(timestamp));
            }
            if(index === 12){
                callback({
                    messages: {messages: tempArrMessages, timestamp: tempArrtimestamp}
                });
            }
        });

    });

};

setInterval(function () {
    counter++;
    reqData(aktieArr[aktieCounter].url+"p"+counter, function (response) {

        aktie.findOneAndUpdate({'namn': aktieArr[aktieCounter].namn}, response, {upsert: true}, function (err, result) {
            if (err) {
                throw (err)
            } else {
                console.log("Added");
            }
        });


    });
}, 2000);




function formatToUnix(timestamp) {
    timestamp = timestamp.replace(",", "");
    timestamp += ":00";

    var match = timestamp.match(/^(\d+)-(\d+)-(\d+) (\d+)\:(\d+)\:(\d+)$/)
    var date = new Date(match[1], match[2] - 1, match[3], match[4], match[5], match[6])

    return (date.getTime() / 1000);
}