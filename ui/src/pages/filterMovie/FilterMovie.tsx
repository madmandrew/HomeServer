import {useLocation} from "react-router-dom"
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import React, {useState} from "react"
import {convertToEDLFormat, convertToFFMpegCommand, convertToVideoSkip} from "./utils/FilterUtils"

import "./FilterMovie.scss"
import {FilterMovieParams, FilterRequest} from "./FilterMovie.type"
import {useFilterFormData} from "./FilterMovie.util"
import {ManualFilters} from "./components/ManualFilters"
import {ToFilterApi} from "../../api/toFilter.api"
import {FilterHistoryApi} from "../../api/filterHistory.api"
import {FilterAccordions} from "./components/FilterAccordions";
import {Filter, FilterSource} from "../../shared-types/filterData";

export default function FilterMovie() {
  const { state }: { state: FilterMovieParams } = useLocation()
  const { filterData, handlers } = useFilterFormData(state.movieTitle)


  const [videoSkipFilter, setVideoSkipFilter] = useState<string>("")
  const [edlFilter, setEdlFilter] = useState<string>("")
  const [convertCommand, setConvertCommand] = useState<string>("")
  const [snackbarOpen, setSnackbarOpen] = useState<boolean>(false)
  const [manualFilters, setManualFilters] = useState<Filter[]>([])


  const handleConvert = () => {
    const filters = filterData.filterSource === FilterSource.MANUAL ? manualFilters : filterData.filters

    setVideoSkipFilter(convertToVideoSkip(filters, filterData.offset))
    setEdlFilter(convertToEDLFormat(filters, filterData.offset))
    setConvertCommand(convertToFFMpegCommand(filters, filterData.offset, state.baseDir + state.movieTitle))

    FilterHistoryApi.addFilterHistory(filterData)
  }

  const queueConversion = async () => {
    const filterRequest: FilterRequest = {
      filterCommand: convertCommand,
      fileName: state.baseDir + state.movieTitle,
      mediaType: filterData.mediaType,
    }

    await ToFilterApi.filterMovie(filterRequest)

    setSnackbarOpen(true)
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
              value={filterData.filterSource}
              label="Filter Source"
              onChange={(e) => handlers.handleFilterSourceChange(e.target.value as FilterSource)}
            >
              <MenuItem value={FilterSource.VIDANGEL}>{FilterSource.VIDANGEL}</MenuItem>
              <MenuItem value={FilterSource.CLEARPLAY}>{FilterSource.CLEARPLAY}</MenuItem>
              <MenuItem value={FilterSource.MANUAL}>{FilterSource.MANUAL}</MenuItem>
            </Select>
          </FormControl>

          <TextField
            variant="filled"
            label="Movie URL"
            InputLabelProps={{
              shrink: true,
            }}
            value={filterData.filterUrl}
            onChange={handlers.handleMovieUrl}
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
              onChange={handlers.handleOffsetChange}
            />

            <ToggleButtonGroup
              style={{ marginLeft: "1rem" }}
              color="primary"
              exclusive
              value={filterData.mediaType}
              onChange={handlers.handleMediaTypeChange}
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

        {filterData.filterSource === FilterSource.MANUAL && (
            <ManualFilters manualFilters={manualFilters} setManualFilters={setManualFilters} />
        )}
        {filterData.filterSource !== FilterSource.MANUAL && <FilterAccordions filterData={filterData} setFilterData={handlers.setFilterData} /> }
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
