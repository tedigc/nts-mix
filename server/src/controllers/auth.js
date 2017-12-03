import express from 'express';
import auth from '../auth';
import { SCOPES } from '../auth';

let router = express.Router();

/**
 * Generate a Google authentication URL and send it to the user
 */
router.get('/code', (req, res) => {
  console.log(SCOPES);
  let authURL = auth.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  res.json({ url : authURL });
});

/**
 * Exchange an authentication code for a valid access_token
 */
router.post('/token', (req, res) => {
  let authCode = req.body.authCode;
  auth.getToken(authCode, (err, token) => {
    if(err) {
      console.log(err);
      res.status(500).json(err);
    } else {
      res.json(token);
    }
  });
});

export default router;