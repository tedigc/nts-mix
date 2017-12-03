import google     from 'googleapis';
import googleAuth from 'google-auth-library';
import client_secret from '../client_secret.json';

let CLIENT_ID     = client_secret.web.client_id;
let CLIENT_SECRET = client_secret.web.client_secret;
let REDIRECT_URI  = client_secret.web.redirect_uris[0];
let AUTH_URI      = client_secret.web.auth_uri;
let TOKEM_URI     = client_secret.web.token_uri;
let SCOPES        = [ 'https://www.googleapis.com/auth/youtube' ];

let auth = new googleAuth();
let oauth2Client = new auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

export { SCOPES };
export default oauth2Client;