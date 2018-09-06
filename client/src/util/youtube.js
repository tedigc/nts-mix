/* global gapi */
const has = Object.prototype.hasOwnProperty;

// Create a brand new playlist, and fill it with a collection of tracks based on IDs.
function createPlaylist(dj, description, locationDate) {
  return new Promise((resolve, reject) => {
    // Set up request parameters
    const title = `${dj} - ${locationDate} | NTS mix`;
    const parameters = {
      part: 'snippet, status',
      resource: {
        snippet: {
          title,
          description,
        },
        status: { privacyStatus: 'private' },
      },
    };

    // Execute request.
    const request = gapi.client.youtube.playlists.insert(parameters);
    request.execute((response) => {
      if (response && has.call(response, 'error')) {
        reject(response.error);
      }
      resolve(response);
    });
  });
}

function secondFunc() {

}

export { createPlaylist, secondFunc };
