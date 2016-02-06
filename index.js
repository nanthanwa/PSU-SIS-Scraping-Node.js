var express = require('express');
var app = express();
var http = require('http');
var https = require('https');
var bodyParser = require('body-parser');
var errorHandler = require('errorhandler');
var cors = require('cors');
var request = require('request');
var SIS = require('./sis-scraper.js');
var publicDir = process.argv[2] || __dirname + '/public';
var path = require('path');
var hostname = process.env.HOSTNAME || 'localhost';
var port = parseInt(process.env.PORT, 10) || 80;
var fs = require('fs');

app.use(express.static(publicDir));
app.use(bodyParser.json());
app.use(cors());
app.use(errorHandler({
	dumpExceptions: true,
	showStack: true
}));


app.get("/", function (req, res) {
	res.sendFile(path.join(publicDir, "/index.html"));
});

app.post('/getProfileStudent', function(req, resToClient){
	var jar = request.jar();
	SIS.getLoginViewState((req.body.username).trim(), (req.body.password).trim(), jar)
	.then(SIS.doLogin)
	.then(SIS.getProfile)
	.then(SIS.getGradeViewState)
	.then(SIS.getGrade)
	.then(SIS.getClassDateViewState)
	.then(SIS.getClassDate)
	.then(SIS.getRegistInfoViewState)
	.then(SIS.getRegisInfo)
	.then(function(res){
		resToClient.status(200).send(res.std_profile);
	})
	.catch(function(error) {
		resToClient.status(401).send('Username or Password Incorrect');
	})
});

http.createServer(app).listen(80, function(){
	console.log("Server running on http://%s:%s", hostname, port);
});


// If you using SSL Certificate, you must uncomment and set option for ssl below and remove 'http.createServer' above.

// http.createServer(function (req, res) {
//     res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
//     res.end();
// }).listen(80, function(){
// 	console.log("Server running on http://%s:%s", hostname, port);
// });

// var options = {
//   ca:   fs.readFileSync('sub.class1.server.ca.pem'),
//   key:  fs.readFileSync('ssl.key'),
//   cert: fs.readFileSync('ssl.crt')
//   requestCert: true,
//   rejectUnauthorized: false
// };

// https.createServer(options, app).listen(443, function(){
// 	console.log("Server running on https://%s:%s", hostname, 443);
// });

