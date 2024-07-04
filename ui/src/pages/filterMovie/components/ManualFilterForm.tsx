import "./FilterIncident.scss"
import { Button, MenuItem, Select, TextField } from "@mui/material"
import React, { useState } from "react"
import {Filter, FilterType} from "../../../shared-types/filterData";

type Props = {
  newFilter: (filter: Filter) => void
}

export const ManualFilterForm = (props: Props) => {
  const [startTime, setStartTime] = useState<string>("")
  const [endTime, setEndTime] = useState<string>("")
  const [description, setDescription] = useState<string>("")
  const [filterType, setFilterType] = useState<FilterType>(FilterType.VISUAL)

  const handleAddFilter = () => {
    props.newFilter({
      start: parseInt(startTime),
      resume: parseInt(endTime),
      description: description,
      type: filterType,
      categoryId: 0,
      id: Math.random().toString(),
      selected: true,
    })
  }
  return (
    <div style={{ display: "flex", gap: "14px" }}>
      <TextField label="Start Time" value={startTime} onChange={(e) => setStartTime(e.target.value)} type="number" />
      <TextField label="End Time" value={endTime} onChange={(e) => setEndTime(e.target.value)} type="number" />
      <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <Select
        labelId="filter-type"
        label="Filter Type"
        value={filterType}
        onChange={(e) => setFilterType(e.target.value as FilterType)}
      >
        <MenuItem value={FilterType.VISUAL}>Visual</MenuItem>
        <MenuItem value={FilterType.AUDIO}>Audio</MenuItem>
      </Select>

      <Button disabled={startTime === "" || endTime === ""} onClick={handleAddFilter}>
        Add Filter
      </Button>
    </div>
  )
}
