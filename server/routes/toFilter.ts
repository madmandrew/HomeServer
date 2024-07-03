import { Express, Request } from "express"
import * as fs from "fs"
import { FilterRequest, MySimpleQueue } from "../utils/mySimpleQueue.js"
import { SettingsCacheType } from "../utils/settingsCache.js"
import { BASE_API_ROUTE } from "../utils/app_constants.js"

export function toFilterRoutes(app: Express, queue: MySimpleQueue, settingsCache: SettingsCacheType) {
  app.get(`${BASE_API_ROUTE}/toFilter/files`, (req, res) => {
    const baseDir = settingsCache.getSettings().root + settingsCache.getSettings().unfiltered
    fs.readdir(baseDir, (err: NodeJS.ErrnoException | null, files: string[]) => {
      res.send(err ?? { files, baseDir })
    })
  })

  app.get(`${BASE_API_ROUTE}/toFilter/items`, (req, res) => {
    res.send(queue.getItems())
  })

  app.post(`${BASE_API_ROUTE}/toFilter/filter`, (req: Request<undefined, string, FilterRequest>, res) => {
    const filterRequest = req.body
    // TODO maybe some validation on this??
    queue.add(filterRequest)
    res.send("Added")
  })
}
