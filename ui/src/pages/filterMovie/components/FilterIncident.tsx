import "./FilterIncident.scss"
import { Checkbox } from "@mui/material"
import { Filter } from "../utils/CommonFilterTypes"

type Props = {
  filters: Filter[]
  checked: (e: boolean) => void
}

export const FilterIncident = ({ filters, checked }: Props) => {
  return (
    <div className="incident">
      <Checkbox checked={filters[0].selected} onChange={(e) => checked(e.target.checked)} />
      <div>
        <p>
          {filters[0].description} ({filters.length})
        </p>
      </div>
    </div>
  )
}
