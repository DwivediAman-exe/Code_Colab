var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var expressValidator = require('express-validator');

var mongoose = require('mongoose');
var passport = require('passport');
var session = require('express-session');

require('./passport');
var config = require('./config');

// setting up the routes
var indexRouter = require('./routes/index');
var authRouter = require('./routes/auth');
var taskRouter = require('./routes/task');

// connecting he mongoDB connection string with database
mongoose.connect(config.dbConnstring);

// Making the models Globally accessible in the project
global.User = require('./models/user');
global.Task = require('./models/task');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// middleware setup
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(expressValidator());

app.use(cookieParser());
// session details
app.use(
	session({
		secret: config.sessionKey, // secret key for authentication
		resave: false, // for session resave even if nothing is changed
		saveUninitialized: true, // Similar to resave, when set true, this forces the session to be saved even if it is unitialized
	})
);

//  This creates middleware that runs before every HTTP request and checks for if current session has a req.session.passport object. If present saves the mongoDB user ID
app.use(passport.initialize());
// This calls the Passport Authenticator using the "Session Strategy". Take User ID from above function and calls deserializeUser whcih returns user and can be exracted in any req route
app.use(passport.session());

app.use(express.static(path.join(__dirname, 'public')));

// if autheticated then creating session variable (for global use)
app.use(function (req, res, next) {
	if (req.isAuthenticated()) {
		res.locals.user = req.user;
	}
	next();
});

app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', taskRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render('error');
});

module.exports = app;
