// UNUSED


console.log("MADE IT TO WHISPERKEY");
var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Whisperkey = require('../model/whisperkey');

/* GET login page */
router.get('/whisperkey', function(req, res,next){
	console.log ('geeting whisperkey');
	//res.location('whisperkey');
	res.render('whisperkey', {title: 'Login', session: req.session});
});

/* POST login page */
router.post('/whisperkey', function(req, res){
	console.log("ROUTES FILE login function");
	var user_url = req.body.url;

	Whisperkey.find({url: {$exists: true}}, function (err, docs){
		console.log("looking for something in whisperkey database");
		if (err) {
			res.send('An error occurred');
		} else {
			var i = Math.floor(Math.random() * (docs.length));
			if (docs[i] != undefined) {
				// send url and add redirect link to database
				Url.update({word: docs[i]}, {url:user_url}, {upsert: false}, function (err){
					if (err) {
						res.send('ERROR');
					} else {
						res.send("https://scripts.mit.edu/www/eunicel/whisperkey/" + docs[i]);
					}
				});
			} else {
				res.send('A document is undefined');
			}
		}
	});
});


module.exports = router;
