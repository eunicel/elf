var express = require('express');
var router = express.Router();
var request = require('request');

var mongoose = require('mongoose');
var User = require('../model/user');
var Tweet = require('../model/tweet');

var Whisperkey = require('../model/whisperkey');

console.log("WHISPERKEYYYYYYYYYYYYYYYYY");
/* GET signup page */
router.get('/go', function(req, res,next){
	var url = require('url');
	var url_parts = url.parse(req.url, true);
	var query = url_parts.query;
	Whisperkey.find(query, function(err, doc) {
		if (err) {
			res.send("error.. sad :(");
		} else {
			if (query.length == 0) {
				res.render('whisperkey/create');
			} else {
				if (doc.length > 0) {
					var redirect_url = doc[0].url;
					var passwerd = doc[0].password;
					console.log("*********************");
					console.log(doc[0])
					console.log(passwerd);
					console.log(redirect_url);
					res.render('whisperkey/go', {title: "WhisperKey", url: redirect_url, password: passwerd});
				} else {
					res.send('No documents');
				}
			}
		}
	});
});

/* POST signup page */
/*
router.post('/signup', function(req,res){
	var username = req.body.username;
	User.find({"username":username}, function(err, doc){
		if(doc[0] != undefined || doc.length > 0){
			res.send("Username unavailable: Please pick a different username.");
		} else {
			var userData = {
				"firstname": req.body.firstname,
				"lastname": req.body.lastname,
				"username": req.body.username,
				"password": req.body.password,
				"tweets": [],
				"following": []
			}
			User.createUser(userData, function(err){
				if(err){
		    		res.send("There was a problem adding the information to the database.");
		    	} else {
		    		req.session.regenerate(function(err){
			    		req.session.name = username;
		    			res.location('/tweets/dashboard');
			    		res.redirect('/tweets/dashboard');
		    		});
		    	}
			});
		}
	});

});
*/

/* GET login page */
router.get('/create', function(req, res,next){
	console.log("GET CREATE");
	res.location('whisperkey/create');
	res.render('whisperkey/create', {title: 'Whisperkey', session: req.session, word: '', url: ''});
});

/* POST login page */
router.post('/create', function(req, res){
    console.log("POSTING TO CREATEEEEEEEEEEEEE");
    var user_url = req.body.user_url;

    // find a random word
    Whisperkey.find(function (err, docs){
	if (err) {
		console.log(err);
		res.send('An error occurred');
	} else {
		console.log("picking a random word");
		var i = Math.floor(Math.random() * (docs.length));
		if (docs[i] != undefined) {
			var werd = docs[i]["word"];
			console.log(werd);
			//find a random word for the password
			Whisperkey.find(function (err_, results) {
				if (err_) {
					res.send("Error getting password");
				} else {
					console.log("picking a random word for password");
					var j = Math.floor(Math.random() * (results.length));
					if (results[j] != undefined) {
						console.log("results");
						var passwerd = results[j]["word"];
						console.log("passwerd");
						console.log(passwerd);
						Whisperkey.update({"word": werd}, {"url":user_url, "password":passwerd}, {upsert: false}, function (err__){
							console.log("updating!!!!");
							if (err__) {
								console.log(err__);
								res.send("Error updating");
							} else {
								console.log("successful update, rendering");
								res.render('whisperkey/create', {title: "WhisperKey", word: werd, url: user_url, password: passwerd});
							}
						});
					}
				}
			});

		} else {
			res.send('No documents?');
		}
	}
    });
});

/* POST logout */
/*
router.post('/logout', function(req, res, next) {
    req.session.name = undefined;
    req.session.destroy(function(err) {
        if (err) {
        	res.send("There was a problem logging out.");
        } else {
        	res.location("/");
        	res.redirect("/");
        }
    });

});
*/

/* FOLLOW */
/*
router.post('/follow', function(req, res){
	if(req.session.name == undefined){
		res.redirect('../');
	} else {
		var follower = req.session.name;
		var followed = req.body.followed;
		User.follow(follower, followed, function(){
			res.location('/tweets/dashboard');
			res.redirect('/tweets/dashboard');
		});
	}
});
*/

module.exports = router;
