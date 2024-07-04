import {FilterData, FilterSource, MediaType} from "../../shared-types/filterData";


export interface FilterMovieParams {
  baseDir: string
  movieTitle: string
}

export interface FilterRequest {
  filterCommand: string
  fileName: string
  mediaType: MediaType
}

export const DefaultFilterData: FilterData = {
  filters: [],
  filterSource: FilterSource.MANUAL,
  categories: [],
  mediaType: "MOVIE",
  offset: 0,
  movieTitle: "",
  filterUrl: "",
}
