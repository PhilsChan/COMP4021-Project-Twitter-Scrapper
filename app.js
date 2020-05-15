const fs = require('fs');
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const PORT = 8080;

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
	if (req.query){
		// search something	
	}
	else res.sendFile( path.join( __dirname, "html", 'index.html') );
});

app.listen( PORT, function() {
console.log("Express App started on port " + PORT)
});