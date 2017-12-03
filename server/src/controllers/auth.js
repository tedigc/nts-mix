import express from 'express';
import client_secret from '../client_secret.json';

// router
let router = express.Router();

// client information
let CLIENT_ID     = client_secret.web.client_id;
let CLIENT_SECRET = client_secret.web.client_secret;
let REDIRECT_URL  = client_secret.web.redirect_uris[0];
let SCOPES        = [ 'https://www.googleapis.com/auth/youtube' ];

router.get('/code', (req, res) => {

});

export default router;