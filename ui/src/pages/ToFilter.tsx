import axios from "axios"
import { useEffect, useState } from "react"
import { Button, IconButton } from "@mui/material"
import { Refresh } from "@mui/icons-material"
import { useNavigate } from "react-router-dom"
import { API_ROUTES, PAGE_ROUTES } from "../utils/AppConstants"
import { FilterMovieParams } from "./filterMovie/FilterMovie.type"

export default function ToFilter() {
  const [files, setFiles] = useState<string[]>([])
  const [baseDir, setBaseDir] = useState<string>("")
  const navigate = useNavigate()

  const fetchFiles = async () => {
    const response = await axios.get(API_ROUTES.toFilterFiles)
    setFiles(response.data.files)
    setBaseDir(response.data.baseDir)
  }

  const navigateMovie = (title: string) => {
    const paramState: FilterMovieParams = {
      movieTitle: title,
      baseDir: baseDir,
    }
    navigate(PAGE_ROUTES.filterMovie, {
      state: paramState,
    })
  }

  useEffect(() => {
    fetchFiles()
  }, [])

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <h1>Movies To Filter</h1>

        <IconButton color="primary" component="label" onClick={fetchFiles}>
          <Refresh />
        </IconButton>
      </div>

      <p>({baseDir})</p>

      {files.map((file) => (
        <div key={file} style={{ display: "flex", alignItems: "center" }}>
          {file}
          <Button variant="outlined" size="small" style={{ marginLeft: "1rem" }} onClick={() => navigateMovie(file)}>
            Filter
          </Button>
        </div>
      ))}
    </div>
  )
}
