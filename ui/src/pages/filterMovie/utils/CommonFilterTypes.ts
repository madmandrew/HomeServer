export enum FilterType {
  AUDIO,
  VISUAL,
}

export interface Filter {
  id: string
  description: string
  start: number
  resume: number
  type: FilterType
  categoryId: number
  selected: boolean
}

export interface FilterCategory {
  id: number
  description: string
}

export interface FiltersGrouped {
  category: FilterCategory
  filters: { [description: string]: Filter[] }
}
