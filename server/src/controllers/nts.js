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
      console.err(err);
      res.status(500).json(err);
    } else {
      // Scrape html for mix details
      const $ = cheerio.load(body);

      // Read dj, description, and location/date
      const dj = $('.bio__title div h1.text-bold').text().trim();
      const description = $('div.description h3').text().trim();
      const locationDate = $('div.bio__title__subtitle').text().trim();

      // Scrape track details
      const tracklist = $('ul.shows.tracks li').map((id, track) => {
        const artist = $(track).find('span.track__artist').text().trim();
        const title = $(track).find('span.track__title').text().trim();
        return { artist, title };
      }).get();

      // Send results to the client.
      res.json({ dj, description, locationDate, tracklist });
    }
  });
});

export default router;