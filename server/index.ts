import express, {Express} from "express"
import dotenv from "dotenv"
import cors from "cors"
import {buildRoutes} from "./routes/routes.js"

import {MySimpleQueue} from "./utils/mySimpleQueue.js"
import {logger} from "./utils/logger.js"
import {SettingsCacheClass} from "./utils/settingsCache.js"
import path from "path"
import {fileURLToPath} from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config()

const app: Express = express()
app.use(cors())
app.use(express.urlencoded({extended: true}))
app.use(express.json({limit: "50mb"}))

const port = process.env.PORT

const jobQueue = new MySimpleQueue()
const settingsCache = new SettingsCacheClass()

buildRoutes(app, jobQueue, settingsCache)

logger.log({
    level: "info",
    message: "Starting Interval",
})
setInterval(() =>
{
    logger.log({
        level: "info",
        message: "Running Interval Check123",
    })
    // checkDownloads()
    jobQueue.moveDoneItems(settingsCache)
    jobQueue.checkStartNextJob()
}, 1000 * 10 * Number(process.env.INTERVAL_IN_MINUTES)) //run every 2 minutes

app.use(express.static(path.join(__dirname, "../ui")))

app.get('*', (req, res) =>
{
    res.sendFile(`${process.cwd()}/dist/ui/index.html`, (err) =>
    {
        if (err)
        {
            res.status(500).send(err)
        }
    })
});
app.listen(port, () =>
{
    logger.log({
        level: "info",
        message: `⚡️[server]: Server is running at https://localhost:${port}`,
    })
})
