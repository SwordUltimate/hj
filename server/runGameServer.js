var http = require("http");
var url = require("url");
var fs = require("fs");

var userFile = "data/user.json";
var scoreFile = "data/score.json";

var express = require('express') // 加载模块
var app = express() // 实例化之
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST');
	res.setHeader('Access-Control-Allow-Headers',
			'X-Requested-With,content-type, Authorization');
	next();
});

// 注册
app.post('/register/:name/:pwd', function(req, response) { // Restful
	// Get方法,查找整个集合资源
	response.set({
		'Content-Type' : 'text/json',
		'Encodeing' : 'utf8'
	});
	var name = req.params.name;
	var pwd = req.params.pwd;
	var msg = "";
	// 打开文件系统
	if (fs.existsSync(userFile)) {
		// 读取文件内容
		var fileStr = fs.readFileSync(userFile);
		var users = new Array();
		if (fileStr != undefined && fileStr != null && fileStr != "") {
			var users = JSON.parse(fileStr);
			for (var i = 0; i < users.length; i++) {
				var user = JSON.parse(JSON.stringify(users[i]));
				if (user.name == name) {
					msg = "用户名已存在！";
					break;
				}
			}
		}
		// 如果验证通过，写入用户密码
		if (msg == "") {
			var newUser = {
				"name" : name,
				"pwd" : pwd
			};
			users.push(newUser);
			fs.writeFileSync(userFile, JSON.stringify(users));
			msg = "注册成功，系统将自动登录！";
		}
	} else {
		msg = "文件不存在！";
	}
	// 返回消息
	response.send({
		"msg" : msg
	});
})

// 登录
app.post('/login/:name/:pwd', function(req, response) { // Restful
	// Get方法,查找整个集合资源
	response.set({
		'Content-Type' : 'text/json',
		'Encodeing' : 'utf8'
	});
	var name = req.params.name;
	var pwd = req.params.pwd;
	var msg = "";
	// 打开文件系统
	if (fs.existsSync(userFile)) {
		// 读取文件内容
		var fileStr = fs.readFileSync(userFile);
		if (fileStr == undefined || fileStr == null || fileStr == "") {
			msg = "用户不存在！";
			// 返回消息
			response.send({
				"msg" : msg
			});
			return;
		}
		var users = JSON.parse(fileStr);
		for (var i = 0; i < users.length; i++) {
			var user = JSON.parse(JSON.stringify(users[i]));
			if (user.name == name && user.pwd == pwd) {
				msg = "登录成功！";
				break;
			}
		}
		// 如果验证通过，写入用户密码
		if (msg == "") {
			msg = "用户名或密码错误！";
		}
	} else {
		msg = "文件不存在！";
	}
	// 返回消息
	response.send({
		"msg" : msg
	});
})

// 记录得分
app.post('/record/:name/:score', function(req, response) { // Restful
	// Get方法,查找整个集合资源
	response.set({
		'Content-Type' : 'text/json',
		'Encodeing' : 'utf8'
	});
	var name = req.params.name;
	var score = req.params.score;
	var msg = "";
	// 打开文件系统
	if (fs.existsSync(scoreFile)) {
		// 读取文件内容
		var fileStr = fs.readFileSync(scoreFile);
		var scores = new Array();
		if (fileStr != undefined && fileStr != null && fileStr != "") {
			scores = JSON.parse(fileStr);
		}
		// 当前时间
		var time = Date.parse(new Date());
		var score = {
			"name" : name,
			"score" : score,
			"time" : time
		};

		scores.push(score);
		fs.writeFileSync(scoreFile, JSON.stringify(scores));

		msg = "保存成功！";
	} else {
		msg = "文件不存在！";
	}
	// 返回消息
	response.send({
		"msg" : msg
	});
})

// 查询得分
app.post('/queryRecord', function(req, response) { // Restful
	// Get方法,查找整个集合资源
	response.set({
		'Content-Type' : 'text/json',
		'Encodeing' : 'utf8'
	});
	var msg = "";
	// 打开文件系统
	if (fs.existsSync(scoreFile)) {
		// 读取文件内容
		var fileStr = fs.readFileSync(scoreFile);
		var scores = new Array();
		if (fileStr != undefined && fileStr != null && fileStr != "") {
			scores = JSON.parse(fileStr);
			msg = JSON.stringify(scores);
			console.info(msg);
		}
	} else {
		msg = "error";
	}
	// 返回消息
	response.send({
		"msg" : msg
	});
})
app.listen(8888); // 监听8888端口，没办法，总不好抢了tomcat的8080吧！

//终端打印如下信息
console.log('Server running at http://127.0.0.1:8888/');