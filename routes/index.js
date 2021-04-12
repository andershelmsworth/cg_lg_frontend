//This page is just used to redirect calls to the root to the dashboard
//Require express, express-session, and instantiate the router
var express = require('express');
var router = express.Router();
const session = require('express-session');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;

//Responds to GETs to the root route
router.get('/', function (req, res, next) {
    //Get the session attribute of the request
    //sess = req.session;
    //The below was used when we were requiring login
// 	// IF ENV.LOGGEDIN == TRUE
// 	// 	res.render('pages/dashboard');
// 	// ELSE
// 	//     res.render('pages/index');		

    //Redirect to the dashboard
    res.render('pages/index');
});

//Receives data from the add form on Crews
router.post('/index', function (req, res, next) {
    reqObj = new XMLHttpRequest();

    //Initialize first part of query string, set fullUrl to the null string
    let fullUrl = "http://www.google.com/";

    //Initialize new request object
    let requestObject = new XMLHttpRequest();

    //Set headers and open parameters
    requestObject.open('GET', fullUrl, true);
    requestObject.setRequestHeader('Content-Type', 'application/json');

    let body = {};

    //requestObject.send(JSON.stringify(body));

    //response = requestObject.response;

    requestObject.onreadystatechange = function () {
        if (requestObject.readyState === 4) {
            console.log(requestObject.responseText);

            res.render('pages/auth', { data: requestObject.responseText });

        }
    }

    requestObject.send();
    response = requestObject.response;
    //res.render(JSON.stringify(response));
});

//Export the router
module.exports = router;