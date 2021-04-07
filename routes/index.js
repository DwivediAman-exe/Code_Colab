var express = require('express');
var router = express.Router();

var nodemailer = require('nodemailer');
var config = require('../config');
var transpoter = nodemailer.createTransport(config.mailer);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CodeColab - platform for sharing code !' });
});

router.get('/about', function(req, res, next){
	res.render('about', {title: 'CodeColab - platform for sharing code !'})
});

router.route('/contact')
.get( function(req, res, next) {
	res.render('contact', {title: 'CodeColab - platform for sharing code !'})
})
.post( function(req, res, next) {
	req.checkBody('name', 'Enter valid name').notEmpty().trim();
	req.checkBody('email', 'Invalid email').isEmail();
	req.checkBody('message', 'Enter valid message').notEmpty().trim();
	var errors = req.validationErrors();

	if(errors) {
		res.render('contact', {
			title: 'CodeColab - platform for sharing code !',
			name: req.body.name,
			email: req.body.email,
			message: req.body.message,
			errorMessages: errors
		});
	}
	else {
		var mailOptions = {
			from: req.body.email,
			to: 'lapi.work.2019@gmail.com',
			subject: 'You got a new message from realtime code share visitor',
			text: req.body.message
		};

		transpoter.sendMail(mailOptions, function(error, info) {
			if(error) {
				return console.log(error);
			}
			res.render('thank', {title: 'CodeColab - platform for sharing code !'});
		})

	}
});

module.exports = router;
