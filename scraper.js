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
    datefrom = dateFrom;
    console.log("nmsl:"+datefrom)
    var month = parseInt(datefrom.substring(5,7))-1
    var datefrominDate = new Date(datefrom.substring(0,4),month,datefrom.substring(8,10));
    var datefrominString = datefrominDate.getFullYear().toString()+'-'+datefrominDate.getUTCMonth().toString()+1+'-'+datefrominDate.getDate().toString(); 
    //console.log("nmsldatefrominString:"+datefrominString)
    
    dateto = dateTo
    var nextdayinDate = new Date(datefrominDate);
    nextdayinDate.setDate(nextdayinDate.getDate()+1)
    //console.log("nextdayinDate:"+nextdayinDate)
    var nextdayinString = dateTo;
    //nextdayinDate.getFullYear().toString()+'-'+nextdayinDate.getUTCMonth().toString()+1+'-'+nextdayinDate.getDate().toString(); 
    //console.log("nextdayinString:"+nextdayinString)

    var month2 = parseInt(dateTo.substring(5,7))-1
    var dateToinDate = new Date(dateTo.substring(0,4),month2,dateTo.substring(8,10))

   // datefrom = datefrominDate.getFullYear().toString()+'-'+datefrominDate.getUTCMonth().toString()+1+'-'+datefrominDate.getDate().toString();
    //dateto = nextdayinDate.getFullYear().toString()+'-'+nextdayinDate.getUTCMonth().toString()+1+'-'+nextdayinDate.getDate().toString();
   // console.log("fuckyoui"+dateFrom);
   console.log("dateToinDate"+dateToinDate.toString());
   console.log("nextdayinDate"+nextdayinDate.toString());
    if(dateToinDate>nextdayinDate){
        nextdayinString = nextdayinDate.getFullYear().toString()+'-'+nextdayinDate.getUTCMonth().toString()+1+'-'+nextdayinDate.getDate().toString(); 
       // console.log("nextdayinString:"+nextdayinString)
        console.log("ddlmsch")
    }
    console.log("nmsldatefrominString:"+datefrominString)
    console.log("nextdayinString:"+nextdayinString)

    const $urlsearch = `https://twitter.com/search?q=(from%3ArealDonaldTrump)%20until%3A${nextdayinString}%20since%3A${datefrominString}%20-filter%3Alinks%20-filter%3Areplies&src=typed_query`;
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
            var z = $('.js-short-timestamp')
            console.log(z.length)
           for( i=0;i<z.length; i++){
                console.log(z[i].attribs["data-time-ms"]);
        }
            //var date12312312321 = new Date (z[0].attribs["title"])
            //console.log(date12312312321.toString())
           // var tweetsresult = {}
            //var tweets = x[x.length];
            for(i=0; i<x.length; i++){
                var tweets = x[i];
                tweetsresult[i]={};
                tweetsresult[i].comments = y[0+i*8].attribs["data-tweet-stat-count"];
                tweetsresult[i].retweets = y[1+i*8].attribs["data-tweet-stat-count"];
                tweetsresult[i].likes = y[2+i*8].attribs["data-tweet-stat-count"];
                var temp = new Date(parseInt(z[i].attribs["data-time-ms"]))
                //console.log(temp.toString())
                tweetsresult[i].Date = temp.getUTCFullYear().toString()+'-'+temp.getUTCMonth().toString()+1+'-'+temp.getUTCDate().toString(); 

                tweetsresult[i].Time = temp.getUTCHours() + ':' + temp.getUTCMinutes()
                
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
getTwitterAll("realDonaldTrump", '2020-01-04', '2020-01-05').then( (data) => {
	result.tweets = data
	console.log(result)
})

//getTwitterUser("realDonaldTrump");
//setTimeout(() => {console.log(result);}, 3000)
