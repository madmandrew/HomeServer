import "./Move.scss"
import FileList from "./components/FileList"
import React, { useState } from "react"
import axios from "axios"
import { API_ROUTES, PLEX_DIR } from "../../utils/AppConstants"
import { Refresh } from "@mui/icons-material"
import { Button, IconButton, Snackbar, TextField } from "@mui/material"

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

  const [newDir, setNewDir] = useState<string>("")

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

  const handleNewDir = async () => {
    if (newDir !== "") {
      await axios.post(API_ROUTES.fileNavMkdir, { dir: newDir })
      setReloadHack(reloadHack + 1)
      setSnackbarMsg("Created Directory")
      setOpenSnackbar(true)
    }
  }

  return (
    <div className="Move">
      <div className="title">
        <h1>Move Files</h1>
        <IconButton color="primary" component="label" onClick={reload}>
          <Refresh />
        </IconButton>
      </div>
      <TextField
        style={{ width: "50%" }}
        variant="filled"
        label="New Dir (with full path)"
        value={newDir}
        onChange={(e) => setNewDir(e.target.value)}
      />
      <Button onClick={handleNewDir} disabled={newDir === ""}>
        Create Dir
      </Button>
      <div className="files-container">
        <FileList
          reload={reloadHack}
          isDest={false}
          path={sourcePath}
          setPath={setSourcePath}
          moveRequest={handleMoveRequest}
        />
        <FileList reload={reloadHack} isDest={true} path={destPath} setPath={setDestPath} />
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
