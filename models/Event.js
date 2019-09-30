var mongoose = require('mongoose');

var eventSchema = new mongoose.Schema({

    title: {
        type: String,
        required: true
    },
    discription: {

        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    user_id: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        required: true
    }

});

var Event = mongoose.model('Event', eventSchema, 'events');

module.exports = Event;