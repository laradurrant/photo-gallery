var express          =   require('express'),
    bodyParser       =   require('body-parser'),
    methodOverride   =   require('method-override'),
    mongoose         =   require('mongoose'),
    passport         =   require('passport'),
    LocalStrategy    =   require('passport-local'),
    User             =   require('./models/user'),
    fileUpload       =   require('express-fileupload'),
    app              =   express();

var dotenv = require('dotenv').config()
const port = process.env.PORT || 3000;
app.locals.captcha_API = process.env.RECAPTCHA_API;


var photoRoutes = require("./routes/photos"),
    indexRoutes = require("./routes/index");

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mom2', {useNewUrlParser: true});
mongoose.set('useFindAndModify', false);

app.use(bodyParser.urlencoded({extended: true}));


// Passport Configuration
app.use(require("express-session")({
    secret: "Baby cakes is the best cat ever",
    resave: false,
    saveUninitialized: false
}));

// set up file upload
app.use(fileUpload());



app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// end passport configuration

app.use(express.static("public"));
app.use(methodOverride("_method"));
    
app.locals.devMode = false;

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
})

app.use('/', express.static(__dirname + '/public'));
app.use('/photos/', express.static(__dirname + '/public'));
app.use('/photos/ss/', express.static(__dirname + '/public'));
app.use('/about/', express.static(__dirname + '/public'));

app.set("view engine", "ejs");

app.use("/", indexRoutes);
app.use("/photos", photoRoutes);


// Auth routes

// show register form
app.get("/register", function(req, res){
    res.render("register");
})

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
            res.redirect("/photos");
        })
    });
});

app.get("/login", function(req, res){
    res.render("login");
})

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/photos", 
        failureRedirect: "/login"
    }), 
    function(req, res){
    res.send("login logic happens here");
})

// end auth routes
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/photos");
})


app.listen(port, function(){
    console.log("Calling app.listen's callback function.");
});

