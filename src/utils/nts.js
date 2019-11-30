const prefix = 'https://www.nts.live/api/v2/shows';

export default async (artist, episode) => {
  const target = `${prefix}/${artist}/episodes/${episode}`;
  return fetch(target)
    .then(data => data.json())
    .then(json => {
      const { name, description, location_long, broadcast, embeds } = json;
      const { tracklist } = embeds;

      const date = new Date(broadcast);
      const dateShort = date.toLocaleDateString('en-GB');
      const dateFormatted = dateShort.replace(/\//g, '.');

      return {
        name,
        description,
        date: dateFormatted,
        location: location_long,
        tracklist: tracklist.results
      };
    });
};
