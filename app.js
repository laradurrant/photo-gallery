var express          =   require('express'),
    bodyParser       =   require('body-parser'),
    methodOverride   =   require('method-override'),
    mongoose         =   require('mongoose'),
    app              =   express();

var dotenv = require('dotenv').config()


var photoRoutes = require("./routes/photos"),
    indexRoutes = require("./routes/index");

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mom2', {useNewUrlParser: true});
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));
app.use(methodOverride("_method"));
    
app.use('/', express.static(__dirname + '/public'));
app.use('/photos/', express.static(__dirname + '/public'));
app.use('/about/', express.static(__dirname + '/public'));

app.set("view engine", "ejs");

app.use("/", indexRoutes);
app.use("/photos", photoRoutes);

const port = process.env.PORT || 3000;

app.listen(port, function(){
    console.log("Calling app.listen's callback function.");
});

