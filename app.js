var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var methodOverride = require('method-override');
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(partials());
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser('Quiz 2015'));
app.use(session({ resave:false, saveUninitialized:true, secret:'Quiz 2015', cookie:{ secret:true } }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Dynamic helpers
app.use(function(req, res, next) {
    // stores path in session.redir for after login
    if(!req.path.match(/\/login|\/logout/))
        req.session.redir = req.path;

    // make visible session during the visits
    res.locals.session = req.session;
    next();
});
var SECONDS_EXPIRATION = 60*2; // = 2 minutes
app.use(function(req, res, next) {
    var dnow = new Date(); // Create e new Date object with current timestamp
    var uts = Math.round(dnow.getTime()/1000); // Gets the Unix Timestamp of object date in seconds
    if(req.session.user === undefined) {
        // Nothing to do, user is not logged
        console.log("SESSION INFO: session(user) is still undefined");
        next();
        return true;
    }
    if(SECONDS_EXPIRATION==0) {
        //Nothing to do, session never expires
        return true;
    }
    if(req.session.expiration===undefined) {
        req.session.expiration = uts + SECONDS_EXPIRATION;
        var d_exp = new Date(req.session.expiration * 1000);

        console.log("SESSION INFO: Initialized session(expiration) to " + d_exp);

    }
    else {
        // session(expiration) was previosuly initialized
        var uts_expiration = uts + SECONDS_EXPIRATION;
        if(req.session.expiration < uts) {
            // session has expired, redirect
            console.log("SESSION INFO: Session has expired, destroying and redirecting")
            delete req.session.user;
            delete req.session.expiration;
            req.session.errors = [{ 'message' : "Error: La sesión ha caducado" }];
            res.redirect('/login');
        }
        else {
            var d_exp = new Date(uts_expiration * 1000);
            console.log("SESSION INFO: Updated session expiration to " + d_exp);
            req.session.expiration = uts_expiration;
           
        }
    }
    res.locals.sessions = req.session;
    next();
});

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
            error: err, errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}, errors: []
    });
});


module.exports = app;
