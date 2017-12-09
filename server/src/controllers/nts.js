import express from 'express';
import request from 'request';
import cheerio from 'cheerio';

let router = express.Router();

/**
 * submit a URL for an NTS show, and webscrape to find the tracklist
 */ 
router.post('/tracklist', (req, res) => {
  request.get(req.body.url, (err, response, body) => {
    if(err) {
      console.log("error");
      res.status(500).json(err);
    } else {

      // load the html
      const $ = cheerio.load(body);

      // get the DJ name
      let title = $('h1[class=text-bold]');
      let dj = title['0'].children[0].data;

      // get the list of tracks
      let tracks = $('li[class=show]');
      let tracklist = [];
      for(let key of Object.keys(tracks)) {
        if(tracks[key].hasOwnProperty('attribs') && tracks[key].attribs.class === 'show') {
          tracklist.push(tracks[key].children[0].data);
        }
      }

      // send results to the client
      res.json({ dj, tracklist });

    }
  });
});

export default router;