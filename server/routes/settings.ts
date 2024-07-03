import { Express } from "express"
import { Settings } from "../../shared/settings.js"
import { SettingsCacheType } from "../utils/settingsCache.js"
import { BASE_API_ROUTE } from "../utils/app_constants.js"

export function settingsRoutes(app: Express, settingsCache: SettingsCacheType) {
  app.get(`${BASE_API_ROUTE}/settings`, (req, res) => res.send(settingsCache.getSettings()))

  app.post(`${BASE_API_ROUTE}/settings`, (req, res) => {
    const newSettings: Settings = { ...settingsCache.getSettings(), ...req.body }

    res.send(settingsCache.updateSettings(newSettings) ? "Wrote Settings" : "Failed to write settings")
  })
}
