var express = require("express");
var router = express.Router({
    mergeParams: true
});
var nodemailer = require("nodemailer");
var bodyParser = require("body-parser");

var Photo = require('../models/photo');

router.use(bodyParser.urlencoded({extended: true}))

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


// Nodemailer post route set up originally thanks to:
// https://tylerkrys.ca/blog/adding-nodemailer-email-contact-form-node-express-app

// POST route from contact form
router.post('/contact', (req, res) => {

    // Check out https://www.mailgun.com/ for a non-GMAIL e-mail
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'ressie.dibbert@ethereal.email',
            pass: 'F3kJcqr2gjmJRpW7B5'
        }
    });
  
    // Specify what the email will look like
    const mailOpts = {
      from: req.body.email, // This is ignored by Gmail
      to: 'ressie.dibbert@ethereal.email',
      subject: `New contact from ${req.body.name} on Mom\'s site`,
      text: req.body.message
    }
  
    // Attempt to send the email
    transporter.sendMail(mailOpts, (error, response) => {
      if (error) {
        res.render('contact-failure') // Show a page indicating failure
      }
      else {
        console.log(response);
        res.render('contact-success') // Show a page indicating success
      }
    })
  })


module.exports = router;