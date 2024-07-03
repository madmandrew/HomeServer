import { Button, Checkbox, IconButton } from "@mui/material"
import { API_ROUTES } from "../../../utils/AppConstants"
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload"
import FolderIcon from "@mui/icons-material/Folder"
import VideoFileIcon from "@mui/icons-material/VideoFile"
import DriveFileMoveIcon from "@mui/icons-material/DriveFileMove"
import DeleteIcon from "@mui/icons-material/Delete"

import "./FileList.scss"
import { useEffect, useState } from "react"
import axios from "axios"
import { AppFile } from "../Move"
import ConfirmDialog from "../../../components/ConfirmDialog"
import { FileApi } from "../../../api/file.api"

export interface FileListProps {
  isDest: boolean
  path: string
  setPath: (path: string) => void
  moveRequest?: (files: AppFile[]) => void
  reload: number
  defaultPaths: { root: string; toFilter: string }
}

export const buildMoveFileConfirm = (files: AppFile[]): string => {
  return `Are you sure you want to move file(s) (${files.map((file) => file.name).join("),(")})`
}

export const buildDeleteFileConfirm = (file: AppFile): string => {
  return `Are you sure you want to delete file ${file.name}`
}

export default function FileList(props: FileListProps) {
  const [files, setFiles] = useState<AppFile[]>([])
  const [selectedFiles, setSelectedFiles] = useState<AppFile[]>([])

  const [confirmOpen, setConfirmOpen] = useState<boolean>(false)
  const [confirmMsg, setConfirmMsg] = useState<string>("")
  const [confirmCallback, setConfirmCallback] = useState<() => void>(() => () => {})

  const fetchFiles = async () => {
    const result = await FileApi.fetchFiles(props.path)
    if (result) {
      setFiles(result)
    }
  }

  useEffect(() => {
    if (props.path !== "") {
      fetchFiles().then(() => setSelectedFiles([]))
    }
  }, [props.path, props.reload])

  const handleMoveUp = () => {
    if (props.path + "/" === props.defaultPaths.root) {
      return
    }
    props.setPath(props.path.split("/").slice(0, -1).join("/"))
  }

  const handleSelectCheckbox = (file: AppFile, checked: boolean) => {
    const newFiles = checked ? [...selectedFiles, file] : selectedFiles.filter((f) => f.name !== file.name)
    setSelectedFiles(newFiles)
  }

  const handleMoveFiles = () => {
    setConfirmMsg(buildMoveFileConfirm(selectedFiles))
    setConfirmOpen(true)
    setConfirmCallback(() => () => {
      if (props.moveRequest) {
        props.moveRequest(selectedFiles)
        setConfirmOpen(false)
      }
    })
  }

  const handleDeleteFile = async (file: AppFile) => {
    setConfirmMsg(buildDeleteFileConfirm(file))
    setConfirmOpen(true)
    setConfirmCallback(() => async () => {
      if (file.isDir) {
        await axios.post(API_ROUTES.fileNavDeleteDir, { file: props.path + "/" + file.name })
      } else {
        await axios.post(API_ROUTES.fileNavDelete, { file: props.path + "/" + file.name })
      }

      await fetchFiles()
      setConfirmOpen(false)
    })
  }

  return (
    <div className="FileList">
      <div className="title-container">
        <h2>{props.isDest ? "Dest" : "Source"}</h2>
        {props.isDest || (
          <IconButton color="primary" component="label" onClick={handleMoveFiles} disabled={selectedFiles.length === 0}>
            <DriveFileMoveIcon />
          </IconButton>
        )}
      </div>
      <div className="quick-links">
        <Button onClick={() => props.setPath(props.defaultPaths.toFilter)}>To Filter</Button>
        <Button onClick={() => props.setPath(props.defaultPaths.root)}>Plex Root</Button>
      </div>
      <div className="files">
        <div>
          <IconButton color="primary" component="label" onClick={handleMoveUp}>
            <DriveFolderUploadIcon />
          </IconButton>
          {props.path}
        </div>
        {files.map((file) => (
          <div key={file.name} className="file">
            {props.isDest || <Checkbox onChange={(e) => handleSelectCheckbox(file, e.target.checked)} />}
            {file.isDir ? (
              <IconButton color="primary" component="label" onClick={() => props.setPath(props.path + "/" + file.name)}>
                <FolderIcon />
              </IconButton>
            ) : (
              <VideoFileIcon />
            )}
            {file.name}
            <IconButton color="primary" component="label" onClick={() => handleDeleteFile(file)}>
              <DeleteIcon />
            </IconButton>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={confirmOpen}
        msg={confirmMsg}
        handleConfirm={confirmCallback}
        handleClose={() => setConfirmOpen(false)}
      />
    </div>
  )
}
