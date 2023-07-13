import express, { Express } from "express"
import dotenv from "dotenv"
import cors from "cors"
import { buildRoutes } from "./routes/routes.js"

import { MySimpleQueue } from "./utils/mySimpleQueue.js"
import { checkDownloads } from "./utils/intervalJobs.js"
import { logger } from "./utils/logger.js"

dotenv.config()

const app: Express = express()
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

const port = process.env.PORT

const jobQueue = new MySimpleQueue()

buildRoutes(app, jobQueue)

logger.log({
  level: "info",
  message: "Starting Interval",
})
setInterval(() => {
  logger.log({
    level: "info",
    message: "Running Interval Check",
  })
  // checkDownloads()
  jobQueue.moveDoneItems()
  jobQueue.checkStartNextJob()
}, 1000 * 10 * Number(process.env.INTERVAL_IN_MINUTES)) //run every 2 minutes

app.listen(port, () => {
  logger.log({
    level: "info",
    message: `⚡️[server]: Server is running at https://localhost:${port}`,
  })
})
