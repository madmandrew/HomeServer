import { ClearplayCategory, ClearplayIncident, VideoSkipCategories } from "./ClearplayTypes"
import {Filter, FilterType} from "../../../shared-types/filterData";


export type FilterOption = {
  selected: boolean
  incident: ClearplayIncident
}

export interface ClearplayFilterGroup {
  category: ClearplayCategory
  filters: FilterOption[]
}

const convertToTimestamp = (tsInSeconds: number): string => {
  return new Date(tsInSeconds * 1000).toISOString().slice(11, 22)
}

export const convertToVideoSkip = (filters: Filter[], offset: number): string => {
  const newFilters: string[] = []

  filters
    .filter((filter) => filter.selected)
    .forEach((filter) => {
      const filterType = filter.type === FilterType.AUDIO ? VideoSkipCategories.PROFANITY : VideoSkipCategories.VIOLENCE
      newFilters.push(
        `${convertToTimestamp(filter.start + offset)} --> ${convertToTimestamp(filter.resume + offset)}` +
          `\n${filterType} 1 (${filter.description})\n`
      )
    })

  return newFilters.join("\n")
}

export const convertToEDLFormat = (filters: Filter[], offset: number): string => {
  const newFilters: string[] = []

  filters
    .filter((filter) => filter.selected)
    .forEach((filter) => {
      const filterType = filter.type === FilterType.AUDIO ? 1 : 0
      newFilters.push(`${filter.start + offset} ${filter.resume + offset} ${filterType}`)
    })

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

export const convertToFFMpegCommand = (filters: Filter[], offset: number, fileAndPath: string): string => {
  const movieLocation = fileAndPath
  const movieDest = buildConvertedFileName(fileAndPath)
  const videoCuts: string[] = []
  const videoMutes: string[] = []

  filters
    .filter((filter) => filter.selected)
    .forEach((filter) => {
      if (filter.type === FilterType.AUDIO) {
        videoMutes.push(MOVIE_AUDIO_FILTER_COMMAND(filter.start + offset + "," + (filter.resume + offset)))
      } else {
        videoCuts.push(MOVIE_VIDEO_FILTER_COMMAND(filter.start + offset + "," + (filter.resume + offset)))
      }
    })

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
