import dotenv from "dotenv"

dotenv.config()

export const BASE_API_ROUTE = "/api"
export const BASE_PLEX_DIR = (process.env.BASE_FILEPATH ?? "") + (process.env.PLEX_DIRECTORY ?? "")
