import axios from "axios"
import { API_ROUTES } from "../utils/AppConstants"

export const ToFilterApi = {
  toFilterFiles: async () => {
    return (await axios.get(API_ROUTES.toFilterFiles)).data
  },
}
