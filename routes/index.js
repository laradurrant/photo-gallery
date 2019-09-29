var express = require("express");
var router  = express.Router({mergeParams: true});
var Photo =  require('../models/photo');

router.get("/", function(req, res)
{
    res.redirect("photos");
});


router.get("/about", function(req, res)
{
    res.render("about");
});


module.exports = router;