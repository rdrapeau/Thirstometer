var express = require('express -s');
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
	app.verifyPass(request.body, fucntion(data){
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


server.listen(1337);