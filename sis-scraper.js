var request = require('request');
var Q = require('q');
var cheerio = require('cheerio');

var sv_number = 5;
var sis_url = 'https://sis-hatyai'+sv_number+'.psu.ac.th';

exports.getLoginViewState = function(username, password, jar){
	console.log('getLoginViewState');
	var deferred = Q.defer();
	request({
		url : sis_url+'/WebRegist2005/Login.aspx',
		method : 'get',
		jar : jar,
		followAllRedirects : true
		}, function(err, response, body){
			if(err){
				deferred.reject(err);
			}
			else{
				var $ = cheerio.load(body);
				var __VIEWSTATE = $("input[name='__VIEWSTATE']").val();
				deferred.resolve({
					username: username,
					password: password,
					__VIEWSTATE : __VIEWSTATE,
					jar : jar
				});
			}
	});
	return deferred.promise;
};

exports.doLogin = function doLogin(obj){
	console.log('doLogin');
	var jar = obj.jar;
	var deferred = Q.defer();
	var std_profile = {};
	request.post({
		url : sis_url+'/WebRegist2005/Login.aspx',
		method : 'post',
		jar : jar,
		followAllRedirects : true,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.6 (KHTML, like Gecko) Chrome/16.0.897.0 Safari/535.6'
		},
		form : {
			"ctl00$mainContent$Login1$UserName" : obj.username,
			"ctl00$mainContent$Login1$Password" : obj.password,
			"ctl00$mainContent$Login1$LoginButton" : "Sign In",
			"__VIEWSTATE" : obj.__VIEWSTATE
		}
	}, function(err, res, body){
		if(err){
			deferred.reject(err);
		}
		else{
			$ = cheerio.load(body);
			var studentInfoString = $("#ctl00_ctl00_LoginView1_LoginName1").text();
			if(studentInfoString == ''){
				deferred.reject('Username or Password Incorrect');
			}
			var studentInfo = studentInfoString.split(" - ");
			std_profile.std_id = studentInfo[0];
			std_profile.std_name = studentInfo[1];
			deferred.resolve({
				std_profile: std_profile,
				jar: jar
			});
		}
	});
	return deferred.promise;
};

exports.getProfile = function getProfile(obj){
	console.log('getProfile');
	var std_profile = obj.std_profile;
	var jar = obj.jar;
	var deferred = Q.defer();
	request({
		url : sis_url+'/WebRegist2005/Student/studentProfile.aspx',
		method : 'get',
		jar : obj.jar,
		followAllRedirects : true
	}, function(err, response, body){
		if(err){
			deferred.reject(err);
		}
		else{
			var $ = cheerio.load(body);
			var infoTable = $("#ctl00_ctl00_mainContent_PageContent_UcDetailViewProfile1_DetailsView1");
			var std_email = infoTable.children("tr").children("td").eq(37).text();
			std_profile.std_email = std_email;
			var std_image = $("#ctl00_ctl00_mainContent_PageContent_imgStudent").attr("src");
			std_image = sis_url+'/WebRegist2005/'+std_image.substr(3);
			std_profile.std_image = std_image;
			deferred.resolve({
				std_profile: std_profile,
				jar : jar
			});
		}
	});
	return deferred.promise;
};

exports.getGradeViewState = function(obj){
	console.log('getGradeViewState');
	var std_profile = obj.std_profile;
	var jar = obj.jar;
	var deferred = Q.defer();
	request({
		url : sis_url+'/WebRegist2005/Student/StudentGrade.aspx',
		method : 'get',
		jar : jar,
		followAllRedirects : true
	}, function(err, response, body){
		if(err){
			deferred.reject(err);
		}
		else{
			$ = cheerio.load(body);
			var __VIEWSTATE = $("input[name='__VIEWSTATE']").val();
			deferred.resolve({
				std_profile: std_profile,
				jar: jar,
				__VIEWSTATE: __VIEWSTATE
			});
		}
	});
	return deferred.promise;
};

exports.getGrade = function(obj){
	console.log('getGrade');
	var std_profile = obj.std_profile;
	var jar = obj.jar;
	var __VIEWSTATE = obj.__VIEWSTATE;
	var deferred = Q.defer();
	request({
		url : sis_url+'/WebRegist2005/Student/StudentGrade.aspx',
		method : 'post',
		jar : jar,
		followAllRedirects : true,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.6 (KHTML, like Gecko) Chrome/16.0.897.0 Safari/535.6'
		},
		form : {
			"ctl00$ctl00$mainContent$PageContent$btnShowAll" : "แสดงทั้งหมด",
			"__VIEWSTATE" : __VIEWSTATE,
		}
	}, function(err, response, body){
		if(err){
			deferred.reject(err);
		}
		$ = cheerio.load(body);
		var infoTable = $("#ctl00_ctl00_mainContent_PageContent_ctl17_DetailsView2");
		var std_gpa = infoTable.children("tr").children("td").eq(5).text();
		std_profile.std_gpa = std_gpa;
		deferred.resolve({
			std_profile: std_profile,
			jar: jar
		});
	});
	return deferred.promise;
};

exports.getClassDateViewState = function(obj){
	console.log('getClassDateViewState');
	var std_profile = obj.std_profile;
	var jar = obj.jar;
	var deferred = Q.defer();
	request({
		url : sis_url+'/WebRegist2005/Student/StudentClassDate.aspx',
		method : 'get',
		jar : jar,
		followAllRedirects : true
	}, function(err, response, body){
		if(err){
			deferred.reject(err);
		}
		$ = cheerio.load(body);
		var __VIEWSTATE = $("input[name='__VIEWSTATE']").val();
		deferred.resolve({
			std_profile: std_profile,
			jar: jar,
			__VIEWSTATE: __VIEWSTATE
		});
	});
	return deferred.promise;
};

exports.getClassDate = function  getClassDate(obj){
	console.log('getClassDate');
	var std_profile = obj.std_profile;
	var jar = obj.jar;
	var __VIEWSTATE = obj.__VIEWSTATE;
	var deferred = Q.defer();
	request({
		url : sis_url+'/WebRegist2005/Student/StudentClassDate.aspx',
		method : 'post',
		jar : jar,
		followAllRedirects : true,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.6 (KHTML, like Gecko) Chrome/16.0.897.0 Safari/535.6'
		},
		form : {
			"ctl00$ctl00$mainContent$PageContent$UcTermYearSelector1$ddlTermYear" : "2/2558",
			"ctl00$ctl00$mainContent$PageContent$btnShow" : "แสดงตารางเรียน",
			"__VIEWSTATE" : __VIEWSTATE,
		}
	}, function(err, response, body){
		if(err){
			deferred.reject(err);
		}
		$ = cheerio.load(body);
		var infoTable = $("#ctl00_ctl00_mainContent_PageContent_UcGridViewClassDate1_GridView1");
		var std_schedule = [];
		var eachRowSchedule = [];
		var each_std_schedule_obj = {};
		for(var i = 1 ; i < infoTable.children("tr").length ; i++){
			for(var j = 0 ; j < infoTable.children("tr").eq(i).children("td").length ; j++){
				eachRowSchedule.push(infoTable.children("tr").eq(i).children("td").eq(j).text());
			}
			each_std_schedule_obj = {
				day : eachRowSchedule[0],
				start_time : eachRowSchedule[1],
				end_time : eachRowSchedule[2],
				subject_id : eachRowSchedule[3],
				subject_name : eachRowSchedule[4],
				credit : eachRowSchedule[5],
				section : eachRowSchedule[6],
				lecturer : eachRowSchedule[7],
				classroom : eachRowSchedule[8]
			};
			eachRowSchedule = [];
			std_schedule.push(each_std_schedule_obj);
		}
		std_profile.std_schedule = std_schedule;
		deferred.resolve({
			std_profile: std_profile,
			jar: jar
		});
	});
	return deferred.promise;
};


exports.getRegistInfoViewState = function getRegistInfoViewState(obj){
	console.log('getRegistInfoViewState');
	var std_profile = obj.std_profile;
	var jar = obj.jar;
	var deferred = Q.defer();
	request({
		url : sis_url+'/WebRegist2005/Student/StudentRegistInfo.aspx',
		method : 'get',
		jar : jar,
		followAllRedirects : true
	}, function(err, response, body){
		if(err){
			deferred.reject(err);
		}
		$ = cheerio.load(body);
		var __VIEWSTATE = $("input[name='__VIEWSTATE']").val();
		deferred.resolve({
			std_profile: std_profile,
			__VIEWSTATE: __VIEWSTATE,
			jar: jar
		});
	});
	return deferred.promise;
};

exports.getRegisInfo = function getRegisInfo(obj){
	console.log('getRegisInfo');
	var std_profile = obj.std_profile;
	var jar = obj.jar;
	var __VIEWSTATE = obj.__VIEWSTATE;
	var deferred = Q.defer();
	request({
		url : sis_url+'/WebRegist2005/Student/StudentRegistInfo.aspx',
		method : 'post',
		jar : jar,
		followAllRedirects : true,
		headers: {
			'User-Agent': 'Mozilla/5.0 (Windows NT 5.1) AppleWebKit/535.6 (KHTML, like Gecko) Chrome/16.0.897.0 Safari/535.6'
		},
		form : {
			"ctl00$ctl00$mainContent$PageContent$UcTermYearSelector1$ddlTermYear" : "2/2558",
			"ctl00$ctl00$mainContent$PageContent$btnSearch" : "แสดงผลการลงทะเบียน",
			"__VIEWSTATE" : __VIEWSTATE,
		}
	}, function(err, response, body){
		if(err){
			deferred.reject(err);
		}
		$ = cheerio.load(body);
		var infoTable = $("#ctl00_ctl00_mainContent_PageContent_UcGridViewRegistData1_GridView1");
		var std_regist = [];
		var eachRowRegist = [];
		var each_std_regist_obj = {};
		for(var i = 1 ; i < infoTable.children("tr").length ; i++){
			for(var j = 0 ; j < infoTable.children("tr").eq(i).children("td").length ; j++){
				eachRowRegist.push(infoTable.children("tr").eq(i).children("td").eq(j).text());
			}
			each_std_regist_obj = {
				subject_id : eachRowRegist[0],
				section : eachRowRegist[1],
				subject_name : eachRowRegist[2],
				credit : eachRowRegist[3],
				type : eachRowRegist[4],
				status : eachRowRegist[5]
			};
			eachRowRegist = [];
			std_regist.push(each_std_regist_obj);
		}
		std_profile.std_regist = std_regist;
		deferred.resolve({
			std_profile: std_profile,
			jar: jar
		});
	});
	return deferred.promise;
};