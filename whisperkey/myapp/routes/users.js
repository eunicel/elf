var express = require('express');
var router = express.Router();
var request = require('request');

var mongoose = require('mongoose');
var User = require('../model/user');
var Tweet = require('../model/tweet');

var Whisperkey = require('../model/whisperkey');

/* GET signup page */
router.get('/new', function(req, res,next){
	var url = require('url');
	console.log("url");
	console.log(url);
	var url_parts = url.parse(req.url, true);
	console.log("url_parts");
	console.log(url_parts);
	var query = url_parts.query;
	Whisperkey.find(query, function(err, doc) {
		if (err) {
			res.send("error.. sad :(");
		} else {
			if (query.length == 0) {
				res.render('users/login');
			} else {
				console.log("working");
				console.log(doc);
				var redirect_url = doc[0].url;
				console.log("redirect_url");
				console.log(redirect_url);
				res.redirect(redirect_url);
			}
		}
	});
	//res.render('users/new', {title: 'Sign up for Fritter!', session: req.session});
});

/* POST signup page */
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

/* GET login page */
router.get('/login', function(req, res,next){
	console.log("GET LOGIN");
	res.location('users/login');
	res.render('users/login', {title: 'Login', session: req.session, word: '', url: ''});
});

/* POST login page */
router.post('/login', function(req, res){
    console.log("POSTING TO LOGIN");
    var user_url = req.body.user_url;
    console.log("HI");

	//console.log(Whisperkey);
	//console.log(User);
	//Whisperkey.find({"word":"dog"},function (err, docs){
    var whisperkeyData = {
      "word": "dog",
      "url": null,
    }
    console.log("HELLO?");

    Whisperkey.createWhisperkey(whisperkeyData, function(err){
      if(err){
          res.send("There was a problem adding the information to the database.");
        }
    });

    console.log("added dog");
    Whisperkey.find(function (err, docs){
	console.log("looking for something in whisperkey database");
	if (err) {
		console.log("An error has occurred");
		console.log(err);
		res.send('An error occurred');
	} else {
		//console.log(docs);
		console.log("picking a random word");
		var i = Math.floor(Math.random() * (docs.length));
		console.log("docs.length=");
		console.log(docs.length);
		console.log("size of database");
		if (docs[i] != undefined) {
				// send url and add redirect link to database
       			console.log("~~");
        		console.log(docs[i]);
        		console.log(docs[i]["word"]);
      		  	console.log(docs[i].word);

			Whisperkey.update({"word": docs[i]["word"]}, {"url":user_url}, {upsert: false}, function (err){
				if (err) {
					res.send('ERROR');
            res.send(err);
				} else {
					var werd = docs[i]["word"];
					// res.send("Your whisperkey is " + word + " and " + "localhost:8080/users/new?word=" + werd + " redirects to " + user_url);
					res.render('users/login', {title: "WhisperKey", word: werd, url: user_url});
				}
			});
		} else {
			res.send('No documents?');
		}
	}
    });
    console.log("AFTER FIND");
});

/* POST logout */
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

/* FOLLOW */
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

module.exports = router;
