import { useLocation } from "react-router-dom"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Button,
  FormControl,
  InputLabel,
  ListSubheader,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import React, { ChangeEvent, useEffect, useState } from "react"
import { convertToEDLFormat, convertToFFMpegCommand, convertToVideoSkip } from "./utils/FilterUtils"
import ExpandMoreIcon from "@mui/icons-material/ExpandMore"

import "./FilterMovie.scss"
import { DefaultFilterData, FilterData, FilterMovieParams, FilterRequest, FilterSource } from "./FilterMovie.type"
import { FilterStorageUtil } from "../../utils/FilterStorage.util"
import { fetchAndConvertClearplayFilters } from "./utils/ClearplayUtils"
import { Filter, FiltersGrouped } from "./utils/CommonFilterTypes"
import { formatFiltersGrouped } from "./FilterMovie.util"
import {
  fetchAndConvertVidAngelFilters,
  fetchAndConvertVidAngelFiltersForId,
  fetchVidAngelFilterDataForTvShow,
  VidAngelSeason,
} from "./utils/VidAngelUtils"
import { FilterIncident } from "./components/FilterIncident"
import axios from "axios"
import { API_ROUTES } from "../../utils/AppConstants"

export default function FilterMovie() {
  const { state }: { state: FilterMovieParams } = useLocation()
  const [filterData, setFilterData] = useState<FilterData>(DefaultFilterData)

  const [filtersGrouped, setFiltersGrouped] = useState<FiltersGrouped[]>([])
  const [filterSource, setFilterSource] = useState<FilterSource>(FilterSource.CLEARPLAY)
  const [videoSkipFilter, setVideoSkipFilter] = useState<string>("")
  const [edlFilter, setEdlFilter] = useState<string>("")
  const [convertCommand, setConvertCommand] = useState<string>("")
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [seasonOptions, setSeasonOptions] = useState<VidAngelSeason[]>([])
  const [selectedEpisode, setSelectedEpisode] = useState<number | null>()

  //Load saved data if possible
  useEffect(() => {
    const filterData = FilterStorageUtil.getFilter(state.movieTitle)
    if (filterData) {
      setFilterData(filterData)
    }
  }, [state.movieTitle])

  //Save filter data to local storage
  useEffect(() => {
    if (JSON.stringify(filterData) !== JSON.stringify(DefaultFilterData)) {
      FilterStorageUtil.saveFilter({
        ...filterData,
        movieTitle: state.movieTitle,
      })
    }
  }, [filterData, state.movieTitle])

  //format filtergroups
  useEffect(() => {
    setFiltersGrouped(formatFiltersGrouped(filterData.filters, filterData.categories))
  }, [filterData.categories, filterData.filters])

  const handleFilterSourceChange = (newSource: FilterSource) => {
    setFilterSource(newSource)
  }

  const handleMovieUrl = async (e: ChangeEvent<HTMLInputElement>) => {
    const movieUrl: string = e.target.value

    if (movieUrl == null || movieUrl === "") {
      return
    }

    let newFilterData
    if (filterSource === FilterSource.VIDANGEL) {
      if (movieUrl.indexOf("show") === -1) {
        newFilterData = await fetchAndConvertVidAngelFilters(movieUrl)
      } else {
        setSeasonOptions(await fetchVidAngelFilterDataForTvShow(movieUrl))
      }
    } else {
      await fetchAndConvertClearplayFilters(movieUrl)
    }

    if (newFilterData != null) {
      setFilterData({
        ...filterData,
        filters: newFilterData.filters,
        categories: newFilterData.categories,
      })
    } else {
      console.warn("Failed to fetch filters")
    }
  }

  const handleSelectAllGroups = (value: boolean) => {
    setFilterData({
      ...filterData,
      filters: filterData.filters.map((filter) => ({ ...filter, selected: value })),
    })
  }

  const updateFilters = (updatedFilters: Filter[]) => {
    const filterLookup: { [id: string]: Filter } = {}
    updatedFilters.forEach((filter) => (filterLookup[filter.id] = filter))

    const newFilters = filterData.filters.map((filter) =>
      filterLookup[filter.id] == null ? filter : filterLookup[filter.id]
    )

    setFilterData({
      ...filterData,
      filters: newFilters,
    })
  }

  const handleSelectAll = (group: FiltersGrouped, value: boolean) => {
    const tempFilters: Filter[] = []
    Object.values(group.filters).forEach((filters) => tempFilters.push(...filters))

    const newFilters = tempFilters.map((tmpFilter) => ({ ...tmpFilter, selected: value }))
    updateFilters(newFilters)
  }

  const handleFilterChecked = (filters: Filter[], newSelected: boolean) => {
    const newFilters = filters.map((filter) => ({ ...filter, selected: newSelected }))
    updateFilters(newFilters)
  }

  const handleConvert = () => {
    setVideoSkipFilter(convertToVideoSkip(filterData.filters, filterData.offset))
    setEdlFilter(convertToEDLFormat(filterData.filters, filterData.offset))
    setConvertCommand(
      convertToFFMpegCommand(filterData.filters, filterData.offset, state.baseDir + "/" + state.movieTitle)
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

  const handleEpisodeSelection = async (id: number) => {
    setSelectedEpisode(id)
    const newFilterData = await fetchAndConvertVidAngelFiltersForId(id)
    if (newFilterData != null) {
      setFilterData({
        ...filterData,
        filters: newFilterData.filters,
        categories: newFilterData.categories,
      })
    }
  }

  const getSeasonOptions = () => {
    const options: any = []

    seasonOptions.forEach((season) => {
      options.push(<ListSubheader key={season.title}>{season.title}</ListSubheader>)
      season.episodes.forEach((episode) =>
        options.push(
          <MenuItem key={episode.id} value={episode.id}>
            {episode.title}
          </MenuItem>
        )
      )
    })

    return options
  }

  return (
    <div className="FilterMovie">
      <h1>Filter {state.movieTitle}</h1>
      <div className="top-section-container">
        <div className="filter-input-container">
          <FormControl fullWidth style={{ marginBottom: "1rem" }}>
            <InputLabel id="filter-source">Filter Source</InputLabel>
            <Select
              labelId="filter-source"
              value={filterSource}
              label="Filter Source"
              onChange={(e) => handleFilterSourceChange(e.target.value as FilterSource)}
            >
              <MenuItem value={FilterSource.VIDANGEL}>{FilterSource.VIDANGEL}</MenuItem>
              <MenuItem value={FilterSource.CLEARPLAY}>{FilterSource.CLEARPLAY}</MenuItem>
            </Select>
          </FormControl>
          <TextField
            variant="filled"
            label="Movie URL"
            InputLabelProps={{
              shrink: true,
            }}
            onChange={handleMovieUrl}
          />
          {seasonOptions != null && seasonOptions.length > 0 && (
            <FormControl fullWidth style={{ marginTop: "1rem" }}>
              <InputLabel id="season-episode">TV Show Episodes</InputLabel>
              <Select
                labelId="season-episode"
                value={selectedEpisode}
                label="test"
                onChange={(e) => handleEpisodeSelection(e.target.value as number)}
              >
                {getSeasonOptions()}
              </Select>
            </FormControl>
          )}
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

          {filtersGrouped.map((group) => (
            <Accordion key={group.category.id}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                {group.category.description} | {Object.keys(group.filters).length}
              </AccordionSummary>
              <AccordionDetails>
                <Button onClick={() => handleSelectAll(group, false)}>Deselect All</Button>{" "}
                <Button onClick={() => handleSelectAll(group, true)}>Select All</Button>
                {Object.keys(group.filters).map((key) => (
                  <FilterIncident
                    key={key}
                    filters={group.filters[key]}
                    checked={(e) => handleFilterChecked(group.filters[key], e)}
                  />
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
