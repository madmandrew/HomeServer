import axios from "axios"
import {API_ROUTES} from "../../utils/AppConstants"
import {useEffect, useState} from "react"

import "./Home.scss"
import {Refresh} from "@mui/icons-material"
import {IconButton} from "@mui/material"
import {FilterRequest} from "../filterMovie/FilterMovie.type"

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

export default function Home() {
  const [queue, setQueue] = useState<FilterQueue>({ queue: [], doneItems: [], workingItems: [] })
  const [moviesToFilter, setMoviesToFilter] = useState<number>(0)
  const [reloadTS, setReloadTS] = useState<string>("")

  const fetchData = () => {
    fetchQueue().then((newQueue) => setQueue(newQueue))
    fetchMoviesToFilterCount().then((newCounts) => setMoviesToFilter(newCounts))
    setReloadTS(new Date().toLocaleTimeString())
  }

  useEffect(() => {
    fetchData()

    setInterval(() => fetchData(), 1000 * 10)
  }, [])

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

    </div>
  )
}
