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
      let djElement = $('h1[class=text-bold]');
      let dj = djElement['0'].children[0].data;

      // get the description
      let descriptionElement = $('div[class=description]');
      let description = descriptionElement['0'].children[1].children[0].data;

      // get the location
      let locationDateElement = $('div[class=bio__title__subtitle]');
      let location = locationDateElement['0'].children[1].children[0].data;

      // get the date
      let date = locationDateElement['0'].children[3].children[0].data;

      // get the list of tracks
      let tracklistElement = $('li[class=show]');
      let tracklist = [];
      for(let key of Object.keys(tracklistElement)) {
        if(tracklistElement[key].hasOwnProperty('attribs') && tracklistElement[key].attribs.class === 'show') {
          tracklist.push(tracklistElement[key].children[0].data);
        }
      }

      // send results to the client
      res.json({ dj, description, location, date, tracklist });

    }
  });
});

export default router;