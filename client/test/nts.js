process.env.NODE_ENV = 'test';

import cheerio from 'cheerio';
import chai from 'chai';
import fs   from 'fs';
import { fetchWebPage, scrapeHTML } from '../src/util/webscrape';

let expect = chai.expect;

const FILE_1_URL = '/pages/test_nts_0_valid_tracklist.html';
const FILE_2_URL = '/pages/test_nts_1_no_tracklist.html';

describe('NTS Web Scraping', () => {

  describe('Valid URL, tracklist provided', () => {
    it('Returns a DJ, description, location, date and tracklist for a valid NTS mix page with a provided tracklist', (done) => {

      // Load HTML and scrape for mix information.
      let file = fs.readFileSync(__dirname + FILE_1_URL);
      let mix = scrapeHTML(file);

      // Check assertions.
      expect(mix).to.be.an('object');
      expect(mix).to.have.property('dj');
      expect(mix).to.have.property('description');
      expect(mix).to.have.property('location');
      expect(mix).to.have.property('date');
      expect(mix).to.have.property('tracklist');
      expect(mix.tracklist).to.not.have.lengthOf(0);

      // Return successfully
      done();
      
    });
  });

  describe('Valid URL, tracklist not provided', () => {
    it('Returns a DJ, description, location, date, but NO tracklist for a valid NTS mix page with no provided tracklist', (done) => {

      // Load HTML and scrape for mix information.
      let file = fs.readFileSync(__dirname + FILE_2_URL);
      let mix = scrapeHTML(file);

      // Check assertions.
      expect(mix).to.be.an('object');
      expect(mix).to.have.property('dj');
      expect(mix).to.have.property('description');
      expect(mix).to.have.property('location');
      expect(mix).to.have.property('date');
      expect(mix).to.have.property('tracklist');
      expect(mix.tracklist).to.have.lengthOf(0);
      
      // Return successfully
      done();

    });
  });

  describe('Invalid URL', () => {
    it('Returns an error, with a message informing the user that the URL submitted does not lead to a valid NTS mix page', (done) => {

      // test here

      let URL = 'https://www.nts.live/';

      

      done();
    });
  });

});