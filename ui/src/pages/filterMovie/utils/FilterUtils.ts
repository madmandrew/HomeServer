import {
  Category,
  ClearplayCategories,
  ClearplayToVideoSkipCategoryMap,
  Filter,
  FilterSettings,
  Incident,
} from "./FilterTypes"
import { uniqWith } from "lodash"

export type FilterOption = {
  selected: boolean
  incident: Incident
}

export interface ClearplayFilterGroup {
  category: Category
  filters: FilterOption[]
}

export const formatFilterSettings = (filterSettings: FilterSettings): ClearplayFilterGroup[] => {
  return filterSettings.filterSettingsUI.category.map((category) => ({
    category,
    filters: uniqWith(
      category.subcategory
        .filter((subcategory) => subcategory.incident != null)
        .flatMap((subCategory) =>
          subCategory.incident!.map((incident) => ({
            incident: incident,
            selected: true,
          }))
        ),
      (a, b) => a.incident.id === b.incident.id
    ),
  }))
}

const convertToTimestamp = (tsInSeconds: number): string => {
  return new Date(tsInSeconds * 1000).toISOString().slice(11, 22)
}

export const convertToVideoSkip = (
  formattedFilters: ClearplayFilterGroup[],
  filters: Filter,
  offset: number
): string => {
  const newFilters: string[] = []

  formattedFilters
    .map((filterGroup) => ({
      category: filterGroup.category,
      filters: filterGroup.filters.filter((filter) => filter.selected),
    }))
    .filter((filterGroup) => filterGroup.filters.length > 0)
    .forEach((filterGroup) =>
      filterGroup.filters.forEach((incident) => {
        const filter = filters.eventList.find((filter) => filter.id === incident.incident.id)

        if (filter) {
          const filterType = ClearplayToVideoSkipCategoryMap[filterGroup.category.desc]
          newFilters.push(
            `${convertToTimestamp(filter.interrupt + offset)} --> ${convertToTimestamp(filter.resume + offset)}` +
              `\n${filterType} 1 (${incident.incident.context})\n`
          )
        }
      })
    )

  return newFilters.join("\n")
}

export const convertToEDLFormat = (
  formattedFilters: ClearplayFilterGroup[],
  filters: Filter,
  offset: number
): string => {
  const newFilters: string[] = []

  formattedFilters
    .map((filterGroup) => ({
      category: filterGroup.category,
      filters: filterGroup.filters.filter((filter) => filter.selected),
    }))
    .filter((filterGroup) => filterGroup.filters.length > 0)
    .forEach((filterGroup) =>
      filterGroup.filters.forEach((incident) => {
        const filter = filters.eventList.find((filter) => filter.id === incident.incident.id)

        if (filter) {
          const filterType = filterGroup.category.desc === ClearplayCategories.LANGUAGE ? 1 : 0
          newFilters.push(`${filter.interrupt + offset} ${filter.resume + offset} ${filterType}`)
        }
      })
    )

  return newFilters.join("\n")
}

// ts format beg/end   123,123
const MOVIE_AUDIO_FILTER_COMMAND = (ts: string) => {
  return `between(t,${ts})`
}
const MOVIE_VIDEO_FILTER_COMMAND = (ts: string) => {
  return `not(between(t,${ts}))`
}

const buildConvertedFileName = (fileAndPath: string) => {
  const parts = fileAndPath.split(".")
  return parts.slice(0, -1).join(".") + "-converted." + parts.slice(-1)
}

export const convertToFFMpegCommand = (
  formattedFilters: ClearplayFilterGroup[],
  filters: Filter,
  offset: number,
  fileAndPath: string
): string => {
  const movieLocation = fileAndPath
  const movieDest = buildConvertedFileName(fileAndPath)
  const videoCuts: string[] = []
  const videoMutes: string[] = []

  formattedFilters
    .map((filterGroup) => ({
      category: filterGroup.category,
      filters: filterGroup.filters.filter((filter) => filter.selected),
    }))
    .filter((filterGroup) => filterGroup.filters.length > 0)
    .forEach((filterGroup) =>
      filterGroup.filters.forEach((incident) => {
        const filter = filters.eventList.find((filter) => filter.id === incident.incident.id)

        if (filter) {
          if (filterGroup.category.desc === ClearplayCategories.LANGUAGE) {
            videoMutes.push(MOVIE_AUDIO_FILTER_COMMAND(filter.interrupt + offset + "," + (filter.resume + offset)))
          } else {
            videoCuts.push(MOVIE_VIDEO_FILTER_COMMAND(filter.interrupt + offset + "," + (filter.resume + offset)))
          }
        }
      })
    )

  if (videoCuts.length === 0) {
    return `ffmpeg -y -i "${movieLocation}" -v error -c:v copy -af "volume=enable='${videoMutes.join(
      "+"
    )}':volume=0" -c:a aac "${movieDest}"`
  } else if (videoMutes.length === 0) {
    return (
      `ffmpeg -y -i "${movieLocation}" -v error -vf "select='${videoCuts.join("*")}',` +
      `setpts=N/FRAME_RATE/TB" -af "aselect='${videoCuts.join("*")}',asetpts=N/SR/TB" -c:a aac "${movieDest}"`
    )
  }

  return (
    `ffmpeg -y -i "${movieLocation}" -v error -vf "select='${videoCuts.join("*")}',` +
    `setpts=N/FRAME_RATE/TB" -af "volume=enable='${videoMutes.join("+")}':volume=0,aselect='${videoCuts.join(
      "*"
    )}',asetpts=N/SR/TB" -c:a aac "${movieDest}"`
  )
}
