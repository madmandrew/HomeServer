import { Filter, FilterCategory, FiltersGrouped } from "./utils/CommonFilterTypes"

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
