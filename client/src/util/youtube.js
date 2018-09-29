/* global gapi */
const DO_NOT_DELETE = ['PLQ3YpXF4Wmw-KCQdRuG95gAQqEl_Y7C5d', 'PLQ3YpXF4Wmw8jQkdCTowULP-pmUGMP590']; // Playlist ID. doesn't really matter if this goes public.
const has = Object.prototype.hasOwnProperty;

/**
 * Search for a video
 */
async function searchForVideo(searchQuery) {
  const parameters = {
    part: 'snippet',
    maxResults: 5,
    order: 'relevance',
    q: searchQuery,
  };
  return new Promise((resolve) => {
    const request = gapi.client.youtube.search.list(parameters);
    request.execute((response) => {
      // if (response.items.length === 0) reject(new Error('No results found'));
      resolve(response);
    });
  });
}

/**
 * Add a single video to a playlist
 */
async function addVideoToPlaylist(playlistId, videoId) {
  const parameters = {
    part: 'snippet',
    snippet: {
      playlistId,
      resourceId: {
        kind: 'youtube#video',
        videoId,
      },
    },
  };
  return new Promise((resolve) => {
    const request = gapi.client.youtube.playlistItems.insert(parameters);
    request.execute((response) => {
      // TODO handle errors here
      resolve(response);
    });
  });
}

/**
 * Creates a new playlist with a given title and description
 */
async function createPlaylist(title, description) {
  // Set up request parameters
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
  return new Promise((resolve, reject) => {
    request.execute((response) => {
      if (response && has.call(response, 'error')) {
        reject(response.error);
      }
      resolve(response);
    });
  });
}

/**
 * - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
 * TODO delete everything below. These were used for development
 */

/**
 *  Lists all of a user's playlists
 */
function listPlaylists() {
  const parameters = {
    part: 'snippet',
    mine: true,
    maxResults: 50,
  };

  const request = gapi.client.youtube.playlists.list(parameters);
  request.execute((response) => {
    console.log();
    console.log('Playlists:');
    response.items.forEach((playlist) => {
      console.log(`  ${playlist.snippet.title} ... ${playlist.id}`);
    });
    console.log();
  });
}

/**
 * Delete all the videos from a given playlist
 */
async function clearPlaylist(playlistId) {
  const parameters = {
    playlistId,
    part: 'snippet',
    maxResults: 50,
  };
  console.log();
  console.log(`Clearing playlist ${playlistId}`);
  const listRequest = gapi.client.youtube.playlistItems.list(parameters);
  listRequest.execute((response) => {
    let sequence = Promise.resolve();
    response.items.forEach((video) => {
      sequence = sequence.then(() =>
        new Promise((resolve) => {
          const delParameters = { id: video.id };
          const delRequest = gapi.client.youtube.playlistItems.delete(delParameters);
          delRequest.execute(() => {
            console.log(`  Successfully deleted ${video.snippet.title}`);
            resolve();
          });
        }));
    });
  });
}

/**
 * Delete the playlist with the given ID
 */
function deletePlaylist(playlistId) {
  const request = gapi.client.youtube.playlists.delete({ id: playlistId });
  request.execute((res) => {
    console.log(res);
  });
}

/**
 * Deletes all playlists, except for those found in the DO_NOT_DELETE array
 */
function deleteAllPlaylists() {
  const parameters = {
    part: 'snippet',
    mine: true,
    maxResults: 50,
  };

  const request = gapi.client.youtube.playlists.list(parameters);
  request.execute((res) => {
    console.log();
    console.log('Deleting playlists:');
    res.items.forEach((playlist) => {
      if (DO_NOT_DELETE.indexOf(playlist.id) < 0) {
        console.log(`  Deleting '${playlist.snippet.title}' - ${playlist.id}`);
        deletePlaylist(playlist.id);
      }
    });
    console.log();
  });
}

export default {
  searchForVideo,
  addVideoToPlaylist,
  createPlaylist,
  listPlaylists,
  clearPlaylist,
  deletePlaylist,
  deleteAllPlaylists,
};
