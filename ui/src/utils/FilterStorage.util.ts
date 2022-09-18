import { cloneDeep } from "lodash"
import { FilterData } from "../pages/filterMovie/FilterMovie.type"

const FILTER_STORAGE_KEY = "FILTER_STORAGE_KEY"

type FilterStorage = { [movieTitle: string]: FilterData }

class FilterStorageUtilClass {
  private filterStorage: FilterStorage = {}

  constructor() {
    this.load()
  }

  private load() {
    const filterString = localStorage.getItem(FILTER_STORAGE_KEY)
    if (filterString) {
      this.filterStorage = JSON.parse(filterString)
    }
  }

  saveFilter(storedFilter: FilterData) {
    this.filterStorage[storedFilter.movieTitle] = storedFilter
    localStorage.setItem(FILTER_STORAGE_KEY, JSON.stringify(this.filterStorage))
  }

  getFilter(movieTitle: string): FilterData | null {
    return cloneDeep(this.filterStorage[movieTitle])
  }
}

export const FilterStorageUtil = new FilterStorageUtilClass()
