'use strict';

var fs = require('fs'), handleFile;

module.exports = function (request, response) {
	var url = request.url;

	if (/\/j\/[a-z]+\.js/.test(url)) {
		handleFile('public' + url, 'text/javascript', response);
		return;
	}
	handleFile('public/index.html', 'text/html', response);
};

handleFile = function (path, contentType, response) {
	fs.readFile(path, function (error, content) {
		if (error) {
			console.error(error);
			response.writeHead(500);
			response.end();
		} else {
			response.writeHead(200, { 'Content-Type': contentType });
			response.end(content, 'utf-8');
		}
	});
};
