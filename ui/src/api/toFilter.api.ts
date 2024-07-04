import axios from "axios"
import { API_ROUTES } from "../utils/AppConstants"
import { FilterRequest } from "../pages/filterMovie/FilterMovie.type"

export const ToFilterApi = {
  toFilterFiles: async () => {
    return (await axios.get(API_ROUTES.toFilterFiles)).data
  },
  filterMovie: async (filterRequest: FilterRequest) => {
    await axios.post(API_ROUTES.toFilterFilter, filterRequest)
  },
}
