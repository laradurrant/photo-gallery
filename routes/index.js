var express = require("express");
var router  = express.Router({mergeParams: true});
var Photo =  require('../models/photo');

router.get("/", function(req, res)
{
    Photo.find({}, function(err, photos){
        if(err){
            console.log("ERROR");
        }
        else{
            res.render("photos", {photos: photos});
        }
    });
});


router.get("/about", function(req, res)
{
    res.render("about");
});


module.exports = router;