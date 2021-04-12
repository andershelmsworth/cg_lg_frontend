//This page is just used to redirect calls to the root to the dashboard
//Require express, express-session, and instantiate the router
var express = require('express');
var router = express.Router();
const session = require('express-session');
var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var crypto = require("crypto-js");
const utf8 = require('utf8');
var key = require('../key.js');

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
    let canonicalURI = "/default\n\n";
    let action = "Action=\"\"\n";
    let headers = "content-type:application/x-www-form-urlencoded; charset=utf-8\n";
    let host = "host:34z7prad8i.execute-api.us-east-2.amazonaws.com";

    var date = new Date();
    var ISOdate = date.toISOString();
    let amzDate = "x-amz-date:" + ISOdate + "\n";

    let canonicalHeaders = host + amzDate;
    let signedHeaders = "content-type;host;x-amz-date\n";
    let message = "";

    var messageB64 = crypto.SHA256(utf8.encode(message));
    var messageB64hex = messageB64.toString(crypto.enc.Hex);

    let encrypted = messageB64hex;
    
    let canonicalRequest = method + version + canonicalURI + host + amzDate + "\n" + signedHeaders + encrypted;

    let encryptedRequest = crypto.SHA256(utf8.encode(canonicalRequest));
    let encryptedRequestHex = encryptedRequest.toString(crypto.enc.Hex);

    let algorithm = "AWS4-HMAC-SHA256\n";

    let region = "/us-east-2/";
    let month = date.getUTCMonth();
    month = month + 1;
    let shortTime = date.getUTCFullYear().toString() + "0" + month.toString() + date.getUTCDate().toString();
    
    let serviceTarget = shortTime + region + "execute-api/aws4_request";
    let stringToSign = algorithm + amzDate + serviceTarget + encryptedRequestHex;

    var kDate = crypto.HmacSHA256.toString(utf8.encode(shortTime), utf8.encode("AWS4" + key));
    //var kDateHMac = crypto.createHmac('sha256', utf8.encode("AWS4" + key));
    //kDateHMac.update(utf8.encode(shortTime));
    //var hexKdate = kDateHMac.digest('hex');


    var kRegion = crypto.HmacSHA256(utf8.encode(region), kDate);
    var kService = crypto.HmacSHA256(utf8.encode(serviceTarget), kRegion);
    var kSigning = crypto.HmacSHA256(utf8.encode("aws4_request"), kService);

    let signedString = crypto.HmacSHA256(utf8.encode(stringToSign), kSigning);

    let signedHex = signedString.toString(crypto.enc.Hex);

    let authHeader = "AWS4-HMAC-SHA256 Credential=AKIAZIWAPBO3BKOQGH55/" + serviceTarget + ", SignedHeaders=content-type;host;x-amz-date, Signature=" + signedHex;

    requestObject.setRequestHeader(utf8.encode('Authorization'), authHeader);

    requestObject.setRequestHeader(utf8.encode('X-Amz-Date'), utf8.encode(ISOdate));

    requestObject.onreadystatechange = function () {
        if (requestObject.readyState === 4) {
            console.log(authHeader);

            res.render('pages/auth', { data: requestObject.responseText });
            return;
        }
    }

    requestObject.send();

});

//Export the router
module.exports = router;