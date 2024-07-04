export type MediaType = "MOVIE" | "TV";
export enum FilterType
{
  AUDIO,
  VISUAL,
}

export interface Filter
{
  id: string
  description: string
  start: number
  resume: number
  type: FilterType
  categoryId: number
  selected: boolean
}

export interface FilterCategory
{
  id: number
  description: string
}

export interface FiltersGrouped
{
  category: FilterCategory
  filters: { [description: string]: Filter[] }
}

export enum FilterSource
{
  CLEARPLAY = "Clearplay",
  VIDANGEL = "VidAngel",
  MANUAL = "Manual",
}

export interface FilterData {
  filters: Filter[];
  filterSource: FilterSource;
  categories: FilterCategory[];
  mediaType: MediaType;
  offset: number;
  movieTitle: string;
  filterUrl: string;
}
