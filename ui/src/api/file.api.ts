import axios from "axios"
import { API_ROUTES } from "../utils/AppConstants"
import { AppFile } from "../pages/move/Move"

export const FileApi = {
  fetchFiles: async (path: string) => {
    const response = (await axios.get(API_ROUTES.fileNavList, { params: { path } })).data

    if (typeof response === "string") {
      return undefined
    }
    return response as AppFile[]
  },
}
