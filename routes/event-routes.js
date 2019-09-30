var express = require('express');
var router = express.Router();
var Event = require('../models/Event');
var { check, validationResult } = require('express-validator');
var moment = require('moment');
moment().format();


//middale were th check if user  is logged in 
isAuthenticated = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        res.redirect('/users/login');
    }
};


//create new events
router.get('/create', isAuthenticated, function(req, res) {


    res.render('event/create', {
        errors: req.flash('errors')
    });

});


router.get('/:pageNo?', function(req, res) {

    var pageNo = 1;
    if (req.params.pageNo) {

        pageNo = parseInt(req.params.pageNo);
    }
    if (req.param.pageNo == 0) {

        pageNo = 1;
    }

    var q = {
        skip: 5 * (pageNo - 1),
        limit: 5
    };

    //find total documents
    var totalDocs = 0;

    Event.countDocuments({}, function(err, total) {

    }).then(function(response) {
        totalDocs = parseInt(response);
        Event.find({}, {}, q, function(err, events) {

            // res.json(events);
            var chunk = [];
            var chunkSize = 3;
            for (var i = 0; i < events.length; i += chunkSize) {

                chunk.push(events.slice(i, chunkSize + i));
            }

            //res.json(chunk);
            res.render('event/index', {
                chunk: chunk,
                message: req.flash('info'),
                total: parseInt(totalDocs),
                pageNo: pageNo
            });
        });
    });




});



//save event to db
router.post('/create', [
    check('title').isLength({ min: 5 }).withMessage('Title should be more then 5 char '),
    check('discription').isLength({ min: 5 }).withMessage('description should be more then 5 char '),
    check('location').isLength({ min: 5 }).withMessage('location should be more then 5 char '),
    check('date').isLength({ min: 5 }).withMessage('date should be more then 5 char ')
], function(req, res) {

    var errors = validationResult(req);
    //return res.status(422).json({ errors: errors.array() });
    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.status(422).redirect('/events/create');
    } else {
        var newEvents = new Event({
            title: req.body.title,
            discription: req.body.discription,
            location: req.body.location,
            date: req.body.date,
            user_id: req.user.id,
            created_at: Date.now()


        });
        newEvents.save(function(err) {
            if (!err) {
                console.log('event was added');
                req.flash('info', 'The event was Created successfuly');
                res.redirect('/events');
            } else {
                console.log(err);
            }
        });
    }
});

//show single event
router.get('/show/:id', function(req, res) {

    Event.findOne({ _id: req.params.id }, function(err, event) {

        if (!err) {

            res.render('event/show', {
                event: event
            });
        }


    });

});


//edit route
router.get('/edit/:id', isAuthenticated, function(req, res) {

    Event.findOne({ _id: req.params.id }, function(err, event) {

        if (!err) {

            res.render('event/edit', {
                event: event,
                eventDate: moment(event.date).format('YYYY-MM-DD'),
                errors: req.flash("errors"),
                message: req.flash("info")

            });
        } else {
            console.log(err);
        }


    });
});


//update the form
router.post('/update', [
    check('title').isLength({ min: 5 }).withMessage('Title should be more then 5 char '),
    check('discription').isLength({ min: 5 }).withMessage('description should be more then 5 char '),
    check('location').isLength({ min: 5 }).withMessage('location should be more then 5 char '),
    check('date').isLength({ min: 5 }).withMessage('date should be more then 5 char ')
], isAuthenticated, function(req, res) {

    console.log(req.body);
    var errors = validationResult(req);

    if (!errors.isEmpty()) {
        req.flash('errors', errors.array());
        return res.status(422).redirect('/events/edit/' + req.body.id);
    } else {

        //create obj
        var newfeilds = {
            title: req.body.title,
            discription: req.body.discription,
            location: req.body.location,
            date: req.body.date
        };

        var query = { _id: req.body.id };

        Event.updateOne(query, newfeilds, function(err) {
            if (!err) {
                req.flash('info', "the event was update successfuly");
                res.redirect('/events/edit/' + req.body.id);
            } else {
                console.log(err);
            }
        });
    }

});


//delete events
router.delete('/delete/:id', isAuthenticated, function(req, res) {

    var query = { _id: req.params.id };

    Event.deleteOne(query, function(err) {

        if (!err) {
            res.status(200).json('deleted');
        } else {
            res.status(404).json('There was an error .event was nod deleted');
        }
    });

});

module.exports = router;