var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var readline = require('readline');
var fs = require('fs');

var Whisperkey = require('./model/whisperkey');
var connection_string = 'localhost/fritter';
/*
if (process.env.OPENSHIFT_MONGODB_DB_PASSWORD) {
  connection_string = process.env.OPENSHIFT_MONGODB_DB_USERNAME + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PASSWORD + '@' +
        process.env.OPENSHIFT_MONGODB_DB_HOST + ':' +
        process.env.OPENSHIFT_MONGODB_DB_PORT + '/' +
        process.env.OPENSHIFT_APP_NAME;
}
*/

var mongo = require('mongodb');

var mongoose = require('mongoose');
//mongoose.connect(connection_string);
//
console.log("%%%%%%%%%%%%%%%%%%%");
console.log(process.env);
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/fritter');

// import words into database
var dictionary = []
var rl = readline.createInterface({
    terminal: false,
    input: fs.createReadStream('./shoutkey_dictionary.txt')
});
rl.on('line', function(line) {
	dictionary.push(line);
});
rl.on('close', function() {
	var i = 0;
	import_words(i)
	console.log("IMPORTED WORDS");
});
var import_words = function(i) {
        var whisperkeyData = { 
            "word": dictionary[i],
            "url": null,
	    "password": null,
        }   
	console.log(dictionary[i]);

        Whisperkey.createWhisperkey(whisperkeyData, function(err){
            if(err){
                res.send("There was a problem adding the information to the database.");
            }   
	    if (i < dictionary.length-1) {
	    	i++;
	    	import_words(i);
	    }
        }); 
}

var db = mongoose.connection;
db.on('error', function(){console.log('connection error'); });

db.once('open', function(){});
var session = require('express-session');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.set('trust proxy', 1); // trust first proxy
app.use(session({
    secret: 'keyboard cat',
}));

var routes = require('./routes/index');
var users = require('./routes/users');
var tweets = require('./routes/tweets');
var whisperkeys = require('./routes/whisperkey');

app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/tweets', tweets);
app.use('/users', users);
app.use('/whisperkey', whisperkeys);
app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});

//var port = process.env.OPENSHIFT_NODEJS_PORT;
//var ip = process.env.OPENSHIFT_NODEJS_IP;

//app.listen(port || 8080, ip);
app.listen(process.env.PORT || 8080);
module.exports = app;
