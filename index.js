var express = require('express');
var app = express();
var http = require('http').Server(app);
var bodyParser = require('body-parser');
var cors = require('cors');
var request = require('request');
var SIS = require('./sis-scraper.js');

app.use(bodyParser.json());
app.use(cors());

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

http.listen(3000, function(){
	console.log("Server is running on http://localhost:3000");
})