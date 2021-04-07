var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var FacebookStrategy = require('passport-facebook').Strategy;

// set inital new session of the user
passport.serializeUser( function (user, done){
	done(null, user._id);
});

// unset inital new session of the user
passport.deserializeUser( function(id, done){
	User.findOne({_id: id}, function(err, user) {
		done(err, user);
	})
});

// passing localstrategy
passport.use(new LocalStrategy({
    usernameField: 'email'
  },
  function (username, password, done) {
    User.findOne({email: username}, function (err, user) {
      if (err) return done(err);
      if (!user) {
        return done(null, false, {
          message: 'Incorrect username or password'
        });
      }
      if (!user.validPassword(password)) {
        return done(null, false, {
          message: 'Incorrect username or password'
        });
      }
      return done(null, user);
    })
  }
));

//facebook strategy
passport.use( new FacebookStrategy({
	clientID: process.env.FACEBOOK_APP_ID,
	clientSecret: process.env.FACEBOOK_APP_SECRET,
	callbackURL: 'https://immense-fjord-53008.herokuapp.com/auth/facebook/callback',
	profileFields: ['id', 'displayName', 'email']
	},
	function(token, refreshToken, profile, done){
		User.findOne({'facebookId': profile.id}, function(err, user){
			if(err) return done(err);

			if(user) {
				return done(null, user);
			}
			else {
				User.findOne({email: profile.emails[0].value}, function(err, user) {
					if(user) {
						user.facebookId = profile.id
						return user.save( function(err){
							if(err) return done(null, false, {
								message: "Cannot save user"
							});
							return done(null, user);
						})
					}

					var user = new User();
					user.name = profile.displayName;
					user.email = profile.emails[0].value;
					user.facebookId = profile.id;
					user.save( function (err) {
						if(err) return done(null, false, {
								message: "Cannot save user"
							});
						return done(null, user);
					});
				})
			}
		});
	}
));