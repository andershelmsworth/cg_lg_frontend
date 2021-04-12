//This page is just used to redirect calls to the root to the dashboard
//Require express, express-session, and instantiate the router
var express = require('express');
var router = express.Router();
const session = require('express-session');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var crypto = require("crypto-js");

var key = require('./key.js');

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
    let fullUrl = "https://34z7prad8i.execute-api.us-east-2.amazonaws.com/default";

    //Initialize new request object
    let requestObject = new XMLHttpRequest();

    //Set headers and open parameters
    requestObject.open('GET', fullUrl, true);

    let body = {};

    //requestObject.send(JSON.stringify(body));

    //response = requestObject.response;

    let method = "GET\n";
    let version = "HTTP/1.1";
    let canonicalURI = "/\n";
    let action = "Action=\"\"\n";
    let headers = "content-type:application/x-www-form-urlencoded; charset=utf-8\n";
    let host = "host:iam.amazonaws.com\n";

    var date = new Date();
    var ISOdate = date.toISOString();
    let amzDate = "x-amz-date:" + ISOdate + "\n";

    let canonicalHeaders = headers + host + amzDate;
    let signedHeaders = "content-type;charset;host;x-amz-date\n";
    let message = "Hello, WOrld!";

    let encrypted = crypto.SHA256(message);

    let canonicalRequest = method + version + canonicalURI + action + headers + host + amzDate + "\n" + signedHeaders + encrypted;

    let encryptedRequest = crypto.SHA256(canonicalRequest);

    let algorithm = "AWS4-HMAC-SHA256\n";

    let region = "/us-east-2/";
    let shortTime = date.getUTCFullYear() + date.getUTCMonth() + date.getUTCDay();
    let serviceTarget = shortTime + region + "34z7prad8i.execute-api.us-east-2/aws4_request\n";
    let stringToSign = algorithm + amzDate + serviceTarget + encryptedRequest;

    var kDate = crypto.HmacSHA256(shortTime, "AWS4" + key);
    var kRegion = crypto.HmacSHA256(region, kDate);
    var kService = crypto.HmacSHA256(serviceTarget, kRegion);
    var kSigning = crypto.HmacSHA256("aws4_request", kService);

    let authHeader = "AWS4-HMAC-SHA256 Credential=AKIAZIWAPBO3BKOQGH55/" + serviceTarget + ", SignedHeaders=content-type;charset;host;x-amz-date, Signature=" + kSigning;

    requestObject.setRequestHeader('Authorization', authHeader);

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