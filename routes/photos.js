var express = require("express");
var router = express.Router({
    mergeParams: true
});
var Photo = require('../models/photo');

// index route
router.get("/", function (req, res) {
    // For more info about finding and sorting, see: 
    // https://thecodebarbarian.com/how-find-works-in-mongoose

    Photo.find({}).sort({
        'sort-index': 1
    }).exec(function (err, photos) {
        if (err || !photos) {
            console.log("ERROR");
        } else {
            var devMode = req.app.locals.devMode;
            res.render("photos", {
                photos: photos,
                devMode: devMode
            });
        }

    });

});


// new route
router.get("/new", function (req, res) {

    res.render("new");
});

// create route
router.post("/", function (req, res) {

    Photo.create(req.body.photo, function (err, newBlog) {
        if (err || !newBlog) {
            res.render("new");
        } else {
            res.redirect("/photos");
        }
    })

});


// show route
router.get("/:id", function (req, res) {
    Photo.findById(req.params.id, function (err, foundPhoto) {
        if (err || !foundPhoto) {
            res.redirect("/photos");
        } else {
            var devMode = req.app.locals.devMode;
            res.render("show", {
                photo: foundPhoto,
                devMode: devMode
            });
        }
    })
});

// next & prev route
router.get("/:command/:index", function (req, res) {


    var index = parseInt(req.params.index);

    // If index is anyting other than a number, redirect back to the main gallery
    if (!index || typeof (index) != 'number') {
        res.redirect("/photos");
    } else {

        // Check the commands
        // If it's anything other than prev or next, we'll use a positive index
        if (req.params.command == "prev") {
            index = index - 1;
        } else if (req.params.command == "next") {
            index = index + 1;
        } else {
            index = index + 1;
        }

        // attempt to find the total number of photos in the database
        Photo.count({}, function (err, count) {

            if (err || !count) {} else {
                // if the count is greater than the max, reset the index counter
                if (index >= count) {
                    index = 0;
                    // or if the index is less than zero, reset it to the max
                } else if (index < 0) {
                    index = count - 2;
                }
                // next, try to find a photo with that sort-index value
                Photo.find({
                    'sort-index': index
                }, function (err, foundPhoto) {
                    if (err || !foundPhoto) {
                        res.redirect("/photos");
                    } else {
                        var devMode = req.app.locals.devMode;
                        res.render("show", {
                            photo: foundPhoto[0],
                            devMode: devMode
                        })
                    }
                })

            }

        })
    }

});




//edit route

router.get("/:id/edit", function (req, res) {
    Photo.findById(req.params.id, function (err, foundPhoto) {
        if (err || !foundPhoto) {
            res.redirect("/photos");
        } else {
            res.render("edit", {
                photo: foundPhoto
            });
        }
    })
});


// update route
router.put("/:id", function (req, res) {


    Photo.findByIdAndUpdate(req.params.id, req.body.photo, function (err, updatedPhoto) {
        if (err || !updatedPhoto) {
            res.redirect("/photos");
        } else {
            res.redirect("/photos/" + req.params.id);
        }
    });
})


//  delete route
router.delete("/:id", function (req, res) {


    Photo.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/photos");
        } else {
            res.redirect("/photos");
        }
    });

});



module.exports = router;