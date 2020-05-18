const fs = require('fs');
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const scraper = require('./scraper_promise.js')
const PORT = 8080;

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	if (req.query.q){
		// search something
		console.log(req.query)
		res.redirect('/result');
	}
	else res.sendFile( path.join( __dirname, "html", 'index.html') );
});

app.get('/result', (req, res) => {
	console.log(req.query)
	res.sendFile( path.join( __dirname, "html", 'result.html') );
})

app.get('/advSearch', (req, res) => {
	if (req.query.q){
		// search something
		console.log(req.query)
		res.redirect('/result');
	}
	else res.sendFile( path.join( __dirname, "html", 'advSearch.html') );
})


app.listen( PORT, function() {
console.log("Express App started on port " + PORT)
});