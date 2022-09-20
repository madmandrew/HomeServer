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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"
import { FilterIncident } from "./components/FilterIncident"
import axios from "axios"
import { API_ROUTES } from "../../utils/AppConstants"

import "./FilterMovie.scss"
import { DefaultFilterData, FilterData, FilterMovieParams, FilterRequest } from "./FilterMovie.type"
import { FilterStorageUtil } from "../../utils/FilterStorage.util"

export default function FilterMovie() {
  const { state }: { state: FilterMovieParams } = useLocation()
  const [filterData, setFilterData] = useState<FilterData>(DefaultFilterData)

  const [videoSkipFilter, setVideoSkipFilter] = useState<string>("")
  const [edlFilter, setEdlFilter] = useState<string>("")
  const [convertCommand, setConvertCommand] = useState<string>("")
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)

  //Load saved data if possible
  useEffect(() => {
    const filterData = FilterStorageUtil.getFilter(state.movieTitle)
    if (filterData) {
      setFilterData(filterData)
    }
  }, [state.movieTitle])

  useEffect(() => {
    if (JSON.stringify(filterData) !== JSON.stringify(DefaultFilterData)) {
      FilterStorageUtil.saveFilter({
        ...filterData,
        movieTitle: state.movieTitle,
      })
    }
  }, [filterData, state.movieTitle])

  const handleFilterSettingsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFilterData({
      ...filterData,
      filterSettings: e.target.value,
      formattedFilterSettings: formatFilterSettings(JSON.parse(e.target.value)),
    })
  }

  const handleSelectAllGroups = (value: boolean) => {
    setFilterData({
      ...filterData,
      formattedFilterSettings: filterData.formattedFilterSettings.map((category) => ({
        category: category.category,
        filters: category.filters.map((filter) => ({
          selected: value,
          incident: filter.incident,
        })),
      })),
    })
  }

  const handleSelectAll = (filterGroup: ClearplayFilterGroup, value: boolean) => {
    setFilterData({
      ...filterData,
      formattedFilterSettings: filterData.formattedFilterSettings.map((category) => ({
        category: category.category,
        filters:
          category.category.id === filterGroup.category.id
            ? filterGroup.filters.map((filter) => ({
                selected: value,
                incident: filter.incident,
              }))
            : category.filters,
      })),
    })
  }

  const handleFilterChecked = (e: FilterOption) => {
    setFilterData({
      ...filterData,
      formattedFilterSettings: filterData.formattedFilterSettings.map((category) => ({
        category: category.category,
        filters: category.filters.map((filter) => (filter.incident.id === e.incident.id ? e : filter)),
      })),
    })
  }

  const handleConvert = () => {
    setVideoSkipFilter(
      convertToVideoSkip(filterData.formattedFilterSettings, filterData.formattedFilter, filterData.offset)
    )
    setEdlFilter(convertToEDLFormat(filterData.formattedFilterSettings, filterData.formattedFilter, filterData.offset))
    setConvertCommand(
      convertToFFMpegCommand(
        filterData.formattedFilterSettings,
        filterData.formattedFilter,
        filterData.offset,
        state.baseDir + "/" + state.movieTitle
      )
    )
  }

  const queueConversion = async () => {
    const filterRequest: FilterRequest = {
      filterCommand: convertCommand,
      fileName: state.baseDir + "/" + state.movieTitle,
      mediaType: filterData.mediaType,
    }

    await axios.post(API_ROUTES.toFilterFilter, filterRequest)

    setSnackbarOpen(true)
  }

  const handleOffsetChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilterData({
      ...filterData,
      offset: Number(e.target.value),
    })
  }

  const handleMediaTypeChange = (e: React.MouseEvent<HTMLElement>, newValue: FilterRequest["mediaType"]) => {
    setFilterData({
      ...filterData,
      mediaType: newValue,
    })
  }

  const handleFilterChange = (e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    setFilterData({
      ...filterData,
      filter: e.target.value,
      formattedFilter: JSON.parse(e.target.value),
    })
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
            value={filterData.filterSettings}
            onChange={handleFilterSettingsChange}
            rows={2}
          />
          <TextField
            style={{ marginBottom: ".5rem" }}
            multiline
            variant="filled"
            label="Filter"
            value={filterData.filter}
            onChange={handleFilterChange}
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
            <TextField
              variant="filled"
              label="Offset in seconds"
              value={filterData.offset}
              onChange={handleOffsetChange}
            />

            <ToggleButtonGroup
              style={{ marginLeft: "1rem" }}
              color="primary"
              exclusive
              value={filterData.mediaType}
              onChange={handleMediaTypeChange}
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
          {filterData.formattedFilterSettings.map((filterGroup) => (
            <Accordion key={filterGroup.category.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {filterGroup.category.desc} | {filterGroup.filters.length}
              </AccordionSummary>
              <AccordionDetails>
                <Button onClick={() => handleSelectAll(filterGroup, false)}>Deselect All</Button>{" "}
                <Button onClick={() => handleSelectAll(filterGroup, true)}>Select All</Button>
                {filterGroup.filters.map((incident) => (
                  <FilterIncident key={incident.incident.id} filterIncident={incident} checked={handleFilterChecked} />
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
