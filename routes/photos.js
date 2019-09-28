var express = require("express");
var router  = express.Router({mergeParams: true});
var Photo =  require('../models/photo');

// index route
router.get("/", function(req, res)
{
    // For more info about finding and sorting, see: 
    // https://thecodebarbarian.com/how-find-works-in-mongoose
    
    Photo.find({}, function(err, photos){
        if(err){
            console.log("ERROR");
        }
        else{
            res.render("photos", {photos: photos});
        }
    });
});


// new route
router.get("/new", function(req, res)
{
 
    res.render("new");
});

// create route
router.post("/", function(req, res) {

    Photo.create(req.body.photo, function(err, newBlog){
        if(err){
            res.render("new");
        }
        else{
            res.redirect("/photos");
        }
    })

});


// show route
router.get("/:id", function(req, res)
{
    Photo.findById(req.params.id, function(err, foundPhoto){
        if(err){
            res.redirect("/photos");
        }
        else{
            res.render("show", {photo: foundPhoto});
        }
    })
});

//edit route

router.get("/:id/edit", function(req, res)
{
    Photo.findById(req.params.id, function(err, foundPhoto){
        if(err){
            res.redirect("/photos");
        }
        else{
            res.render("edit", {photo: foundPhoto});
        }
    })
});


// update route
router.put("/:id", function(req, res){
  

    Photo.findByIdAndUpdate(req.params.id, req.body.photo, function(err, updatedPhoto){
        if(err)
        {
            res.redirect("/photos");
        }
        else
        {
            res.redirect("/photos/" + req.params.id);
        }
    });
})


//  delete route
router.delete("/:id", function(req, res) {

        
    Photo.findByIdAndRemove(req.params.id, function(err){
        if(err)  {
            res.redirect("/photos");
        }
        else{
            res.redirect("/photos");
        }
    });
  
});



module.exports = router;