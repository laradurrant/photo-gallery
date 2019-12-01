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
            res.send('Oops... File with that name already exists!');
        } else {
            // Use the mv() method to place the file somewhere on your server
            sampleFile.mv(filepath, function (err) {
                if (err)
                    return res.status(500).send(err);

                // TODO: Create an actual thumbnail here instead of just copy the original
                sampleFile.mv(t_filepath, function (err) {
                    if (err)
                        return res.status(500).send(err);

                    Photo.create(photoObject, function (err, newPhoto) {
                        if (err || !newPhoto) {
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

    // maybe we can have two "paths" with two different photoObjects
    // one is for if we want to have the photo updated



    // uploads the file
    if (!req.files || Object.keys(req.files).length === 0) {

        // update, no uploads
        var photoObject = {
            title: req.body['photo[title]'],
            tag: req.body['photo[tag]'],
            description: req.body['photo[description]'],
            color: req.body['photo[color]']
        };

        // and the other is for when we want to just leave the previous image alone 
        // if the photo stays the same, then we need to make sure that it doesn't accidently get updated

        Photo.findByIdAndUpdate(req.params.id, photoObject, function (err, updatedPhoto) {
            if (err || !updatedPhoto) {
                res.redirect("/photos");
            } else {
                res.redirect("/photos/" + req.params.id);
            }
        });

    } else {
        // if the photo is updated, then we need to have all of the file uploading procedures
        // we need to make sure that we save the image to the same place and location as the other one (overwrite)

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
                // we want to make sure the file exists this time

                // Use the mv() method to place the file somewhere on the server
                sampleFile.mv(filepath, function (err) {
                    if (err)
                        return res.status(500).send(err);

                    // TODO: Create an actual thumbnail here instead of just copy the original
                    sampleFile.mv(t_filepath, function (err) {
                        if (err)
                            return res.status(500).send(err);

                        Photo.findByIdAndUpdate(req.params.id, photoObject, function (err, updatedPhoto) {
                            if (err || !updatedPhoto) {
                                res.redirect("/photos");
                            } else {
                                res.redirect("/photos/" + req.params.id);
                            }
                        });

                    });

                });

            }
        } catch (err) {
            console.error(err)
        }



    }
});


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