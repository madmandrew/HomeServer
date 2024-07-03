import { Settings } from "../../shared/settings.js"
import fs from "fs"
import { BASE_PLEX_DIR } from "./app_constants.js"

const defaultSettings: Settings = {
  root: BASE_PLEX_DIR,
  movies: "/movies/",
  tv: "/tv/",
  unfiltered: "/unfiltered-archive/",
  filtered: "/filtered/",
  downloads: "/downloads/",
}

const settingsFile = "filter-app-settings.json"
const readSettings = (): Settings => {
  let settings: Settings = {} as any
  try {
    settings = JSON.parse(fs.readFileSync(settingsFile, "utf8"))
  } catch (e) {
    console.warn("Failed to read settings file: ", e)
  }

  return { ...defaultSettings, ...settings }
}

const writeSettings = (newSettings: Settings) => {
  try {
    fs.writeFileSync(settingsFile, JSON.stringify(newSettings), "utf8")
    return true
  } catch (e) {
    console.error("Failed to write settings", e)
  }
  return false
}
export class SettingsCacheClass {
  settings: Settings = { ...defaultSettings }

  constructor() {
    this.settings = readSettings()
  }

  updateSettings(newSettings: Settings) {
    this.settings = { ...newSettings }
    return writeSettings(newSettings)
  }

  getSettings(): Settings {
    return { ...this.settings }
  }
}

export type SettingsCacheType = SettingsCacheClass
