import dotenv from "dotenv"

dotenv.config()

export const BASE_PLEX_DIR = (process.env.BASE_FILEPATH ?? "") + (process.env.PLEX_DIRECTORY ?? "")
export const PLEX_MOVIE_DIR = BASE_PLEX_DIR + "/movies/"
export const PLEX_TV_DIR = BASE_PLEX_DIR + "/tv/"
export const PLEX_MOVIE_UNFILTERED_DEST = BASE_PLEX_DIR + "/unfiltered-archive/"
export const DOWNLOADS_DIR = (process.env.BASE_FILEPATH ?? "") + (process.env.DOWNLOADS_DIR ?? "") + "/"
