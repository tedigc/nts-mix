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
import googleAuth from 'google-auth-library';
import axios from 'axios';
import util from 'util';

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

import client_secret from '../client_secret.json';

let CLIENT_ID     = client_secret.web.client_id;
let CLIENT_SECRET = client_secret.web.client_secret;
let REDIRECT_URL  = client_secret.web.redirect_uris[0];
let SCOPES        = [ 'https://www.googleapis.com/auth/youtube' ];

let auth = new googleAuth();
let OAuth2Client = google.auth.OAuth2;
let oauth2Client = new auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);

/**
 * test creating a playlist
 */
app.get('/api/auth', (req, res) => {

  // let authURL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPES}&access_type=offline`;
  // res.json({ url : authURL });

  let authURL = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  res.json({ url : authURL });

  /**
   * https://github.com/google/google-api-nodejs-client/blob/master/samples/sampleclient.js
   * 
   * above is a link to a useful file in a GitHub repo
   * 
   * in the program's current state, the user is able to generate a google sign in URL by making a post request to '/api/playlist'
   */

});

app.post('/api/key', (req, res) => {

  let authCode = req.body.authCode;
  oauth2Client.getToken(authCode, (err, token) => {
    if(err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      oauth2Client.credentials = token;
      let parameters = {
        part: 'snippet, status',
        resource: {
          snippet: {
            title: 'Test Playlist',
            description: 'Ayy Lmao'
          },
          status: {
            privacyStatus: 'private'
          }
        }
      };
      parameters['auth'] = oauth2Client;

      // service.playlists.insert(parameters, (error, response) => {
      //   if(error) {
      //     res.status(500).json(error);
      //   } else {
      //     res.json(response);          
      //   }
      // });
      
      // let parameters = {
      //   'maxResults': '25',
      //   'part': 'snippet',
      //   'q': 'keyboard',
      //   'type':''
      // }
      // parameters['auth'] = oauth2Client;

      // service.search.list(parameters, (error, response) => {
      //   if(error) {
      //     res.status(500).json(error);
      //   } else {
      //     res.json(response);          
      //   }
      // });
    }
  });

  // console.log(req.body.authCode);
  // let authCode = encodeURIComponent(req.body.authCode);
  // console.log(authCode);
  // let keyURL = `https://www.googleapis.com/oauth2/v4/token`;
  // // let keyURL = `https://www.googleapis.com/oauth2/v4/token?code=${authCode}&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}&redirect_uri=${REDIRECT_URL}&grant_type=authorization_code`;
  // let parameters = {
  //   code          : authCode,
  //   client_id     : CLIENT_ID,
  //   client_secret : CLIENT_SECRET,
  //   redirect_uri  : REDIRECT_URL,
  //   grant_type    : 'authorization_code'
  // };
  // axios.post(keyURL, parameters)
  //   .then((response) => {
  //     console.log("SUCCESS");
  //     console.log(response);
  //     res.send(response);
  //   })
  //   .catch((error) => {
  //     console.error("ERROR");
  //     console.error(error);
  //     res.status(500).json(error);
  //   });

  // axios.post(keyURL, parameters)
  //   .then((response) => {
  //     res.json(response);
  //   })
  //   .error((error) => {
  //     console.log(error);
  //     res.json(error);
  //   })


  // oauth2Client.getToken(authCode, (err, token) => {
  //   if(err) {
  //     console.error(err);
  //     res.status(500).json(err);
  //   } else {
  //     res.json(token);
  //   }
  // });
  
});

/**
 * create a playlist
 */
app.post('/api/playlist', (req, res) => {
  console.log("creating playlist");
  res.sendStatus(200);
});


/**
 * submit a URL for an NTS show, and webscrape to find the tracklist
 */ 
app.post('/api/tracklist', (req, res) => {
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
      }

      res.status(200).json( { 
        success : true,
        tracklist 
      });  
    }
  });
});

/**
 * test using the youtube search api
 */
app.get('/api/search/:keywords', (req, res) => {

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
});

/**
 * serve up web application
 */ 
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

/**
 * set up server to listen on the given port
 */ 
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