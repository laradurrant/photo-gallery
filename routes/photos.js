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
        'sort-index': 1
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
router.post("/", function (req, res) {
   

    Photo.create(req.body.photo, function (err, newBlog) {
        if (err || !newBlog) {
            res.render("new");
        } else {
            res.redirect("/photos");
        }
    })

});


router.get("/upload", function(req, res){
    res.render("upload");
})

router.post("/upload", function(req, res){

    if (!req.files || Object.keys(req.files).length === 0) {
        return res.status(400).send('No files were uploaded.');
      }
    
      // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
      let sampleFile = req.files.sampleFile;

      var name = sampleFile.name.toUpperCase(sampleFile.name);
      var filepath = 'public/img/gallery/IMG_' + name;

      console.log(filepath);

      try {
        if (fs.existsSync(filepath)) {
          //file exists
          res.send('File already exists!');
        }
        else{
            // Use the mv() method to place the file somewhere on your server
            sampleFile.mv(filepath, function(err) {
            if (err)
                return res.status(500).send(err);
            
                res.send('File uploaded!');
            });
            }
      } catch(err) {
        console.error(err)
      }


})

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

// next & prev route
router.get("/ss/:command/:index", function (req, res) {
    
    
    var index = parseInt(req.params.index);

    // If index is anyting other than a number, redirect back to the main gallery
    if (index == undefined || typeof (index) != 'number') {
       
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
        Photo.countDocuments({}, function (err, count) {

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
                     
                        res.render("show", {
                            photo: foundPhoto[0]
                          
                        })
                    }
                })

            }

        })
    }

});




//edit route

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


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    res.redirect("/photos");
}



module.exports = router;