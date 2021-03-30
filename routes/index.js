var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'CodeColab - platform for sharing code' });
});

router.get('/about', function(req, res, next) {
  res.render('about', { title: 'Codecolab - platform for sharing code' });
});

router.route('/contact')
.get( function(req, res, next) {
  res.render('contact', { title: 'Codecolab - platform for sharing code' });
})
.post( function(req, res, next) {
	
	var Name = req.body.name.trim();
	var Email = req.body.email.trim();
	var Message = req.body.message.trim();
	var errors = 0;

	if(Name.length<=0 || Email.length<=0 || Message.length<=0) {
		errors++;
	}
	
	if(errors) {
		res.render('contact', 
			{ title: 'Codecolab - platform for sharing code' ,
			name: req.body.name,
			email: req.body.email,
			message: req.body.message,
			errorMessages:errors 
		});
	}
	else {
		res.render('thank', { title: 'Codecolab - platform for sharing code' });
	}

});

module.exports = router;
