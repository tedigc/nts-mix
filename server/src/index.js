import express from 'express';
import morgan from 'morgan';
import path from 'path';
import bodyParser from 'body-parser';
import request from 'request';
import nts from './util/nts';

const port = process.env.PORT || 8080;
const app = express();

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../../client/build')));
app.use(bodyParser.json());
app.use(morgan('dev'));

/**
 * Fetch the HTML from an NTS webpage, and scrape it for mix information
 */
app.post('/api/nts/tracklist', (req, res) => {
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
      const { dj, description, locationDate, tracklist } = nts.scrape(body);

      // // Handle invalid mix
      if (dj.length === 0) {
        res.status(404).json({ message: "We couldn't find an NTS mix at that URL." });
        return;
      }

      // Send info to client
      res.json({ dj, description, locationDate, tracklist });
    }
  });
});

/**
 * Serve up the client side application
 */
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../../client/build/index.html'));
});

// Set up server.
const server = app.listen(port, (err) => {
  if (err) {
    console.error(err);
  } else {
    const host = (server.address().address === '::') ? ('localhost') : (server.address().address);
    console.info('🌎  Server listening at http://%s:%s', host, port);
  }
});

export default app;
