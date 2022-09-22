export interface ClearplayIncident {
  id: number
  context: string
  desc: string
}

export interface ClearplayCategory {
  id: number
  desc: ClearplayCategories
  subcategory: {
    id: number
    desc: string
    incident?: ClearplayIncident[]
  }[]
}

export interface ClearplayFilterCategories {
  asset: {
    name: string
    duration: string
  }
  filterSettingsUI: {
    category: ClearplayCategory[]
  }
}

export interface ClearplayFilterData {
  eventList: {
    id: number
    interrupt: number
    resume: number
  }[]
}

export enum ClearplayCategories {
  SEX_NUDITY = "Sex/Nudity",
  VIOLENCE = "Violence",
  LANGUAGE = "Language",
  SUBSTANCE_ABUSE = "Substance Abuse",
}

export enum VideoSkipCategories {
  SEX = "Sex",
  VIOLENCE = "Violence",
  PROFANITY = "Profane Word",
  ALCOHOL = "Alcohol",
  INTENSE = "Intense",
  OTHER = "Other",
}

export const ClearplayToVideoSkipCategoryMap = {
  [ClearplayCategories.SEX_NUDITY]: VideoSkipCategories.SEX,
  [ClearplayCategories.VIOLENCE]: VideoSkipCategories.VIOLENCE,
  [ClearplayCategories.LANGUAGE]: VideoSkipCategories.PROFANITY,
  [ClearplayCategories.SUBSTANCE_ABUSE]: VideoSkipCategories.ALCOHOL,
}
