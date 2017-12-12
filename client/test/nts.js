process.env.NODE_ENV = 'test';

import chai from 'chai';

let expect = chai.expect;

describe('NTS Web Scraping', () => {

  describe('Valid URL, tracklist provided', () => {
    it('Returns a DJ, description, location, date and tracklist for a valid NTS mix page with a provided tracklist', (done) => {

      // test here

      done();
    });
  });

  describe('Valid URL, tracklist not provided', () => {
    it('Returns an error, with a message informing the user that the DJ has not provided a tracklist for this mix', (done) => {

      // test here

      done();
    });
  });

  describe('Invalid URL', () => {
    it('Returns an error, with a message informing the user that the URL submitted does not lead to a valid NTS mix page', (done) => {

      // test here

      done();
    });
  });

});