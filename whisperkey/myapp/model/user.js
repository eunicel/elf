/* User Model */
var mongoose = require('mongoose');

// user schema
var userSchema = mongoose.Schema({
	firstname: String,
	lastname: String,
    username: String,
    password: String,
	tweets: [{type: mongoose.Schema.Types.ObjectId, ref:'Tweet'}],
	following: [{type: mongoose.Schema.Types.ObjectId, ref: 'User'}]
});

// create user
userSchema.statics.createUser = function(data, callback){
	var user = new User(data);
	user.save(function(err){
		if(err){
			return console.error(err);
		} else {
			callback();
		}
	});
}

// get all necessary data to render dashboard
userSchema.statics.getDashboard = function(username, callback){
	User.find({'username':username})
	.populate('following')
	.populate('tweets')
	.exec(function(err,doc){
		if(err){
			throw err;
		} else {
			var user = doc[0];
			return followedTweets(user, callback);
		}
	});
}

// get all tweets from users followed by current user
var followedTweets = function (user, callback){
	var following = user.following;
	var tweets = user.tweets;
	var followed = [];
	for(var i = 0; i < following.length; i++){
		User.find({'username': following[i].username})
			.populate('tweets')
			.populate('following')
			.exec(function(err, doc){
				var f = doc[0];
				Array.prototype.push.apply(tweets, f.tweets);
				Array.prototype.push.apply(followed, [f.username]);
			});
	}
	var username = user.username;
	
	return getOtherUsers(username, tweets, followed, following, callback);
}

// gets all users except current user and followed users
var getOtherUsers = function(username, tweets, followed, following, callback){
	User.find({$and: [{'username':{$nin:followed}},{'username':{ $ne: username }}]})
		.populate('following')
		.populate('tweets')
		.exec(function(err,docs){
			if(err){
				throw err;
			} else {
				var users = docs;
				// sort tweets based on time it was posted
				tweets.sort(function(a,b){
					if(a.posttime < b.posttime){
						return -1;
					} else if (a.posttime > b.posttime){
						return 1;
					} else {
						return 0;
					}
				});
				callback(tweets, users, following);
			}
		});
}

// add tweet to user
userSchema.statics.createTweet = function(username, tweet, callback){
	User.find({'username': username})
	.populate('tweets')
	.exec(function(err, doc){
		if(err){ 
			throw err;
		} else {
			var user = doc[0];
			user.tweets.push(tweet);
			user.save(function(err){
				if(err){
					throw err;
				}else{
					callback();
				}
			});
		}
	});
}

// delete tweet from user
userSchema.statics.deleteTweet = function(username, tweetid, callback){
	User.find({'username': username}, function(err, doc){
		if(err){
			throw err;
		} else {
			var user = doc[0];
			user.tweets.remove(tweetid);
			user.save(function(err){
				if(err){
					throw err;
				} else {
					callback();
				}
			});
		}
	});
}

// follow user
userSchema.statics.follow = function(follower, followed, callback){
	User.find({'username':followed}, function(err, doc){
		if(err){
			throw err;
		} else {
			var followedUser = doc[0];
			User.find({'username':follower})
			.populate('following')
			.populate('tweets')
			.exec(function(err, doc){
				if(err){
					throw err;
				} else {
					var followerUser = doc[0];
					followerUser.following.push(followedUser);
					followerUser.save(function(err){
						if(err){
							throw err;
						} else {
							callback();
						}
					});
				}
			});
		}
	});
}


var User = mongoose.model('User', userSchema);

module.exports = User;