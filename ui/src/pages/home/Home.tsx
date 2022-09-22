import axios from "axios"
import { API_ROUTES } from "../../utils/AppConstants"
import { useEffect, useState } from "react"

import "./Home.scss"
import { Delete, Pause, PlayArrow, Refresh } from "@mui/icons-material"
import { IconButton, Snackbar } from "@mui/material"
import ConfirmDialog, { ConfirmProps } from "../../components/ConfirmDialog"
import { FilterRequest } from "../filterMovie/FilterMovie.type"

export interface FilterQueue {
  queue: FilterRequest[]
  doneItems: FilterRequest[]
  workingItems: FilterRequest[]
}

export interface Download {
  name: string
  isCompleted: boolean
  progress: number
  state: string
  eta: number | string
  id: any
}

const fetchQueue = async (): Promise<FilterQueue> => {
  return (await axios.get(API_ROUTES.toFilterQueue)).data
}

const fetchMoviesToFilterCount = async (): Promise<number> => {
  const response = await axios.get(API_ROUTES.toFilterFiles)
  return response.data.files.length
}

const fetchTransmissionData = async (): Promise<Download[]> => {
  return (await axios.get(API_ROUTES.transmissionTorrents)).data.torrents.map((download: Download) => ({
    ...download,
    eta: download.eta === -1 ? "" : convertSecondsToTS(download.eta as number),
  }))
}

const convertSecondsToTS = (ts: number): string => {
  return new Date(ts * 1000).toISOString().substring(11, 19)
}

export default function Home() {
  const [queue, setQueue] = useState<FilterQueue>({ queue: [], doneItems: [], workingItems: [] })
  const [moviesToFilter, setMoviesToFilter] = useState<number>(0)
  const [downloads, setDownloads] = useState<Download[]>([])
  const [reloadTS, setReloadTS] = useState<string>("")
  const [openSnackbar, setOpenSnackbar] = useState<boolean>(false)
  const [snackbarMsg, setSnackbarMsg] = useState<string>("")
  const [confirmDialogProps, setConfirmDialogProps] = useState<ConfirmProps>({
    open: false,
    msg: "empty",
    handleConfirm: () => {},
    handleClose: () => {
      setConfirmDialogProps({
        ...confirmDialogProps,
        open: false,
      })
    },
  })

  const fetchData = () => {
    fetchQueue().then((newQueue) => setQueue(newQueue))
    fetchMoviesToFilterCount().then((newCounts) => setMoviesToFilter(newCounts))
    // fetchTransmissionData().then((newDownloads) => setDownloads(newDownloads))
    setReloadTS(new Date().toLocaleTimeString())
  }

  const pauseTorrent = async (torrentId: string, torrentName: string) => {
    await axios.post(API_ROUTES.transmissionPause, { id: torrentId })
    setSnackbarMsg(`Paused Torrent '${torrentName}'`)
    setOpenSnackbar(true)
  }

  const resumeTorrent = async (torrentId: string, torrentName: string) => {
    await axios.post(API_ROUTES.transmissionResume, { id: torrentId })
    setSnackbarMsg(`Resumed Torrent '${torrentName}'`)
    setOpenSnackbar(true)
  }

  const removeTorrent = async (torrentId: any, torrentName: string) => {
    setConfirmDialogProps({
      open: true,
      msg: `Are you sure you want to remove this torrent '${torrentName}'`,
      handleClose: () =>
        setConfirmDialogProps({
          ...confirmDialogProps,
          open: false,
        }),
      handleConfirm: async () => {
        await axios.post(API_ROUTES.transmissionRemove, { id: torrentId })
        setSnackbarMsg(`Removed Torrent '${torrentName}'`)
        setOpenSnackbar(true)
        setConfirmDialogProps({
          ...confirmDialogProps,
          open: false,
        })
      },
    })
  }

  useEffect(() => {
    fetchData()

    setInterval(() => fetchData(), 1000 * 10)
  }, [])

  // alert("TEST2" + process.env.SERVER_URL)
  return (
    <div className="homePage">
      <div className="reloadTS">
        <span>Last Loaded ({reloadTS})</span>
        <IconButton color="primary" component="label" onClick={fetchData}>
          <Refresh />
        </IconButton>
      </div>
      <div className="topRowContainer">
        <div>
          <h2 style={{ marginBottom: 0 }}>Movies To Filter</h2>
          <span className="movieFilterCount">{moviesToFilter}</span>
        </div>

        <div style={{ marginLeft: "2rem" }}>
          <h2>Downloads</h2>
          <table>
            <thead>
              <tr>
                <th>Name</th>
                <th>Completed</th>
                <th>ETA (HH:MM:SS)</th>
                <th>Progress</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {downloads.map((download) => (
                <tr key={download.name}>
                  <td>{download.name}</td>
                  <td>{download.isCompleted.toString()}</td>
                  <td>{download.eta}</td>
                  <td>{Math.floor(download.progress * 100)}%</td>
                  <td>{download.state}</td>
                  <td>
                    {download.state === "downloading" && (
                      <IconButton
                        color="primary"
                        component="label"
                        onClick={() => pauseTorrent(download.id, download.name)}
                      >
                        <Pause />
                      </IconButton>
                    )}
                    {download.state === "paused" && (
                      <IconButton
                        color="primary"
                        component="label"
                        onClick={() => resumeTorrent(download.id, download.name)}
                      >
                        <PlayArrow />
                      </IconButton>
                    )}
                    <IconButton
                      color="primary"
                      component="label"
                      onClick={() => removeTorrent(download.id, download.name)}
                    >
                      <Delete />
                    </IconButton>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="queueContainer">
        <div className="queueColumn">
          <h3>Queued Items</h3>
          {queue.queue.length === 0
            ? "Empty"
            : queue.queue.map((item) => (
                <div key={item.fileName}>
                  {item.fileName.split("/").slice(-1)} ({item.mediaType})
                </div>
              ))}
        </div>
        <div className="queueColumn">
          <h3>Working Items</h3>
          {queue.workingItems.length === 0
            ? "Empty"
            : queue.workingItems.map((item) => (
                <div key={item.fileName}>
                  {item.fileName.split("/").slice(-1)} ({item.mediaType})
                </div>
              ))}
        </div>
        <div className="queueColumn">
          <h3>Done Items</h3>
          {queue.doneItems.length === 0
            ? "Empty"
            : queue.doneItems.map((item) => (
                <div key={item.fileName}>
                  {item.fileName.split("/").slice(-1)} ({item.mediaType})
                </div>
              ))}
        </div>
      </div>

      <ConfirmDialog
        open={confirmDialogProps.open}
        msg={confirmDialogProps.msg}
        handleConfirm={confirmDialogProps.handleConfirm}
        handleClose={confirmDialogProps.handleClose}
      />
      <Snackbar
        autoHideDuration={5000}
        open={openSnackbar}
        message={snackbarMsg}
        onClose={() => setOpenSnackbar(false)}
      />
    </div>
  )
}
