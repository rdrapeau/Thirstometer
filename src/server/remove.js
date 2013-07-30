var express = require('express');
var app = require('./app.js');

var server = express();
server.use(express.bodyParser());
server.use(express.cookieParser('dfjaoekdfsjeo'));
server.use(express.session());
server.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});


server.listen(1337, "0.0.0.0");
console.log("running on port 1337....");


app.removes();