var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync("password", salt);

var userSchema = new mongoose.Schema({

    email: {
        type: String,
        required: true
    },
    password: {

        type: String,
        required: true
    },
    avatar: {

        type: String,
        required: true
    }
});
//signup
userSchema.methods.hashPasswords = function(password) {

    return bcrypt.hashSync(password, salt);
};
//login 
userSchema.methods.comparePasswords = function(password, hash) {

    return bcrypt.compareSync(password, hash);
};


var User = mongoose.model('User', userSchema, 'users');

module.exports = User;