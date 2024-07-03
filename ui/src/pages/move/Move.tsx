import "./Move.scss"
import FileList from "./components/FileList"
import React, { useEffect, useState } from "react"
import axios from "axios"
import { API_ROUTES } from "../../utils/AppConstants"
import { Refresh } from "@mui/icons-material"
import { IconButton, Snackbar } from "@mui/material"
import { fetchSettings } from "../../api/setings.api"

export interface AppFile {
  name: string
  isDir: boolean
}

export interface FileMoveRequest {
  files: string[]
  sourceDir: string
  destDir: string
}

export default function Move() {
  const [reloadHack, setReloadHack] = useState<number>(0)
  const [sourcePath, setSourcePath] = useState<string>("")
  const [destPath, setDestPath] = useState<string>("")
  const [snackbarMsg, setSnackbarMsg] = useState<string>("")
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [defaultPaths, setDefaultPaths] = useState<{ root: string; toFilter: string }>({ root: "", toFilter: "" })

  // const [newDir, setNewDir] = useState<string>("")

  useEffect(() => {
    fetchSettings().then((settings) => {
      setDefaultPaths({
        root: settings.root,
        toFilter: settings.root + settings.unfiltered,
      })
    })
  }, [])

  const reload = () => {
    setReloadHack(reloadHack + 1)
    setSnackbarMsg("Reloaded Data")
    setOpenSnackbar(true)
  }

  const handleMoveRequest = async (files: AppFile[]) => {
    const params: FileMoveRequest = {
      files: files.map((file) => file.name),
      sourceDir: sourcePath,
      destDir: destPath,
    }
    await axios.post(API_ROUTES.fileNavMove, params)

    reload()
  }

  return (
    <div className="Move">
      <div className="title">
        <h1>Move Files</h1>
        <IconButton color="primary" component="label" onClick={reload}>
          <Refresh />
        </IconButton>
      </div>
      <div className="files-container">
        <FileList
          reload={reloadHack}
          isDest={false}
          path={sourcePath}
          setPath={setSourcePath}
          moveRequest={handleMoveRequest}
          defaultPaths={defaultPaths}
        />
        <FileList reload={reloadHack} isDest={true} path={destPath} setPath={setDestPath} defaultPaths={defaultPaths} />
      </div>

      <Snackbar
        open={openSnackbar}
        message={snackbarMsg}
        onClose={() => setOpenSnackbar(false)}
        autoHideDuration={5000}
      />
    </div>
  )
}
