import express from 'express';
import request from 'request';
import cheerio from 'cheerio';

const router = express.Router();

/**
 * Submit a URL for an NTS show, and webscrape to find the tracklist.
 */
router.post('/tracklist', (req, res) => {
  request.get(req.body.url, (err, response, body) => {
    if (err) {
      console.log('error');
      res.status(500).json(err);
    } else {
      // Load the html.
      const $ = cheerio.load(body);

      // Get the DJ name.
      const djElement = $('h1[class=text-bold]');
      const dj = djElement['0'].children[0].data;

      // Get the description.
      const descriptionElement = $('div[class=description]');
      const description = descriptionElement['0'].children[1].children[0].data;

      // Get the location.
      const locationDateElement = $('div[class=bio__title__subtitle]');
      console.log(locationDateElement);
      const location = locationDateElement['0'].children[1].children[0].data;

      // Get the date.
      const date = locationDateElement['0'].children[3].children[0].data;

      // Get the list of tracks.
      const tracklistElement = $('li[class=show]');
      console.log(tracklistElement);
      // const tracklist = Object.values(tracklistElement).map((obj) => {
      //   if (this.hasOwnProperty('attribs') && obj.attribs.class === 'show') {
      //     return obj.children[0].data;
      //   }
      // });

      let tracklist = [];
      for (let key of Object.keys(tracklistElement)) {
        if(tracklistElement[key].hasOwnProperty('attribs') && tracklistElement[key].attribs.class === 'show') {
          tracklist.push(tracklistElement[key].children[0].data);
        }
      }

      // Send results to the client.
      res.json({
        dj,
        description,
        location,
        date,
        tracklist,
      });
    }
  });
});

export default router;
