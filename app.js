const fs = require('fs');
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
//const scraper = require('./scraper.js')
const PORT = 8080;

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: true
}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set("views", path.join(__dirname, "view"));

app.set("view engine", "ejs");

function formatDate(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [year, month, day].join('-');
}

app.get('/', (req, res) => {
	if (req.query.q){
		// search something
		console.log(req.query)
		res.redirect('/result?q='+req.query.q);
	}
	else res.sendFile( path.join( __dirname, "html", 'index.html') );
});

app.get('/result', (req, res) => {
	console.log(req.query)
	var queryArr;
	if (req.query.q){
		req.session.searchStr = req.query.q;
		queryArr=req.query.q+split('+')
	}
	// default scrape date: recent 7 days
	var dateFromStr;
	var dateToStr
	if (req.query.dateFrom && req.query.dateTo){
		dateFromStr = formatDate(new Date(req.query.dateFrom))
		dateToStr = formatDate(new Date(req.query.dateTo))
	}
	else{
		dateFromStr = formatDate(new Date() - (7 * 24 * 60 * 60 * 1000))
		dateToStr = formatDate(new Date())
	}
	console.log("From: "+dateFromStr);
	console.log("To: "+dateToStr);
	/*
	scraper.getTwitterUser("realDonaldTrump").then( (data) => {
		console.log(data);
	})*/
	
	var detail = {
		user: "@realDonaldTrump",
		date: '2020/05/18',
		time: '18:28',
		content: 'blahblahblah',
		hashtags: '#fuckU',
		retweets: 386,
		comments: 123,
		likes: 100394
	}
	
	var arr = []
	for(var i=0; i<20; i++){
		arr.push(detail)
	}
	//res.sendFile( path.join( __dirname, "html", 'result.html') );
	res.render("result", {details: arr})
})

app.get('/advSearch', (req, res) => {
	if (req.query.q){
		// search something
		console.log(req.query)
		res.redirect('/result');
	}
	if (req.query.kw || req.query.ht || req.query.un){
		console.log(req.query);
		var queryArr = []
		req.query.kw.split(';').forEach( data => {
			if(data != '') queryArr.push(data.trim());
		})
		req.query.ht.split(';').forEach( data => {
			data = data.trim()
			if (data.charAt(0) != '#'){data = '#'+ data}
			if(data != '') queryArr.push(data)
		})
		data = req.query.un.split(';')[0]
		data = data.trim()
		if (data.charAt(0) != '@'){data = '@'+ data}
		if(data != '') queryArr.push(data)
		console.log(queryArr);
		
		var queryStr = queryArr.join('+');
		res.redirect('/result?q='+queryStr+'&dateFrom='+req.query.dateFrom+'&dateTo='+req.query.dateTo);
	}
	else res.sendFile( path.join( __dirname, "html", 'advSearch.html') );
})


app.listen( PORT, function() {
console.log("Express App started on port " + PORT)
});