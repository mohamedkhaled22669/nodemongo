if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
};

var express = require('express');
var app = express();
var db = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var passportsetup = require('./config/passport-setup');





var mongoose = require('mongoose');

mongoose.connect(process.env.DATABASE_URL, {
     useNewUrlParser: true })
var db = mongoose.connection;
db.on('error',error => console.error(error));
db.once('open',() => console.log('Connected to mongoose'));

var port = process.env.PORT || 3000;






//bring ejs template
app.set('view engine', 'ejs');


// bring  body parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//session flash config
app.use(session({
    secret: 'lorem ipsum',
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 60000 * 15 }
}));
app.use(flash());

//bring passport
app.use(passport.initialize());
app.use(passport.session());


//store user object
app.get('*', function(req, res, next) {

    res.locals.user = req.user || null;
    next();
});

//bring static
app.use(express.static('public'));
app.use(express.static('uploads'));
app.use(express.static('node_modules'));




app.get('/', function(req, res) {

    res.redirect('/events');
});


// bring events routes
var events = require('./routes/event-routes');
app.use('/events', events);


// bring users router
var users = require('./routes/user-routes');
app.use('/users', users);


//listen to port 3000
app.listen(port, function(req, res) {

    console.log('app is working in port 3000');
});
