require('babel-register')({
  "presets": ["es2015"]
});

import express    from 'express';
import morgan     from 'morgan';
import path       from 'path';
import bodyParser from 'body-parser';
import request    from 'request';
import cheerio    from 'cheerio';
import google     from 'googleapis';

// config
import config from '../config';

// initialise app
let service = google.youtube('v3');
let port = process.env.PORT || 8080; 
let app  = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../../client/build')));
app.use(bodyParser.json());
app.use(morgan('dev'));

// submit a URL for an NTS show, and webscrape to find the tracklist
app.post('/api/submit', (req, res) => {
  console.log(req.body.url);
  request.get(req.body.url, (err, response, body) => {
    if(err) {
      console.log("error");
      res.status(500).json(err);
    } else {

      const $ = cheerio.load(body);
      let element = $('.shows')['0'];
      let tracklist = [];

      for(let i=1; i<element.children.length; i+=2) {
        let trackTitle = element.children[i].children[0].data;
        tracklist.push(trackTitle);
        console.log(trackTitle);
      }

      res.status(200).json( { 
        success : true,
        tracklist 
      });  
    }
  });
});

app.get('/api/search/:keywords', (req, res) => {
  console.log();

  let parameters = {
    key       : config.youtubeApiKey,
    part      : "snippet",
    type      : "video",
    q         : req.params.keywords,
    maxResults: 3,
    order     : "viewCount",
  };

  service.search.list(parameters, (err, response) => {
    if(err) {
      console.error(err);
      res.json(err);
    } else {
      res.status(200).json(response);
    }
  });

  console.log();
});

// serve up web application
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

// set up server to listen on the given port
let server = app.listen(port, (err) => {
  if(err) {
    console.error(err);
  } else {
    let host = (server.address().address === "::") ? ("localhost") : (server.address().address);
    let port = server.address().port;
    console.info("🌎  Server listening at http://%s:%s", host, port);
  }
});

export default app;