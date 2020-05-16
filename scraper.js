const request = require('request');
const cheerio = require('cheerio');

getTwitterAll("realDonaldTrump");

function getTwitterUser(username){
   const $url = `https://twitter.com/${username}`;
    request({url: $url},function(err,response,body){
        
        var $ = cheerio.load(body)("body").children();    
        var user_info = {}; 
        var x = {}
        
        var content = {};
        
        x = $.find(".ProfileNav-value");
       // content = $.find(".TweetTextSize TweetTextSize--normal js-tweet-text tweet-text").text();
        
        user_info.name = $.find(".ProfileHeaderCard-nameLink").text();
        
        user_info.tweets = x[0].attribs["data-count"]
        user_info.following = x[1].attribs["data-count"]
        user_info.followers = x[2].attribs["data-count"]
        user_info.likes = x[3].attribs["data-count"]

        
        //content = $.find(".TweetTextSize").text();
       
        console.log(user_info);   
        //console.log(content);
      
    } );

}

function getTwitterAll(username){
    request('https://twitter.com/realDonaldTrump',(err, response, body)=>{
        if(!err && response.statusCode == 200){
            console.log("124")
        
            const $ = cheerio.load(body)
            $('p.TweetTextSize').each((index,item)=>{
               // console.log(item.children[0]);
            //    console.log(item)
              //  console.log("================");
            })
            console.log($('p.TweetTextSize'))
            //console.log($('p.TweetTextSize')[0]);
            var x = $('p.TweetTextSize')[0];
            for(y in x.children){
                //console.log(x.children[y]);
                if (x.children[y].type=="text"){
                console.log(x.children[y].data);
                
                console.log("====");}
                
            }
         
        }
    })


}
