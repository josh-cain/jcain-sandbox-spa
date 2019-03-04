const express = require('express');
const app = express();
const fs = require('fs');
const mustache = require('mustache');
require('dotenv').config();

app.use('/node_modules', express.static('node_modules'));
app.use('/static', express.static('static'));

if (!process.env.AUTH0_DOMAIN || !process.env.AUTH0_AUDIENCE) {
	throw 'Make sure you have AUTH0_DOMAIN, and AUTH0_AUDIENCE in your .env file'
}

fs.readFile('index.html.mustache', function (err, data) {
	if (err) throw err;

	var indexContent = mustache.render(data.toString(), process.env);
	app.get('/', function(req, res) {
		res.send(indexContent);
	}); 

	fs.readFile('app.js.mustache', function (err, data) {
		if (err) throw err;

		var appJsContent = mustache.render(data.toString(), process.env);
		app.get('/app.js', function(req, res) {
			res.send(appJsContent);
		});

		const port = process.env.PORT || 3000;
		app.listen(port);
		console.log('Node client loaded, listening on http://localhost:' + port);
	});
});
