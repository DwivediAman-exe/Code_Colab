var mongoose = require('mongoose');
var crypto = require('crypto');

var userSchema = new mongoose.Schema({
	email: {
		type: String,
		unique: true,
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	hash: String,
	salt: String,
	facebookId: String,
});

// using the password of user and adding a random string of characters(salt) and then hashing the password
userSchema.methods.setPassword = function (password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	this.hash = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1')
		.toString('hex');
};

userSchema.methods.validPassword = function (password) {
	var hash = crypto
		.pbkdf2Sync(password, this.salt, 1000, 64, 'sha1')
		.toString('hex');
	return this.hash === hash;
};

module.exports = mongoose.model('User', userSchema);
