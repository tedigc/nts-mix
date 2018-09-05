import cheerio from 'cheerio';
import request from 'request';

function fetchWebPage(url) {
  request.get(url, (err, response, body) => {
    if (err) {
      console.log('error');
    } else {
      console.log(body);
    }
  });
}

function scrapeHTML(html) {
  // load the html
  const $ = cheerio.load(html);

  // get the DJ name
  const djElement = $('h1[class=text-bold]');
  const dj = djElement['0'].children[0].data;

  // get the description
  const descriptionElement = $('div[class=description]');
  const description = descriptionElement['0'].children[1].children[0].data;

  // get the location
  const locationDateElement = $('div[class=bio__title__subtitle]');
  const location = locationDateElement['0'].children[1].children[0].data;

  // get the date
  const date = locationDateElement['0'].children[3].children[0].data;

  // get the list of tracks
  let tracklistElement = $('li[class=show]');
  let tracklist = [];
  for(let key of Object.keys(tracklistElement)) {
    if(tracklistElement[key].hasOwnProperty('attribs') && tracklistElement[key].attribs.class === 'show') {
      tracklist.push(tracklistElement[key].children[0].data);
    }
  }

  return { dj, description, location, date, tracklist };
}

export { fetchWebPage, scrapeHTML };
