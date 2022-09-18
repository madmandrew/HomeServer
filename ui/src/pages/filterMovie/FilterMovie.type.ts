import { ClearplayFilterGroup } from "./utils/FilterUtils"
import { Filter } from "./utils/FilterTypes"

export interface FilterMovieParams {
  baseDir: string
  movieTitle: string
}

export interface FilterRequest {
  filterCommand: string
  fileName: string
  mediaType: "MOVIE" | "TV"
}

export interface FilterData {
  filterSettings: string
  formattedFilterSettings: ClearplayFilterGroup[]
  filter: string
  formattedFilter: Filter
  mediaType: FilterRequest["mediaType"]
  offset: number
  movieTitle: string
}

export const DefaultFilterData: FilterData = {
  mediaType: "MOVIE",
  offset: 0,
  filterSettings: "",
  formattedFilterSettings: [],
  filter: "",
  formattedFilter: { eventList: [] },
  movieTitle: "",
}
