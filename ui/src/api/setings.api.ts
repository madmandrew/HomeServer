import { Settings } from "../../../shared/settings"
import axios from "axios"
import { API_ROUTES } from "../utils/AppConstants"

export const fetchSettings = async () => {
  return (await axios.get(API_ROUTES.settings)).data as Settings
}

export const updateSettings = async (settings: Settings) => {
  return ((await axios.post(API_ROUTES.settings, settings)).data as string) === "Wrote Settings"
}
