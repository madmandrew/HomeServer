import axios from "axios"
import { API_ROUTES } from "../../../utils/AppConstants"
import { ClearplayCategories, ClearplayFilterCategories, ClearplayFilterData } from "./ClearplayTypes"
import { v4 as uuidv4 } from "uuid"
import {Filter, FilterCategory, FilterType} from "../../../shared-types/filterData";

async function fetchClearplayFilters(
  amazonUrl: string
): Promise<{ filterData: ClearplayFilterData; filterCategories: ClearplayFilterCategories } | null> {
  const movieId = amazonUrl.split("/").splice(-1)

  const filterSettingsResponse = await axios.post("https://filter.clearplay.com/v1/filterSettingsUI", {
    asset_id: movieId.toString(),
    platform_id: 7,
    format_id: 1,
    provider_id: 3,
    filter_settings_ui_type: "t1",
    dev_mode: false,
  })

  const filterResponse = await axios.get(API_ROUTES.clearplayFilter + movieId.toString())

  if (
    (filterSettingsResponse.data.responseMsg && filterSettingsResponse.data.responseMsg === "failure") ||
    (filterResponse.data.responseMsg && filterResponse.data.responseMsg === "failure")
  ) {
    return null
  }

  return {
    filterData: filterResponse.data,
    filterCategories: filterSettingsResponse.data,
  }
}

function convertClearplayToCommonFilter(
  clearplayFilterData: ClearplayFilterData,
  clearplayFilterCategories: ClearplayFilterCategories
) {
  const categories: FilterCategory[] = []
  const categoryLookup: {
    [categoryId: string]: { desc: string; parentId: number; category: ClearplayCategories }
  } = {}

  clearplayFilterCategories.filterSettingsUI.category.forEach((category) => {
    categories.push({
      id: category.id,
      description: category.desc,
    })

    category.subcategory.forEach((subCategory) => {
      subCategory.incident?.forEach((incident) => {
        categoryLookup[incident.id.toString()] = {
          desc: incident.context,
          parentId: category.id,
          category: category.desc,
        }
      })
    })
  })

  const filters: Filter[] = []

  clearplayFilterData.eventList.forEach((filter) => {
    const incident = categoryLookup[filter.id]
    filters.push({
      id: uuidv4(),
      description: incident.desc,
      start: filter.interrupt,
      resume: filter.resume,
      type: incident.category === ClearplayCategories.LANGUAGE ? FilterType.AUDIO : FilterType.VISUAL,
      categoryId: incident.parentId,
      selected: false,
    })
  })

  return {
    categories,
    filters,
  }
}

export async function fetchAndConvertClearplayFilters(
  movieUrl: string
): Promise<{ filters: Filter[]; categories: FilterCategory[] } | null> {
  const data = await fetchClearplayFilters(movieUrl)
  if (data != null) {
    return convertClearplayToCommonFilter(data.filterData, data.filterCategories)
  }
  return null
}
