var express = require('express');
var router = express.Router();
var ObjectID = require('mongodb').ObjectID;

/* GET home page. */
router.get('/', function(req, res, next) {
	console.log("getting home page");
	if(req.session.name == undefined){
		console.log("redirecting to users/login");
		res.location('users/login');
		console.log("HELLO");
		res.render('users/login', {title: 'Login', word: "", url: "", session: req.session});
	} else {
		console.log("redirecting to dashboard");
		res.render('tweets/dashboard', { title: 'Dashboard', session: req.session });
	}
});

module.exports = router;

