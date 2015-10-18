/**
 * New node file
 */
var http = require('http');
var url = require('url')

function start(route, handle){

	http.createServer(function handler(req, res) {
		 var pathname = url.parse(req.url).pathname;
	        
		 console.log('Path name is '+ pathname);
		 route(handle, pathname, req, res);
		 
	}).listen(8081);
	console.log('Server running at http://127.0.0.1:1337/');
}

exports.start = start;
