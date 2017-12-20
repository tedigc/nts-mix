import cheerio from 'cheerio';
import request from 'request';

let fetchWebPage = function(url) {
  request.get(req.body.url, (err, response, body) => {
    if(err) {
      console.log("error");
    } else {
      
    }
  });
}

let scrapeHTML = function(html) {

  // load the html
  const $ = cheerio.load(html);

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

  return { dj, description, location, date, tracklist };
}

export { fetchWebPage, scrapeHTML };