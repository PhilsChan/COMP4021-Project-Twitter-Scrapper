const request = require('request-promise');
const cheerio = require('cheerio');

result= {}

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
   
    var tweetsresult = {}
    datefrom = dateFrom;
    dateFrom.split('-')[0];
    console.log("nmsl:"+datefrom)
    var month = dateFrom.split('-')[1]-1
    var datefrominDate = new Date(dateFrom.split('-')[0],month,dateFrom.split('-')[2]);
    console.log(datefrominDate.toString())
    month = datefrominDate.getUTCMonth()+1
    //console.log(month)
    var datefrominString = datefrominDate.getFullYear().toString()+'-'+month+'-'+datefrominDate.getDate().toString(); 
    console.log("nmsldatefrominString:"+datefrominString)
    
    dateto = dateTo
    var nextdayinDate = new Date(datefrominDate);
    nextdayinDate.setDate(nextdayinDate.getDate()+1)
    //console.log("nextdayinDate:"+nextdayinDate)
    var nextdayinString = dateTo;
    //nextdayinDate.getFullYear().toString()+'-'+nextdayinDate.getUTCMonth().toString()+1+'-'+nextdayinDate.getDate().toString(); 
    //console.log("nextdayinString:"+nextdayinString)

    var month2 = dateTo.split('-')[1]-1
    
    var dateToinDate = new Date(dateTo.split('-')[0],month2,dateTo.split('-')[2])
    var dateToDate = parseInt(dateToinDate.getDate())
   month = dateToinDate.getUTCMonth()+1
    var dateToinString = dateToinDate.getFullYear().toString()+'-'+month+'-'+dateToinDate.getDate().toString(); 
   // datefrom = datefrominDate.getFullYear().toString()+'-'+datefrominDate.getUTCMonth().toString()+1+'-'+datefrominDate.getDate().toString();
    //dateto = nextdayinDate.getFullYear().toString()+'-'+nextdayinDate.getUTCMonth().toString()+1+'-'+nextdayinDate.getDate().toString();
   // console.log("fuckyoui"+dateFrom);
   console.log("dateToinDate"+dateToinDate.toString());
   console.log("nextdayinDate"+nextdayinDate.toString());
    
        month = nextdayinDate.getUTCMonth()+1;
        nextdayinString = nextdayinDate.getFullYear().toString()+'-'+month+'-'+nextdayinDate.getDate().toString(); 
       // console.log("nextdayinString:"+nextdayinString)
        console.log("ddlmsch")
    
    console.log("nmsldatefrominString:"+datefrominString)
    console.log("nextdayinString:"+nextdayinString)

    const $urlsearch = `https://twitter.com/search?q=(from%3ArealDonaldTrump)%20until%3A${nextdayinString}%20since%3A${datefrominString}%20-filter%3Alinks%20-filter%3Areplies&src=typed_query`;
    //request('https://twitter.com/'+username,(err, response, body)=>{
    return request($urlsearch).then(
		(body)=>{
			
            const $ = cheerio.load(body)

            var x = $('p.TweetTextSize');
            var y = $('.ProfileTweet-actionCount')
            var z = $('.js-short-timestamp')
            console.log(z.length)
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
                //console.log(i+':');
                var tweetstring="";
                for(j in tweets.children){
                    if (tweets.children[j].type=="text"){
                        //console.log(j + tweets.children[j].data);   
                        tweetstring = tweetstring+  tweets.children[j].data.toString()
                    }
                
                }
              
                tweetsresult[i].data = tweetstring;
            }
            console.log("===========")
            console.log(nextdayinString)
           console.log(dateToinString)

            console.log("result:"+nextdayinString.localeCompare(dateToinString))
            if(nextdayinString.localeCompare(dateToinString)==0){
                console.log("stop")
                console.log(tweetsresult)
                return tweetsresult
            }else{
                var temp = {}
                console.log("getting"+nextdayinString+"and"+dateTo)
                getTwitterAll("realDonaldTrump",nextdayinString , dateTo).then((data) => {
                    temp = data; 
                    console.log("===============meging result================")
                    //console.log(result);
                    Object.assign(tweetsresult,temp) 
                    console.log(tweetsresult)
                })
            
                 return tweetsresult               

            }
           
           // return tweetsresult
         
        }
	);
}
    




getTwitterUser("realDonaldTrump").then( (data) => {
    result.user_info = data
    console.log(data)
})
getTwitterAll("realDonaldTrump", '2020-1-3', '2020-1-6').then( (data) => {
	result.tweets = data
	console.log(result)
})

//getTwitterUser("realDonaldTrump");
//setTimeout(() => {console.log(result);}, 3000)
