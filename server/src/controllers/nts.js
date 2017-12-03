import express from 'express';
import request    from 'request';
import cheerio    from 'cheerio';
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

      const $ = cheerio.load(body);
      let element = $('.shows')['0'];
      let tracklist = [];

      for(let i=1; i<element.children.length; i+=2) {
        let trackTitle = element.children[i].children[0].data;
        tracklist.push(trackTitle);
      }

      res.status(200).json( { 
        success : true,
        tracklist 
      });  
    }
  });
});

export default router;