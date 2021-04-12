/******************
 * Load required packages, mostly boilerplate
 ******************/

/* Express for route handling */
var express = require('express');
var app = express();
const session = require('express-session');

var key = require('./key.js');

//const redis = require('redis');
//const redisStore = require('connect-redis')(session);
//const client  = redis.createClient();
/* Load EJS view engine */
app.set('view engine', 'ejs');

//Parameters for using express-session
app.use(session({
    secret: 'ssshhhhh',
    // create new redis store.
    //store: new redisStore({ host: 'localhost', port: 6379, client: client,ttl : 260}),
    saveUninitialized: false,
    resave: false
}));

/* body-parser used for parsing post requests as JSON */
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));

//Need CORS for dashboard
var CORS = require('cors');

//Options for instantiating CORS
var corsOptions = {
    "origin": "*",
    "methods": "GET,HEAD,PUT,PATCH,POST,DELETE",
    "preflightContinue": false,
    "optionsSuccessStatus": 204,
    "allowedHeaders": "Content-Type,Authorization"// some legacy browsers (IE11, various SmartTVs) choke on 204
}

//Pass the specified options to CORS
app.use(CORS());

/* This allows accessing resources using '/resource' instead of '/public/resource' (CSS, Images, etc...) */
app.use(express.static(__dirname + '/public'));
app.use('/public', express.static(__dirname + '/public'));

/******************
 * Route handling
 ******************/

/* Load in the code which processes the routing  */
var route_index = require("./routes/index.js");

/* tell our app (express) to use the above loaded functions */
app.use(route_index);

/******************
 * Error pages
 ******************/

//Page not found
app.use(function (req, res) {
    res.status(404);
    res.render('404');
});

//Server error
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500);
    res.render('500');
});



/******************
 * Launch communication
 ******************/
//Listen on the specified port
//const port = 8080;
var port = process.env.PORT || 8080;
app.listen(port);
console.log('Server is running on ' + port + ' - CMD-C to quit.');

module.exports = app;