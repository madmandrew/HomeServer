import { useLocation } from "react-router-dom"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  Snackbar,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import React, { useEffect, useState } from "react"
import {
  ClearplayFilterGroup,
  convertToEDLFormat,
  convertToFFMpegCommand,
  convertToVideoSkip,
  FilterOption,
  formatFilterSettings,
} from "./utils/FilterUtils"
import { Filter } from "./utils/FilterTypes"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { FilterIncident } from "./components/FilterIncident"
import axios from "axios"
import { API_ROUTES } from "../../utils/AppConstants"

import "./FilterMovie.scss"
import { FilterData, FilterMovieParams, FilterRequest } from "./FilterMovie.type"
import { FilterStorageUtil } from "../../utils/FilterStorage.util"

export default function FilterMovie() {
  const { state }: { state: FilterMovieParams } = useLocation()
  const [filterData, setFilterData] = useState<FilterData>()

  //Load saved data if possible
  useEffect(() => {
    const filterData = FilterStorageUtil.getFilter(state.movieTitle)
    if (filterData) {
      setFilterData(filterData)
    }
  }, [state.movieTitle, setFilterData])

  const [filters, setFilter] = useState<Filter>({} as any)
  const [videoSkipFilter, setVideoSkipFilter] = useState<string>("")
  const [edlFilter, setEdlFilter] = useState<string>("")
  const [convertCommand, setConvertCommand] = useState<string>("")
  const [offset, setOffset] = useState<number>(0)
  const [formattedFilters, setFormattedFilters] = useState<ClearplayFilterGroup[]>([])
  const [mediaType, setMediaType] = useState<FilterRequest["mediaType"]>("MOVIE")
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)

  const handleFilterSettingsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newFilterSettings = JSON.parse(e.target.value)

    setFormattedFilters(formatFilterSettings(newFilterSettings))
  }

  const handleSelectAllGroups = (value: boolean) => {
    setFormattedFilters(
      formattedFilters.map((category) => ({
        category: category.category,
        filters: category.filters.map((filter) => ({
          selected: value,
          incident: filter.incident,
        })),
      }))
    )
  }

  const handleSelectAll = (filterGroup: ClearplayFilterGroup, value: boolean) => {
    setFormattedFilters(
      formattedFilters.map((category) => ({
        category: category.category,
        filters:
          category.category.id === filterGroup.category.id
            ? filterGroup.filters.map((filter) => ({
                selected: value,
                incident: filter.incident,
              }))
            : category.filters,
      }))
    )
  }

  const handleFilterChecked = (e: FilterOption) => {
    setFormattedFilters(
      formattedFilters.map((category) => ({
        category: category.category,
        filters: category.filters.map((filter) => (filter.incident.id === e.incident.id ? e : filter)),
      }))
    )
  }

  const handleConvert = () => {
    setVideoSkipFilter(convertToVideoSkip(formattedFilters, filters, offset))
    setEdlFilter(convertToEDLFormat(formattedFilters, filters, offset))
    setConvertCommand(convertToFFMpegCommand(formattedFilters, filters, offset, state.baseDir + "/" + state.movieTitle))
  }

  const queueConversion = async () => {
    const filterRequest: FilterRequest = {
      filterCommand: convertCommand,
      fileName: state.baseDir + "/" + state.movieTitle,
      mediaType: mediaType,
    }

    await axios.post(API_ROUTES.toFilterFilter, filterRequest)

    setSnackbarOpen(true)
  }

  return (
    <div className="FilterMovie">
      <h1>Filter {state.movieTitle}</h1>

      <div className="top-section-container">
        <div className="filter-input-container">
          <TextField
            style={{ marginBottom: ".5rem" }}
            multiline
            variant="filled"
            label="Filter SettingUI"
            onChange={handleFilterSettingsChange}
            rows={2}
          />
          <TextField
            style={{ marginBottom: ".5rem" }}
            multiline
            variant="filled"
            label="Filter"
            onChange={(e) => setFilter(JSON.parse(e.target.value))}
            rows={2}
          />
          <div
            style={{
              marginTop: "1rem",
              marginBottom: "1rem",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <TextField variant="filled" label="Offset in seconds" onChange={(e) => setOffset(Number(e.target.value))} />

            <ToggleButtonGroup
              style={{ marginLeft: "1rem" }}
              color="primary"
              exclusive
              value={mediaType}
              onChange={(e, newValue) => setMediaType(newValue)}
            >
              <ToggleButton value={"MOVIE"}>Movie</ToggleButton>
              <ToggleButton value={"TV"}>TV</ToggleButton>
            </ToggleButtonGroup>
          </div>
          <div>
            <Button variant="contained" onClick={handleConvert} style={{ marginLeft: "1rem" }}>
              Convert
            </Button>

            <Button
              variant="contained"
              onClick={queueConversion}
              style={{ marginLeft: "1rem" }}
              disabled={!(convertCommand != null && convertCommand !== "")}
            >
              Queue Conversion
            </Button>
          </div>
        </div>

        <div className="filter-selection-container">
          <div>
            <Button onClick={() => handleSelectAllGroups(false)}>Deselect All</Button>{" "}
            <Button onClick={() => handleSelectAllGroups(true)}>Select All</Button>
          </div>
          {formattedFilters.map((filterGroup) => (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {filterGroup.category.desc} | {filterGroup.filters.length}
              </AccordionSummary>
              <AccordionDetails>
                <Button onClick={() => handleSelectAll(filterGroup, false)}>Deselect All</Button>{" "}
                <Button onClick={() => handleSelectAll(filterGroup, true)}>Select All</Button>
                {filterGroup.filters.map((incident) => (
                  <FilterIncident filterIncident={incident} checked={handleFilterChecked} />
                ))}
              </AccordionDetails>
            </Accordion>
          ))}
        </div>
      </div>

      <div className="filter-output-container">
        <TextField
          className="filter-output"
          multiline
          variant="filled"
          label="Video Skip"
          value={videoSkipFilter}
          rows={10}
        />
        <TextField className="filter-output" multiline variant="filled" label="EDL" value={edlFilter} rows={10} />
        <TextField
          className="filter-output"
          multiline
          variant="filled"
          label="FFmpeg"
          value={convertCommand}
          rows={10}
        />
      </div>

      <Snackbar open={snackbarOpen} autoHideDuration={5000} onClose={() => setSnackbarOpen(false)}>
        <Alert onClose={() => setSnackbarOpen(false)} severity="success">
          Conversion Submitted
        </Alert>
      </Snackbar>
    </div>
  )
}
