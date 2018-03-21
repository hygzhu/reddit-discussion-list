const express = require('express')
const http = require('http')
var cors = require('cors')
var request = require('request');
var cheerio = require('cheerio');

// our localhost port
const port = 4001;

const app = express()

//enables all cors requests
app.use(cors())
app.get('/products/:id', function (req, res, next) {
  res.json({ msg: 'This is CORS-enabled for all origins!' })
})

//get request that calls reddit search API
app.get('/manga/:query', lookupMangaDiscussion, function(req, res) { 
  res.json(req.results);
  res.end();
});

//middleware function for the request
function lookupMangaDiscussion(req, res, next){
  console.log("Search for manga");
  let query = req.params.query;
  console.log(query);

  //recursively gets the links
  let next_page = 'https://www.reddit.com/r/manga/search?q='+ query.toLowerCase().replace(/\s/g , "+") +'&sort=new&restrict_sr=on&t=all&limit=100';
  console.log(next_page);
  let link_list = [];
  let past_beginning = false;
  let scrape = () => request(next_page, function (error, response, body) {
    if (!error && response.statusCode == 200) {
        let $ = cheerio.load(body.toString());
        var links = $("a");
        links.each(function(i, link) {
          let found = $(link).attr("href");
          let pattern = new RegExp("www.reddit.com\/r\/manga\/comments\/.*\/disc.*" + query.toLowerCase().replace(/\s/g , "_"));//ignores case sensitivity
          if (found != undefined && found.match(pattern) && !link_list.includes(found)){
            console.log("Link: " + found);
            link_list.push(found);
          }
        });
        //scrape next page, will be undefined if no more results
        let next_page_element = $('span[class=nextprev]').children();
        if(next_page_element.length == 1 && !past_beginning){
          past_beginning = true; //Checks if we are past the first page
          next_page = next_page_element.last().attr('href');
        }else if(next_page_element.length > 1){
          next_page = next_page_element.last().attr('href');
        }else{
          next_page = undefined; //sets to undefined on last page
        }
        console.log("NEXT PAGE IS" + next_page);
        if(next_page!= undefined){
          scrape();
        }else{
          //return the results
          req.results = {
            links : link_list
          };
          next();
        }
    }
  });
  scrape();
}

const server = http.createServer(app)

server.listen(port, () => console.log(`Listening on port ${port}`))