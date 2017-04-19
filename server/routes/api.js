var express = require('express');
var router = express.Router();
var aktie = require('../models/aktiePris');


router.get('/stock/:id', function (req, res, next) {
    aktie.findOne({ 'namn': req.params.id }, function (err, result) {
        if (err) return handleError(err);
        res.send(result);
        next();
    })
});

module.exports = router;