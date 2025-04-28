export function toSpotifyEmbed(url) {
    try {
      const u = new URL(url)
      const [, type, id] = u.pathname.split('/')  // ["", "track", "5eW5…"]
      if (['track','album','playlist'].includes(type) && id) {
        return `https://open.spotify.com/embed/${type}/${id}`
      }
    } catch (e) {
    }
    // if it didn’t match, just return the original
    return url
  }