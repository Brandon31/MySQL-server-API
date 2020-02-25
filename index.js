let mysql = require('mysql');
let http = require('http'); // gives us http
let fs = require('fs'); // gives us fs
let path = require('path'); //gives us "string".pathext()
let API = require('./api.js');

const ip = '127.0.0.1';   //or domain IP
const port = 3000;  

// Create server using http module, and wait for response.
http.createServer(function(request, response) {
	
	// Print request object, just for function
	console.log('request ', request);
	// Add . to url to convert it to local file path
	let file = '.' + request.url;
	// Redirect / to serve index.html
	if (file == './') file = './index.html';
	// extract requested file's extension
	let extension = String(path.extname(file)).toLowerCase();
	// Define acceptable file extensions
	let mime = { '.html': 'text/html' }
	// if requested file type is not in mime, default
	// to octet-stream which means "arbitrary binary data."
	let type = mime[extension] || 'application/octet-stream';
	
	// Read the file from the hard drive
	fs.readFile(file, function(error, content) {
		if (error) {
			if (error.code == 'ENOENT') {
				// API or file call
				if (API.catchAPIrequest(request.url))
					response.end(API.exec(request.url), 'utf-8');
				else
					// not an api call - file just doesn't exist
					fs.readFile('./404.html', function(error, content) {
					response.writeHead(200,{'Content-Type':contentType});
					response.end(content, 'utf-8');
					});
			}   else {
				response.writeHead(500);
				response.end('Error: ' + error.code + ' ..\n');
				response.end();
			}
		} else {
			console.log("API request detecting...");
			response.writeHead(200, {'Content-Type': type});
			response.end(content, 'utf-8');
		}
	});
}).listen(port, ip);

// display server is running message
console.log('Running at ' + ip + ':' + port + '/');