var express = require('express');
var router = express.Router();
var passport = require('passport');
const user = require('../models/user');

router.route('/login')
.get( function(req, res, next) {
	res.render('login', {title: 'Login your account'});
})
.post( passport.authenticate('local', {
	failureRedirect: '/login'
	}), function (req, res) {
		res.redirect('/');
});



router.route('/register')
.get( function(req,res, next) {
	res.render('register', {title: 'Register a new account'});
})
.post( function(req, res, next){

	var Name = req.body.name.trim();
	var Email = req.body.email.trim();
	var Password = req.body.password;
	var ConfPassword = req.body.confirmPassword;
	var errors = 0;

	if(Name.length<=0 || Email.length<=0 || Password.length<=0 || ConfPassword<=0 || Password!==ConfPassword) {
		errors++;
	}

	if(errors) {
		res.render('register', {
			name: req.body.name,
			email: req.body.email,
			errorMessages: errors 
		});
	}
	else {
		var user = new User();
		user.name = req.body.name;
		user.email = req.body.email;
		user.setPassword(req.body.password);
		user.save(function (err) {
			if(err) {
				res.render('register', { errorMessages: err});
			}
			else {
				res.redirect('/login');
			}
		})
	}

});

router.get('/logout', function(req, res, next){
req.logOut();
res.redirect('/');
});

module.exports = router;