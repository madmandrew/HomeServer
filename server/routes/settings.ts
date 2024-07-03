import { Express } from "express"
import fs from "fs"
import { BASE_PLEX_DIR } from "../utils/app_constants"
import { Settings } from "../../shared/settings"
import { logger } from "../utils/logger"

const settingsFile = "filter-app-settings.json"

const defaultSettings: Settings = {
  root: BASE_PLEX_DIR,
  movies: "/movies/",
  tv: "/tv/",
  unfiltered: "/unfiltered-archive/",
  filtered: "/filtered/",
  downloads: "/downloads/"
}
const readSettings = (): Settings => {
  let settings: Settings = {}
  try {
    settings = JSON.parse(fs.readFileSync(settingsFile, "utf8"))

  } catch (e) {
    console.warn("Failed to read settings file: ", e)
  }

  return {...defaultSettings, ...settings}
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

export function settingsRoutes(app: Express) {
  logger.log({
    level: 'info',
    message: "TESTING"
  })
  app.get("/settings", (req, res) => res.send(readSettings()))

  app.post("/settings", (req, res) => {
    const newSettings: Settings = { ...readSettings(), ...req.body }

    res.send(writeSettings(newSettings) ? 'Wrote Settings' : 'Failed to write settings')
  })

}
