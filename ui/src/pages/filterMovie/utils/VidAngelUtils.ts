import axios from "axios"
import { VidAngelBaseResponse, VidAngelCategory, VidAngelFilter, VidAngelMovieTitle } from "./VidangelTypes"
import { Filter, FilterCategory, FilterType } from "./CommonFilterTypes"
import { v4 as uuidv4 } from "uuid"

async function fetchVidAngelFilterData(
  movieUrl: string
): Promise<{ filterData: VidAngelFilter; filterCategories: VidAngelCategory[] } | null> {
  const movieTitle = movieUrl.split("?")[0].split("/").splice(-1)

  const movieDataResponse: VidAngelBaseResponse<VidAngelMovieTitle> = (
    await axios.get(`https://api.vidangel.com/api/content/v2/movies/?slug=${movieTitle}`)
  ).data

  if (movieDataResponse.results.length > 0 && movieDataResponse.results[0].offerings.length > 0) {
    const movieData = movieDataResponse.results[0]
    const movieFilterId = movieData.offerings[0].tag_set_id

    const filterData: VidAngelFilter = (await axios.get(`https://api.vidangel.com/api/tag-sets/${movieFilterId}`)).data

    const filterCategories: VidAngelBaseResponse<VidAngelCategory> = (
      await axios.get("https://api.vidangel.com/api/tag-categorizations/")
    ).data

    if (filterData.tags.length !== movieData.tagCount) {
      console.warn("Tag lengths don't match")
    }

    return {
      filterData: filterData,
      filterCategories: filterCategories.results,
    }
  }

  return null
}

function getParentCategory(
  categoryLookup: { [categoryId: string]: VidAngelCategory },
  categoryId: number,
  description?: string[]
): { category: VidAngelCategory; description?: string[] } {
  const category = categoryLookup[categoryId]
  return category.parent_id
    ? getParentCategory(categoryLookup, category.parent_id, [...(description ?? []), category.display_title])
    : { category, description }
}

function convertVidAngelFilterData(filterData: VidAngelFilter, filterCategories: VidAngelCategory[]) {
  const categories: FilterCategory[] = []
  const categoryLookup: { [categoryId: string]: VidAngelCategory } = {}
  filterCategories.forEach((category) => {
    categoryLookup[category.id] = category

    if (category.parent_id == null) {
      categories.push({
        id: category.id,
        description: category.display_title,
      })
    }
  })

  const filters: Filter[] = []

  filterData.tags.forEach((tag) => {
    const { category, description } = getParentCategory(categoryLookup, tag.category_id)
    const moreDescription = description != null ? ` (${description.join("/")})` : ""
    filters.push({
      id: uuidv4(),
      description: tag.description + moreDescription,
      start: tag.start_approx,
      resume: tag.end_approx === tag.start_approx ? tag.start_approx + 1 : tag.end_approx,
      type: tag.type === "audio" ? FilterType.AUDIO : FilterType.VISUAL,
      categoryId: category.id,
      selected: false,
    })
  })

  return {
    filters,
    categories,
  }
}

export async function fetchAndConvertVidAngelFilters(
  movieUrl: string
): Promise<{ filters: Filter[]; categories: FilterCategory[] } | null> {
  const data = await fetchVidAngelFilterData(movieUrl)
  if (data != null) {
    return convertVidAngelFilterData(data.filterData, data.filterCategories)
  }
  return null
}
