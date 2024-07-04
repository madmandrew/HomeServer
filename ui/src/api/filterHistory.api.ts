import axios from "axios"
import { API_ROUTES } from "../utils/AppConstants"
import {FilterData} from "../shared-types/filterData";

export const FilterHistoryApi = {
  getFilterHistory: async (): Promise<FilterData[]> => {
    return (await axios.get(API_ROUTES.filterHistory)).data
  },
  addFilterHistory: async (filterData: FilterData): Promise<boolean> => {
    return (await axios.post(API_ROUTES.filterHistory, filterData)).data
  },
  deleteFilterHistory: async (movieTitle: string): Promise<FilterData[]> => {
    return (await axios.delete(API_ROUTES.filterHistory + `/${movieTitle}`)).data
  }
}
