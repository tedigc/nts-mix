import cheerio from 'cheerio';

/**
 * Scrape a webpage in search of a DJ name, description, location, date, and tracklist
 */
function scrape(html) {
  const $ = cheerio.load(html);

  // Read dj, description, and location/date
  const dj = $('.bio__title div h1.text-bold').text().trim();
  const description = $('div.description h3').text().trim();
  const locationDate = $('div.bio__title__subtitle').text().trim();

  // Find the track and artists for each track
  const tracklist = $('ul.shows.tracks li').map((index, track) => {
    // There may be multiple featuring artists
    const artist = $(track).find('span.track__artist').map((i, item) => $(item).text().trim())
      .get()
      .join(' ');
    const title = $(track).find('span.track__title').text().trim();
    return { artist, title };
  }).get();

  return { dj, description, locationDate, tracklist };
}

export default { scrape };
