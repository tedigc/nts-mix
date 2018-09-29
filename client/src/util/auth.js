/* global gapi */
import config from '../config';

const SCOPE = 'https://www.googleapis.com/auth/youtube';
const DISCOVERY_DOCS = ['https://www.googleapis.com/discovery/v1/apis/youtube/v3/rest'];
let GoogleAuth;

export function initClient(setAuth) {
  gapi.client.init({
    apiKey: config.apiKey,
    clientId: config.clientId,
    scope: SCOPE,
    discoveryDocs: DISCOVERY_DOCS,
  })
    .then(() => {
      GoogleAuth = gapi.auth2.getAuthInstance();
      GoogleAuth.isSignedIn.listen(isAuthorized => setAuth(isAuthorized));
      const user = GoogleAuth.currentUser.get();
      const isAuthorized = user.hasGrantedScopes(SCOPE);
      setAuth(isAuthorized);
    })
    .catch((error) => {
      console.log(error);
    });
}

// Log in or out.
export function logInOut() {
  if (GoogleAuth.isSignedIn.get()) {
    GoogleAuth.signOut();
  } else {
    GoogleAuth.signIn();
  }
}
