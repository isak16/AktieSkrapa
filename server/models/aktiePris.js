var mongoose = require('mongoose');

// Schema
var aktieSchema = new mongoose.Schema({
    _id:String,
    namn: String,
    prices: Object,
    messages: Object
});

// Return model
module.exports = mongoose.model('aktiePris', aktieSchema);
