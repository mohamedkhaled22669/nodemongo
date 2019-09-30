var express = require('express');
var app = express();
var db = require('./config/database');
var bodyParser = require('body-parser');
var session = require('express-session');
var flash = require('connect-flash');
var passport = require('passport');
var passportsetup = require('./config/passport-setup');

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
app.listen(3000, function(req, res) {

    console.log('app is working in port 3000');
});