export const baseUrl = process.env.REACT_APP_SERVER_URL
export const baseWebUrl = process.env.PUBLIC_URL

export const API_ROUTES = {
  toFilterFiles: baseUrl + "toFilter/files",
  toFilterFilter: baseUrl + "toFilter/filter",
  toFilterQueue: baseUrl + "toFilter/items",
  transmissionTorrents: baseUrl + "torrents",
  transmissionPause: baseUrl + "torrent/pause",
  transmissionResume: baseUrl + "torrent/resume",
  transmissionRemove: baseUrl + "torrent/remove",
  clearplayFilter: baseUrl + "clearplay/",
  fileNavList: baseUrl + "file/list",
  fileNavMove: baseUrl + "file/move",
  fileNavDelete: baseUrl + "file/delete",
  fileNavMkdir: baseUrl + "file/mkdir",
  fileNavDeleteDir: baseUrl + "file/delete/dir",
  settings: baseUrl + "settings",
}

export const PAGE_ROUTES = {
  home: baseWebUrl,
  filterMovie: baseWebUrl + "/filterMovie",
  toFilter: baseWebUrl + "/toFilter",
  move: baseWebUrl + "/move",
  settings: baseWebUrl + "/settings",
}
