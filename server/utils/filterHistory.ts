import { FilterData } from "../../ui/src/shared-types/filterData"
import fs from "fs"
import {CONFIG_DIR} from "./app_constants.js";

const historyFile = `${CONFIG_DIR}/filter-app-history.json`
export const FilterHistoryUtil = {
  readHistory: async (): Promise<FilterData[]> => {
    let history: FilterData[] = []
    try {
      history = JSON.parse(fs.readFileSync(historyFile, "utf8"))
    } catch (e) {
      console.warn("Failed to read history file: ", e)
    }
    return history
  },
  writeHistory: async (newFilterData: FilterData) => {
    const history = await FilterHistoryUtil.readHistory()
    let newHistory = []
    if (history.find((f) => f.movieTitle === newFilterData.movieTitle)) {
      newHistory = history.map((f) => (f.movieTitle === newFilterData.movieTitle ? newFilterData : f))
    } else {
      newHistory = [...history, newFilterData]
    }

    try {
      fs.writeFileSync(historyFile, JSON.stringify(newHistory), "utf8")
      return true
    } catch (e) {
      console.error("Failed to write history", e)
    }
    return false
  },
  deleteHistory: async (movieTitle: string) => {
    const history = await FilterHistoryUtil.readHistory()
    const newHistory = history.filter((f) =>  f.movieTitle !== movieTitle)

    try {
      fs.writeFileSync(historyFile, JSON.stringify(newHistory), "utf8")
      return newHistory
    } catch (e) {
      console.error("Failed to delete history", e)
    }
    return []
  }
}
