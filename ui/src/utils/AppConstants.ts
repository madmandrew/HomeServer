export const baseUrl = process.env.REACT_APP_SERVER_URL

export const API_ROUTES = {
  toFilterFiles: baseUrl + "toFilter/files",
  toFilterFilter: baseUrl + "toFilter/filter",
  toFilterQueue: baseUrl + "toFilter/items",
  transmissionTorrents: baseUrl + "torrents",
  transmissionPause: baseUrl + "torrent/pause",
  transmissionResume: baseUrl + "torrent/resume",
  transmissionRemove: baseUrl + "torrent/remove",
}

export const PAGE_ROUTES = {
  filterMovie: "/filterMovie",
  toFilter: "/toFilter",
}
