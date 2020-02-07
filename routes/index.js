var express = require("express");
var request = require("request");
var router = express.Router({
    mergeParams: true
});
const mailgun = require("mailgun-js");
var bodyParser = require("body-parser");

var Photo = require('../models/photo');

router.use(bodyParser.urlencoded({
    extended: true
}))

router.get("/", function (req, res) {


    Photo.find({
        landing: true
    }).sort({
       
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
    res.render("contact", {
        captchaAPI: req.app.locals.captcha_API,
    });
});


// Nodemailer post route set up originally thanks to:
// https://tylerkrys.ca/blog/adding-nodemailer-email-contact-form-node-express-app

// POST route from contact form
router.post('/contact', (req, res) => {


    // see https://appdividend.com/2017/08/12/google-recaptcha-node-js-tutorial-scratch/ for more info about Google Recaptcha
  
    if(req.body['g-recaptcha-response'] === undefined || req.body['g-recaptcha-response'] === '' || req.body['g-recaptcha-response'] === null)
    {
      return res.json({"responseError" : "Please select captcha first"});
    }


    const secretKey = process.env.RECAPTCHA_SECRET;
  
    const verificationURL = "https://www.google.com/recaptcha/api/siteverify?secret=" + secretKey + "&response=" + req.body['g-recaptcha-response'] + "&remoteip=" + req.connection.remoteAddress;
  
    request(verificationURL,function(error,response,body) {
      body = JSON.parse(body);
  
      if(body.success !== undefined && !body.success) {
        return res.json({"responseError" : "Failed captcha verification"});
      }
   
   
        const mg = mailgun({
            apiKey: process.env.MG_API,
            domain: process.env.SITE_URL_DOMAIN
        });
    
        const data = {
            from: req.body.email,
            to: process.env.EMAIL1 + ', ' + process.env.EMAIL2,
            subject: `New contact from ${req.body.name} on Mom\'s site`,
            text: 'New contact from ' + req.body.name + " (" + req.body.email + " ): " + req.body.message
        };
    
    
        mg.messages().send(data, function (error, body) {
            if (error || !body) {
                res.render('contact-failure') // Show a page indicating failure
    
            } else {
                res.render('contact-success') // Show a page indicating success
            }
        });

    });

    
})


module.exports = router;