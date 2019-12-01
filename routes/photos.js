var express = require("express");
var router = express.Router({
    mergeParams: true
});

var Photo = require('../models/photo');
const fs = require('fs')




// index route
router.get("/", function (req, res) {
    // For more info about finding and sorting, see: 
    // https://thecodebarbarian.com/how-find-works-in-mongoose


    Photo.find({}).sort({

    }).exec(function (err, photos) {
        if (err || !photos) {
            console.log("ERROR");
        } else {

            res.render("photos", {
                photos: photos

            });
        }

    });

});

// new route
router.get("/new", isLoggedIn, function (req, res) {

    res.render("new");
});

// create route
router.post("/new", isLoggedIn, function (req, res) {

    // uploads the file
    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
    }

    // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
    let sampleFile = req.files.sampleFile;

    var filename = sampleFile.name.toUpperCase(sampleFile.name);
    var filepath = 'public/img/gallery/' + filename;
    var t_filepath = 'public/img/thumbs/t_' + filename;

    req.body['photo[image]'] = sampleFile.name.toUpperCase(sampleFile.name);

    // the object we will pass to the database
    var photoObject = {
        title: req.body['photo[title]'],
        tag: req.body['photo[tag]'],
        description: req.body['photo[description]'],
        color: req.body['photo[color]'],
        image: filename
    };

    try {
        if (fs.existsSync(filepath)) {
            //file exists
            res.send('Oops... File already exists!');
        } else {
            // Use the mv() method to place the file somewhere on your server
            sampleFile.mv(filepath, function (err) {
                if (err)
                    return res.status(500).send(err);

                // TODO: Create an actual thumbnail here instead of just copy the original
                sampleFile.mv(t_filepath, function (err) {
                    if (err)
                        return res.status(500).send(err);

                    Photo.create(photoObject, function (err, newBlog) {
                        if (err || !newBlog) {
                            res.render("new");
                        } else {
                            res.redirect("/photos");
                        }
                    })

                });

            });

        }
    } catch (err) {
        console.error(err)
    }


});



// show route
router.get("/:id", function (req, res) {

    Photo.findById(req.params.id, function (err, foundPhoto) {
        if (err || !foundPhoto) {
            res.redirect("/photos");
        } else {

            res.render("show", {
                photo: foundPhoto

            });
        }
    })
});


//edit route

// TODO: Add functionality for editing the photo


router.get("/:id/edit", isLoggedIn, function (req, res) {
    console.log("edit route")
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
router.put("/:id", isLoggedIn, function (req, res) {
    console.log("update route")
    Photo.findByIdAndUpdate(req.params.id, req.body.photo, function (err, updatedPhoto) {
        if (err || !updatedPhoto) {
            res.redirect("/photos");
        } else {
            res.redirect("/photos/" + req.params.id);
        }
    });
})


//  delete route
router.delete("/:id", isLoggedIn, function (req, res) {
    console.log("delete route")

    Photo.findByIdAndRemove(req.params.id, function (err) {
        if (err) {
            res.redirect("/photos");
        } else {
            res.redirect("/photos");
        }
    });

});


function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect("/photos");
}



module.exports = router;