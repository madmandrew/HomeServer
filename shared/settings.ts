import { BASE_PLEX_DIR } from "../server/utils/app_constants"

export interface Settings {
  root?: string
  movies?: string
  tv?: string
  downloads?: string
  unfiltered?: string
  filtered?: string
}