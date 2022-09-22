import { Filter, FilterCategory } from "./utils/CommonFilterTypes"

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
  filters: Filter[]
  categories: FilterCategory[]
  mediaType: FilterRequest["mediaType"]
  offset: number
  movieTitle: string
}

export const DefaultFilterData: FilterData = {
  filters: [],
  categories: [],
  mediaType: "MOVIE",
  offset: 0,
  movieTitle: "",
}

export enum FilterSource {
  CLEARPLAY = "Clearplay",
  VIDANGEL = "VidAngel",
}
