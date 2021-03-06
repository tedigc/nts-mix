/* global gapi */
import config from '../config';

let GoogleAuth;
const SCOPE = 'https://www.googleapis.com/auth/youtube';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];

//
// Initialise the API client
//
// 'setAuth' is a callback function used to set
// authorisation state within a react context
//
export const initClient = setAuth => {
  gapi.client
    .init({
      apiKey: config.apiKey,
      clientId: config.clientId,
      scope: SCOPE,
      discoveryDocs: DISCOVERY_DOCS
    })
    .then(() => {
      GoogleAuth = gapi.auth2.getAuthInstance();
      GoogleAuth.isSignedIn.listen(isAuthorized => setAuth(isAuthorized));
      const user = GoogleAuth.currentUser.get();
      const isAuthorized = user.hasGrantedScopes(SCOPE);
      setAuth(isAuthorized);
    })
    .catch(error => {
      console.log(error);
    });
};

export const logInOut = () => {
  if (GoogleAuth.isSignedIn.get()) {
    GoogleAuth.signOut();
  } else {
    GoogleAuth.signIn();
  }
};
