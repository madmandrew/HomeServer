import { ClearplayFilterGroup } from "./utils/FilterUtils"

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
  clearplayFilter: {
    filterSettings: string
    filter: string
  }
  mediaType: FilterRequest["mediaType"]
  offset: number
  formattedFilterSelections: ClearplayFilterGroup[]
  filterMovieParams: FilterMovieParams
}
