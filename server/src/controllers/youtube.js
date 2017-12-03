import express    from 'express';
import google     from 'googleapis';
import googleAuth from 'google-auth-library';
import client_secret from '../client_secret.json';

let router = express.Router();
let service = google.youtube('v3');

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
 * test creating a playlist
 */
// app.get('/api/auth', (req, res) => {

//   // let authURL = `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URL}&scope=${SCOPES}&access_type=offline`;
//   // res.json({ url : authURL });

//   let authURL = oauth2Client.generateAuthUrl({
//     access_type: 'offline',
//     scope: SCOPES
//   });
//   res.json({ url : authURL });

//   /**
//    * https://github.com/google/google-api-nodejs-client/blob/master/samples/sampleclient.js
//    * 
//    * above is a link to a useful file in a GitHub repo
//    * 
//    * in the program's current state, the user is able to generate a google sign in URL by making a post request to '/api/playlist'
//    */

// });

// app.post('/api/key', (req, res) => {

//   let authCode = req.body.authCode;
//   oauth2Client.getToken(authCode, (err, token) => {
//     if(err) {
//       console.log(err);
//       res.status(500).json(err);
//     } else {
//       oauth2Client.credentials = token;
//       let parameters = {
//         part: 'snippet, status',
//         resource: {
//           snippet: {
//             title: 'Test Playlist',
//             description: 'Ayy Lmao'
//           },
//           status: {
//             privacyStatus: 'private'
//           }
//         }
//       };
//       parameters['auth'] = oauth2Client;

//       // service.playlists.insert(parameters, (error, response) => {
//       //   if(error) {
//       //     res.status(500).json(error);
//       //   } else {
//       //     res.json(response);          
//       //   }
//       // });
      
//       // let parameters = {
//       //   'maxResults': '25',
//       //   'part': 'snippet',
//       //   'q': 'keyboard',
//       //   'type':''
//       // }
//       // parameters['auth'] = oauth2Client;

//       // service.search.list(parameters, (error, response) => {
//       //   if(error) {
//       //     res.status(500).json(error);
//       //   } else {
//       //     res.json(response);          
//       //   }
//       // });
//     }
//   });
  
// });

export default router;