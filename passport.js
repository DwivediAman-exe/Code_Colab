var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// these two functions are used to integrate passport js with express session middleware
// This function is used in conjunction with the `passport.authenticate()` method
passport.serializeUser(function (user, done) {
	done(null, user._id);
});

// this method is to "set" on the passport object and is passed the user ID stored in the `req.session.passport`
passport.deserializeUser(function (id, done) {
	User.findOne({ _id: id }, function (err, user) {
		done(err, user);
	});
});

// Strategies are called when passport.authenticate() methods are called
// If a user is found an validated, a callback is called (`done(null, user)`) with the user object. The user object is then serialized with `passport.serializeUser()` and added to the `req.session.passport` object.
// Local strategy
passport.use(
	new LocalStrategy(
		{
			usernameField: 'email',
		},
		function (username, password, done) {
			// checking if user is in Database
			User.findOne({ email: username }, function (err, user) {
				if (err) return done(err);
				// if user not found error is null and user is false
				if (!user) {
					return done(null, false, {
						message: 'Incorrect username or password',
					});
				}
				// if password is incorrect error is null and user is false
				if (!user.validPassword(password)) {
					return done(null, false, {
						message: 'Incorrect username or password',
					});
				}
				// if everything is OK, callback with no error and user data
				return done(null, user);
			});
		}
	)
);

//facebook strategy
passport.use(
	new FacebookStrategy(
		{
			clientID: '768305230486997',
			clientSecret: 'd65ae0d1f827b87a55d924a24014f414',
			callbackURL: 'https://localhost:3000/auth/facebook/callback',
			profileFields: ['id', 'displayName', 'email'],
		},
		function (token, refreshToken, profile, done) {
			User.findOne({ facebookId: profile.id }, function (err, user) {
				if (err) return done(err);

				if (user) {
					return done(null, user);
				} else {
					User.findOne(
						{ email: profile.emails[0].value },
						function (err, user) {
							// if user already present in database
							if (user) {
								user.facebookId = profile.id;
								return user.save(function (err) {
									if (err)
										return done(null, false, {
											message: 'Cannot save user',
										});
									return done(null, user);
								});
							}

							// else creating a new and saving in database
							var user = new User();
							user.name = profile.displayName;
							user.email = profile.emails[0].value;
							user.facebookId = profile.id;
							user.save(function (err) {
								if (err)
									return done(null, false, {
										message: 'Cannot save user',
									});
								return done(null, user);
							});
						}
					);
				}
			});
		}
	)
);
