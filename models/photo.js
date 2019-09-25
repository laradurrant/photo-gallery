var mongoose = require('mongoose');

var photoSchema = new mongoose.Schema({
    title: String,
    image: String,
    tag: String,
    description: String,
    color: String,
    created: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Photo", photoSchema);