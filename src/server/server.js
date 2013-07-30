var express = require('express');
var app = require('./app.js');

var server = express();
server.use(express.bodyParser());
server.use(express.cookieParser('dfjaoekdfsjeo'));
server.use(express.session());

server.post('/login', function(request,response){
	request.accepts('json');
	response.set('Content-Type', 'application/json');
	if(request.body.password != null){
		request.body.password = app.makeHash(request.body);
	}
	app.verifyPass(request.body, function(data){
		if(data.success){
			req.session.loggedIn = true;
			response.json(data);
		} else {
			response.json(data);
		}
	});
});

server.post('/register', function(request,response){
	request.accepts('json');
	response.set('Content-Type', 'application/json');
	if(request.body.password != null){
		request.body.password = app.makeHash(request.body);
	}
	app.addUser(request.body, function(back){
		response.json(back);
	});
});

server.post('/drink', function(request, response){
	if(request.body.user != null) {
		app.addDrink(request.body, function(back){
			response.json(back);
		});
	} else {
		response.json({"success" : false, "response" : "please log in"});
	}
});


server.listen(1337);


var regtest = {
	"username" : "user2",
	"password" : "pass2"
};

var logtest = {
	"username" : "user3",
	"password" : "pass3"
};

var drtest = {
	"username" : "userr2",
	"drink" : {
		"size" : "8",
		"time" : "4"
	}
};

/*
if(regtest.password != null){
	regtest.password = app.makeHash(regtest);
}
app.addUser(regtest, function(back){
	console.log(back);
});


if(logtest.password != null){
	logtest.password = app.makeHash(logtest);
}
app.verifyPass(logtest, function(data){
	console.log(data);
});



if(drtest.username != null) {
	app.addDrink(drtest, function(back){
		console.log(back);
	});
} else {
	console.log({"success" : false, "response" : "please log in"});
}

*/