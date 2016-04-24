var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var User = require('../model/user');
var Tweet = require('../model/tweet');

/* GET dashboard page */
router.get('/dashboard', function(req, res, next){
	if(req.session.name == undefined){
		res.redirect('../');
	} else {
		var username = req.session.name;
		User.getDashboard(username, function(tweets, users, following){
			res.render('tweets/dashboard', { title: 'Dashboard', 'tweets': tweets, 'users': users, 'following': following, session: req.session });
		});
	}
});

/* GET compose page */
router.get('/compose', function(req, res){
	if(req.session.name == undefined){
		res.redirect('../');
	} else {
		res.render('tweets/compose', {title: 'Compose', session: req.session});
	}
});

router.post('/edit', function(req, res){
	if(req.session.name == undefined){
		res.redirect('../');
	} else {
		req.session.tweetid = req.body.tweetid;
		req.session.posttime = req.body.posttime;
		res.location('edittweet');
		res.redirect('edittweet');
	}
});

router.get('/edittweet', function(req,res){
	if(req.session.name == undefined){
		res.redirect('../');
	} else {
		Tweet.find({'_id':req.session.tweetid}, function(err, doc){
			if(err){
				throw err;
			} else {
				var content = doc[0].content;
				res.render('tweets/edittweet', {title: 'Edit', 'tweetid': req.session.tweetid, 'tweetcontent': content, session: req.session});
			}
		});
	}
});

/* POST update tweet */
router.post('/update', function(req, res){
	if(req.session.name == undefined){
		res.redirect('../');
	} else {
		var tweetid = req.session.tweetid;
		Tweet.find({'_id':tweetid}, function(err, doc){
			if(err){
				throw err;
			} else {
				if(doc.length ===1 && doc[0]!=undefined){
					var tweet = doc[0];
					Tweet.editTweet(tweet.author, tweet._id, tweet.content, tweet.posttime, function(){
						req.session.tweetid = undefined;
						req.session.posttime = undefined;
						res.location('/tweets/dashboard');
						res.redirect('/tweets/dashboard');
					});
				}
			}
		});
	}
});

/* POST add new tweet */
router.post('/addtweet', function(req,res){
	if(req.session.name == undefined){
		res.redirect('../');
	} else {
		var username =req.session.name;
		var content = req.body.tweet_content;
		var tweetData = {
			"content": content,
			"author": username,
			"posttime": new Date().getTime(),
			"like": []
		}
		Tweet.createTweet(username, tweetData, function(tweet){
			User.createTweet(username, tweet, function(){
				res.location('/tweets/dashboard');
				res.redirect('/tweets/dashboard');
			});
		});
	}
});

/* DELETE delete tweet */
router.post('/delete', function(req, res){
	if(req.session.name == undefined){
		res.redirect('../');
	} else {
		var username = req.session.name;
		var tweetid = req.body.tweetid;
		Tweet.deleteTweet(tweetid, function(){
			User.deleteTweet(username, tweetid, function(){
				res.location('/tweets/dashboard');
		    	res.redirect('/tweets/dashboard');
			});
		});
	}
});

/* Like */
router.post('/like', function (req, res){
	if(req.session.name == undefined){
		res.redirect('../');
	} else {
		var username = req.session.name;
		var tweetid = req.body.tweetid;
		var content = req.body.tweetcontent;
		var posttime = req.body.posttime;
		Tweet.likeTweet(username, tweetid, content, posttime, function(){
			res.location('/tweets/dashboard');
			res.redirect('/tweets/dashboard');
		});
	}
});

/* Unlike */
router.post('/unlike', function(req, res){
	var username = req.session.name;
	var tweetid = req.body.tweetid;
	var content = req.body.tweetcontent;
	var posttime = req.body.posttime;
	Tweet.unlikeTweet(username, tweetid, content, posttime, function(){
		res.location('/tweets/dashboard');
		res.redirect('/tweets/dashboard');
	});
});

module.exports = router;