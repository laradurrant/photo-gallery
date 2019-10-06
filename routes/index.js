var express = require("express");
var router = express.Router({
    mergeParams: true
});

var Photo = require('../models/photo');

router.get("/", function (req, res) {


    Photo.find({landing: true}).sort({
        'sort-index': 1
    }).exec(function (err, photos) {
        if (err || !photos) {
            console.log("ERROR");
        } else {
            var devMode = req.app.locals.devMode;
            res.render("landing", {
                photos: photos,
                devMode: devMode
            });
        }

    });

});


router.get("/about", function (req, res) {
    res.render("about");
});


router.get("/contact", function (req, res) {
    res.render("contact");
});


module.exports = router;