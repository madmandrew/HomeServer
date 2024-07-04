import { DefaultFilterData, FilterRequest } from "./FilterMovie.type"
import React, { ChangeEvent, useEffect, useState } from "react"
import { FilterStorageUtil } from "../../utils/FilterStorage.util"
import { fetchAndConvertVidAngelFilters } from "./utils/VidAngelUtils"
import { fetchAndConvertClearplayFilters } from "./utils/ClearplayUtils"
import {Filter, FilterCategory, FilterData, FiltersGrouped, FilterSource} from "../../shared-types/filterData";


export function formatFiltersGrouped(filters: Filter[], categories: FilterCategory[]): FiltersGrouped[] {
  if (categories == null || categories.length <= 0 || filters == null || filters.length <= 0) {
    return []
  }

  const filtersGroupedLookup: { [categoryId: number]: FiltersGrouped } = {}
  categories.forEach((category) => {
    filtersGroupedLookup[category.id] = {
      category,
      filters: {},
    }
  })

  filters.forEach((filter) => {
    const group = filtersGroupedLookup[filter.categoryId]
    if (group == null) {
      console.warn("Couldn't Find Group for filter", filter)
      return
    }
    group.filters[filter.description] = [...(group.filters[filter.description] ?? []), filter]
  })

  return Object.values(filtersGroupedLookup)
}

export const updateFiltersInFilterData = (filterData: FilterData, updatedFilters: Filter[]) => {
  const filterLookup: { [id: string]: Filter } = {}
  updatedFilters.forEach((filter) => (filterLookup[filter.id] = filter))

  const newFilters = filterData.filters.map((filter) =>
      filterLookup[filter.id] == null ? filter : filterLookup[filter.id]
  )

  return {
    ...filterData,
    filters: newFilters,
  }
}

export function useFilterFormData(movieTitle: string) {
  const [filterData, setFilterData] = useState<FilterData>(DefaultFilterData)

  //Load saved data if possible
  useEffect(() => {
    const filterData = FilterStorageUtil.getFilter(movieTitle)
    if (filterData) {
      setFilterData(filterData)
    }
  }, [movieTitle])

  //Save filter data to local storage
  useEffect(() => {
    if (JSON.stringify(filterData) !== JSON.stringify(DefaultFilterData)) {
      FilterStorageUtil.saveFilter({
        ...filterData,
        movieTitle: movieTitle,
      })
    }
  }, [filterData, movieTitle])

  const handleMovieUrl = async (e: ChangeEvent<HTMLInputElement>) => {
    const movieUrl: string = e.target.value

    if (movieUrl == null || movieUrl === "") {
      return
    }

    const newFilterData = await (filterData.filterSource === FilterSource.VIDANGEL
      ? fetchAndConvertVidAngelFilters(movieUrl)
      : fetchAndConvertClearplayFilters(movieUrl))

    if (newFilterData != null) {
      setFilterData({
        ...filterData,
        filters: newFilterData.filters,
        categories: newFilterData.categories,
        filterUrl: movieUrl,
      })
    } else {
      console.warn("Failed to fetch filters")
      setFilterData({
        ...filterData,
        filterUrl: movieUrl,
      })
    }
  }
  const handleOffsetChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilterData({
      ...filterData,
      offset: Number(e.target.value),
    })
  }

  const handleMediaTypeChange = (e: React.MouseEvent<HTMLElement>, newValue: FilterRequest["mediaType"]) => {
    setFilterData({
      ...filterData,
      mediaType: newValue,
    })
  }

  const handleFilterSourceChange = (newSource: FilterSource) => {
    setFilterData({
      ...filterData,
      filterSource: newSource,
    })
  }

  return {
    filterData,
    handlers: {
      setFilterData,
      handleMovieUrl,
      handleOffsetChange,
      handleMediaTypeChange,
      handleFilterSourceChange,
    },
  }
}
