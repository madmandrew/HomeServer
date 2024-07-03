import { Express } from "express"
import * as fs from "fs"
import { FilterRequest, MySimpleQueue } from "../utils/mySimpleQueue.js"
import { BASE_PLEX_DIR } from "../utils/app_constants.js"

export function toFilterRoutes(app: Express, queue: MySimpleQueue) {
  console.log("TEST2")
  app.get("/toFilter/files", (req, res) => {
    const baseDir = BASE_PLEX_DIR + "/tofilter"
    fs.readdir(baseDir, (err: NodeJS.ErrnoException | null, files: string[]) => {
      res.send(err ?? { files, baseDir })
    })
  })

  app.get("/toFilter/items", (req, res) => {
    res.send(queue.getItems())
  })

  app.post("/toFilter/filter", (req, res) => {
    const filterRequest: FilterRequest = req.body
    // TODO maybe some validation on this??
    queue.add(filterRequest)
    res.send("Added")
  })
}
