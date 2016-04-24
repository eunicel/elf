/* Tweet Model */
var mongoose = require('mongoose');

var tweetSchema = mongoose.Schema({
	content: String,
	author: {type: String, ref: 'User'},
	posttime: Number,
	like: [{type: String, ref: 'User'}]
});

// create tweet
tweetSchema.statics.createTweet = function(username, tweetData, callback){
	var tweet = new Tweet(tweetData);
	tweet.save(function(err){
		if(err){
			throw err;
		} else {
			callback(tweet);
		}
	});
}

// delete tweet
tweetSchema.statics.deleteTweet = function(tweetid, callback){
	Tweet.remove({'_id':tweetid}, callback);
}

// edit tweet
tweetSchema.statics.editTweet = function(username, tweetid, content, posttime, callback){
	Tweet.update({'_id':tweetid},
		{ 'content': content, 'author': username, 'posttime': posttime }, 
		function(err, doc){
			if(err){
				throw err;
			} else {
				callback();
			}
		});
}

// like tweet
tweetSchema.statics.likeTweet = function(username, tweetid, content, posttime, callback){
	Tweet.find({'_id':tweetid}, function(err, doc){
		if(err){
			throw err;
		} else {
			if(doc.length === 1 && doc[0]!= undefined){
				var tweet = doc[0];
				tweet.like.push(username);
				tweet.save(function(err){
					if (err){
						throw err;
					} else {
						callback();
					}
				});
			}
		}
	});
}

// unlike tweet
tweetSchema.statics.unlikeTweet = function(username, tweetid, content, posttime, callback){
	Tweet.find({'_id':tweetid}, function(err, doc){
		if(err){
			throw err;
		} else {
			if(doc.length === 1 && doc[0] != undefined){
				var tweet = doc[0];
				tweet.like.remove(username);
				tweet.save(function(err){
					if (err){
						throw err;
					} else {
						callback();
					}
				});
			}
		}
	});
}

var Tweet = mongoose.model('Tweet', tweetSchema);

module.exports = Tweet;