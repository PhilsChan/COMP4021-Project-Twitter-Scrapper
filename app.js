const fs = require('fs');
const express = require('express');
const session = require('express-session');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const scraper = require('./scraper.js')
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
		queryArr = [];
		
		req.query.q.split(';').forEach( data => {
			data = data.trim()
			if (data.charAt(0) != '@') data = '@' + data;
			queryArr.push(data);
		} )
		console.log(queryArr);
		res.redirect('/result?q='+queryArr.join(';'));
	}
	else res.sendFile( path.join( __dirname, "html", 'index.html') );
});

app.get('/result', (req, res) => {
	console.log(req.query)
	var queryArr;
	if (req.query.q){
		queryArr = [];
		
		req.query.q.split(';').forEach( data => {
			data = data.trim()
			if (data.charAt(0) != '@') data = '@' + data;
			queryArr.push(data);
		} )
		console.log(queryArr);
	}

	// default scrape date: recent 7 days
	var dateFromStr;
	var dateToStr
	if (req.query.dateFrom && req.query.dateTo){
		dateFromStr = formatDate(new Date(req.query.dateFrom))
		dateToStr = formatDate(new Date(req.query.dateTo))
		if (new Date(dateToStr) <= new Date(dateFromStr)){
			dateTo = new Date(dateFromStr).setDate(new Date(dateFromStr).getDate()+1)
			dateToStr = formatDate(dateTo)
		}
	}
	else if (req.query.dateFrom && !req.query.dateTo) {
		dateFromStr = formatDate(new Date(req.query.dateFrom))
		dateTo = new Date(dateFromStr)
		dateTo.setDate(new Date(dateTo).getDate()+7)
		dateToStr = formatDate(dateTo)
	}	
	else if (!req.query.dateFrom && req.query.dateTo) {
		dateToStr = formatDate(new Date(req.query.dateTo) )
		dateFrom = new Date(dateToStr)
		dateFrom.setDate(new Date(dateFrom).getDate()-7)
		dateFromStr = formatDate(dateFrom)
	}
	else{
		dateFromStr = formatDate(new Date() - (7 * 24 * 60 * 60 * 1000))
		dateToStr = formatDate(new Date())
	}
	console.log("From: "+dateFromStr);
	console.log("To: "+dateToStr);
	
	var promArr = []
	for (var i in queryArr){
		if (queryArr[i].charAt(0) == '@'){
			username = queryArr[i].slice(1);
			if (username != ''){
				promArr.push(scraper.getTwitterUser(username));
				promArr.push(scraper.getTwitterAll(username, dateFromStr, dateToStr));
			}
		}
	}
	var userInfo = []
	var details = []
	var summary = {}
	summary.wordCount = 0;
	summary.retweets = 0;
	summary.comments = 0;
	summary.occurence = {}
	occurence = {}
	Promise.all(promArr).then( values => {
		console.log(values[1])
		var userCnt = promArr.length / 2
		for (var i=0; i < userCnt; i++){
			userInfo.push(values[2 * i]);
			Object.keys(values[2 * i + 1]).forEach( key => {
				details.push(values[2 * i + 1][key])
				wordList = values[2 * i + 1][key].data.split(' ');
				summary.wordCount += wordList.length;
				summary.retweets += parseInt(values[2 * i + 1][key].retweets);
				summary.comments += parseInt(values[2 * i + 1][key].comments);
				
				wordList.forEach( word => {
					word = word.replace(/[^a-zA-Z0-9\-]/g, "") .toLowerCase()
					if (word == '') return;
					if (occurence[word]) occurence[word]+=1;
					else occurence[word] = 1;
				})
				
			})
		}
		//console.log(summary.occurence)
		keysSorted = Object.keys(occurence).sort(function(a,b){return occurence[b]-occurence[a]})
		console.log(keysSorted);
		for(var i=0; i<30; i++){
			summary.occurence[keysSorted[i]] = occurence[keysSorted[i]]
		}
		details.sort( (a, b) => {
			dateA = new Date(a.Date+' '+a.Time)
			dateB = new Date(b.Date+' '+b.Time)
			if (dateA < dateB) return 1;
			if (dateA > dateB) return -1;
			return 0;
		})
		
		dateToStr = formatDate(new Date(dateToStr).setDate(new Date(dateToStr).getDate()-1))
		res.render('result', {userInfo: userInfo, details: details, dateFrom: dateFromStr, dateTo: dateToStr, summary: summary})
	})
	
	/*
	scraper.getTwitterUser("realDonaldTrump").then( (data) => {
		console.log(data);
	})*/
	
	/*var detail = {
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
	*/
	//res.sendFile( path.join( __dirname, "html", 'result.html') );
})

app.get('/advSearch', (req, res) => {
	if (req.query.q){
		// search something
		console.log(req.query)
		queryArr = [];
		
		req.query.q.split(';').forEach( data => {
			data = data.trim()
			if (data.charAt(0) != '@') data = '@' + data;
			queryArr.push(data);
		} )
		console.log(queryArr);
		res.redirect('/result?q='+queryArr.join(';'));
	}
	if (req.query.un){
		console.log(req.query);
		var queryArr = []

		req.query.un.split(';').forEach( data => {
			data = data.trim()
			if (data.charAt(0) != '@'){data = '@'+ data}
			
			if(data != '') queryArr.push(data)
		})
		console.log(queryArr);
		
		var queryStr = queryArr.join(';');
		res.redirect('/result?q='+queryStr+'&dateFrom='+req.query.dateFrom+'&dateTo='+req.query.dateTo);
	}
	else res.sendFile( path.join( __dirname, "html", 'advSearch.html') );
})


app.listen( PORT, function() {
console.log("Express App started on port " + PORT)
});