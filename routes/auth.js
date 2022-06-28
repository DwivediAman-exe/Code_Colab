var express = require('express');
var router = express.Router();
var passport = require('passport');

// login route
router
	.route('/login')
	.get(function (req, res, next) {
		res.render('login', { title: 'Login your account' });
	})
	.post(
		passport.authenticate('local', {
			// authenticate() is used as route middleware to authenticate requests.
			failureRedirect: '/login',
		}),
		function (req, res) {
			res.redirect('/');
		}
	);

// register route
router
	.route('/register')
	.get(function (req, res, next) {
		res.render('register', { title: 'Register a new account' });
	})
	.post(function (req, res, next) {
		req.checkBody('name', 'Empty Name').trim().notEmpty();
		req.checkBody('email', 'Invalid Email').isEmail();
		req.checkBody('password', 'Empty Password').notEmpty();
		req.checkBody('password', 'Password do not match')
			.equals(req.body.confirmPassword)
			.notEmpty();

		var errors = req.validationErrors(); // Finds the validation errors in this request and wraps them in an object with handy functions
		if (errors) {
			res.render('register', {
				name: req.body.name,
				email: req.body.email,
				errorMessages: errors,
			});
		} else {
			var user = new User();
			user.name = req.body.name;
			user.email = req.body.email;
			user.setPassword(req.body.password);
			user.save(function (err) {
				if (err) {
					res.render('register', { errorMessages: err });
				} else {
					res.redirect('/login');
				}
			});
		}
	});

// for terminating the user session, provided by passport
router.get('/logout', function (req, res) {
	req.logOut();
	res.redirect('/');
});

// facebook auth
router.get(
	'/auth/facebook',
	passport.authenticate('facebook', { scope: 'email' })
);

router.get(
	'/auth/facebook/callback',
	passport.authenticate('facebook', {
		failureRedirect: '/',
		successRedirect: '/',
	})
);

module.exports = router;
