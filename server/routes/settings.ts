import { Express } from "express"
import fs from "fs"

export interface Settings {
  root?: string
  movies?: string
  tv?: string
  downloads?: string
  unfiltered?: string
  filtered?: string
}

const settingsFile = "filter-app-settings.json"

const readSettings = (): Settings => {
  let settings: Settings = {}
  try {
    settings = JSON.parse(fs.readFileSync(settingsFile, "utf8"))
  } catch (e) {
    console.warn("Failed to read settings file: ", e)
  }

  return settings
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


  app.get("/settings", (req, res) => res.send(readSettings()))

  app.post("/settings", (req, res) => {
    const newSettings: Settings = { ...readSettings(), ...req.body }

    res.send(writeSettings(newSettings) ? 'Wrote Settings' : 'Failed to write settings')
  })

}
