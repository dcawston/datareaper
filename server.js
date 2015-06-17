var http = require('http');
var url = require('url');
var request = require('request');
var express = require('express');
var path = require('path');
var app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/:url', function(req,res) {
	
	var url_param = req.params.url;

	if(url) {
		request({
			url: "http://" + url_param
		}).on('error', function(err) {
			res.send(err);
		}).pipe(res);
	}

});


http.createServer(app).listen(3000, function() {
	console.log("Server listening on port 3000");
});



