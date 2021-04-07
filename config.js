'use strict'

module.exports = {
	mailer: {
		service: 'Gmail',
		auth: {
			user: process.env.MAIL,
			pass: process.env.PASSWORD
		}
	},
	dbConnstring: 'mongodb+srv://admin:dbPassword@cluster0.pkghb.mongodb.net/CodeColabDB?retryWrites=true&w=majority',
	sessionKey: 'thisisoursecret'
}