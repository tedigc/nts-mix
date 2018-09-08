import express from 'express';
import request from 'request';
import cheerio from 'cheerio';

const router = express.Router();

/**
 * Submit a URL for an NTS show, and webscrape to find the tracklist.
 */
router.post('/tracklist', (req, res) => {
  // Check the URL to search isn't empty
  if (req.body.url.length === 0) {
    res.status(400).json({ message: 'Paste the URL of an NTS mix in the search box above.' });
    return;
  }
  // Scrape the HTML from the URL
  request.get(req.body.url, (err, response, body) => {
    if (err) {
      console.error(err);
      res.status(500).json(err);
    } else {
      // Scrape html for mix details
      const $ = cheerio.load(body);

      // Read dj, description, and location/date
      const dj = $('.bio__title div h1.text-bold').text().trim();
      const description = $('div.description h3').text().trim();
      const locationDate = $('div.bio__title__subtitle').text().trim();

      // Handle invalid mix
      if (dj.length === 0) {
        res.status(404).json({ message: "We couldn't find an NTS mix at that URL." });
        return;
      }

      const tracklist = $('ul.shows.tracks li').map((index, track) => {
        // There may be multiple featuring artists
        const artist = $(track).find('span.track__artist').map((i, item) => $(item).text().trim())
          .get()
          .join(' ');
        const title = $(track).find('span.track__title').text().trim();
        return { artist, title };
      }).get();

      // Send results to the client.
      res.json({ dj, description, locationDate, tracklist });
    }
  });
});

export default router;
