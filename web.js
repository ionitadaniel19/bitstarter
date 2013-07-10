var express = require('express');
var fs = require('fs');

var app = express.createServer(express.logger());

function read_index() {
	 return  fs.readFileSync(process.env.PWD + '/../index.html');
	};
	

app.get('/', function(request, response) {
  //response.send('Hello World 2!');
	response.send(read_index().toString());
});

var port = process.env.PORT || 5000;
app.listen(port, function() {
  console.log("Listening on " + port);
});