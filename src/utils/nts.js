const prefix = 'https://www.nts.live/api/v2'

const search = async url => {
  const { pathname } = new URL(url)
  const target = `${prefix}${pathname}`
  return fetch(target)
    .then(data => data.json())
    .then(json => {
      const { name, description, location_long, broadcast, embeds } = json
      const { tracklist } = embeds

      const date = new Date(broadcast)
      const dateShort = date.toLocaleDateString('en-GB')
      const dateFormatted = dateShort.replace(/\//g, '.')

      return {
        name,
        description,
        date: dateFormatted,
        location: location_long,
        tracklist: tracklist.results
      }
    })
}

export default {
  search
}
