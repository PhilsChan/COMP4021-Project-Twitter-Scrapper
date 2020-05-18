const request = require('request-promise');
const cheerio = require('cheerio');

result= {}

/*
//result.user_info = getTwitterUser("realDonaldTrump");
//console.log( getTwitterUser("realDonaldTrump"))
var date123 = new Date(2020, 00, 1);
var date124 = new Date(2020, 00, 5);

var nextDay = new Date(date123);
temp = nextDay.getDate()+1;
nextDay.setDate(temp);
date124.setDate(date124.getDate() + 1);
console.log('date123:'+date123.toString());
console.log(date124.toString());

console.log('day:'+date123.getDate())
console.log('m:'+date123.getMonth())
console.log('yr:'+date123.getFullYear())
// !!!important to increment one to month 
var datefrom = date123.getFullYear().toString()+'-'+date123.getMonth().toString()+1+'-'+date123.getDate().toString();
console.log('a:'+date123.toString())
console.log('datemonth:'+date123.getMonth().toString())
var dateto = date124.getFullYear().toString()+'-'+date124.getMonth().toString()+1+'-'+date124.getDate().toString();
console.log('b:'+date124.toString())

//console.log('result::')
//console.log(result.user_info);
//getTwitterAll("realDonaldTrump",date123,date124)
*/

function getTwitterUser(username,result){
    var user_info_result={}
    var x = {}
    console.log('getting user info....')
	const $url = `https://twitter.com/${username}`;
    return request($url).then(
		function(body){       
        var $ = cheerio.load(body)("body").children();    
        
        x = $.find(".ProfileNav-value");
       
        user_info_result.name = $.find(".ProfileHeaderCard-nameLink").text();
        
        user_info_result.tweets = x[0].attribs["data-count"]
        user_info_result.following = x[1].attribs["data-count"]
        user_info_result.followers = x[2].attribs["data-count"]
        user_info_result.likes = x[3].attribs["data-count"]

        
        //console.log('printing result')
        //console.log(user_info_result);
		//resolve(user_info_result);
		return user_info_result
		}
	);
}

function getTwitterAll(username,dateFrom,dateTo){
    //const $urlsearch = `https://twitter.com/search?q=(from%3ArealDonaldTrump)%20until%3A${dateto}%20since%3A${datefrom}%20-filter%3Alinks%20-filter%3Areplies&src=typed_query`;
    /*if(from==to)return;

    var month = parseInt(from.getUTCMonth().toString());
    console.log('121233::'+month)
    var datefrom = from.getFullYear().toString()+'-'+from.getUTCMonth().toString()+1+'-'+from.getDate().toString();
    console.log('123::'+from.toString())
    
    var nextDay = new Date(from)

   

    nextDay.setDate(nextDay.getDate() + 1);
    var month123 = parseInt(nextDay.getUTCMonth().toString());
    console.log('123'+month123)
    console.log('123::'+nextDay.toString())

    var dateto = nextDay.getFullYear().toString()+'-'+nextDay.getUTCMonth().toString()+1+'-'+nextDay.getDate().toString();
    console.log(datefrom)
    console.log(dateto)
*/
     var tweetsresult = {}
    datefrom = '2020-01-03'
    dateto = '2020-01-04'
    

    const $urlsearch = `https://twitter.com/search?q=(from%3ArealDonaldTrump)%20until%3A${dateto}%20since%3A${datefrom}%20-filter%3Alinks%20-filter%3Areplies&src=typed_query`;
    //request('https://twitter.com/'+username,(err, response, body)=>{
    return request($urlsearch).then(
		(body)=>{
			console.log("test")
            const $ = cheerio.load(body)
            $('p.TweetTextSize').each((index,item)=>{
               // console.log(item.children[0]);
            //    console.log(item)
              //  console.log("================");
            })
            //console.log( ($('p.TweetTextSize')[0].children)
            var x = $('p.TweetTextSize');
            var y = $('.ProfileTweet-actionCount')
           // for( i=0;i<y.length; i++){
            //console.log(y[i].attribs["data-tweet-stat-count"]);}
           // var tweetsresult = {}
            //var tweets = x[x.length];
            for(i=0; i<x.length; i++){
                var tweets = x[i];
                tweetsresult[i]={};
                tweetsresult[i].comments = y[0+i*8].attribs["data-tweet-stat-count"];
                tweetsresult[i].retweets = y[1+i*8].attribs["data-tweet-stat-count"];
                tweetsresult[i].likes = y[2+i*8].attribs["data-tweet-stat-count"];
                
               //console.log(tweets.children[0].data);
                console.log(i+':');
                var tweetstring="";
                for(j in tweets.children){
                    if (tweets.children[j].type=="text"){
                        //console.log(j + tweets.children[j].data);   
                        tweetstring = tweetstring+  tweets.children[j].data.toString()
                    }
                
                }
               // console.log(tweetstring);
                tweetsresult[i].data = tweetstring;
            }
            //console.log(tweetsresult);
           return tweetsresult
         
        }
	);
}
	
getTwitterUser("realDonaldTrump").then( (data) => {
    result.user_info = data
    console.log(data)
})
getTwitterAll("realDonaldTrump", '2020-01-03', '2020-01-04').then( (data) => {
	result.tweets = data
	console.log(result)
})

//getTwitterUser("realDonaldTrump");
//setTimeout(() => {console.log(result);}, 3000)
