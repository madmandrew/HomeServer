import { Express, Request } from "express"
import { loadFilesAndDirs } from "../utils/intervalJobs.js"
import { logger } from "../utils/logger.js"
import fs from "fs"
import { BASE_API_ROUTE } from "../utils/app_constants.js"

export interface FileMoveRequest {
  files: string[]
  sourceDir: string
  destDir: string
}

export function fileNavRoutes(app: Express) {
  app.get(`${BASE_API_ROUTE}/file/list`, async (req, res) => {
    if (typeof req.query.path === "string") {
      try {
        const files = await loadFilesAndDirs(req.query.path)
        res.send(
          files.map((file) => ({
            name: file.name,
            isDir: file.isDirectory(),
          }))
        )
        return
      } catch (e) {
        logger.error("Failed to read dir", { e })
      }
    }
    res.send("Invalid dir")
  })

  app.post(`${BASE_API_ROUTE}/file/move`, (req: Request<undefined, string, FileMoveRequest>, res) => {
    const params = req.body
    if (params.files && params.destDir && params.sourceDir) {
      try {
        params.files.forEach((file) => {
          fs.renameSync(params.sourceDir + "/" + file, params.destDir + "/" + file)
        })
      } catch (e) {
        logger.error("Failed to move files", { e })
      }
    }

    res.send("Moved")
  })

  app.post(`${BASE_API_ROUTE}/file/delete`, (req, res) => {
    const file: string = req.body.file
    if (file) {
      try {
        fs.unlinkSync(file)
      } catch (e) {
        logger.error("Failed to delete files", { e })
      }
    }
    res.send("Deleted")
  })

  app.post(`${BASE_API_ROUTE}/file/mkdir`, (req, res) => {
    const newDir: string = req.body.dir
    if (newDir) {
      try {
        fs.mkdirSync(newDir)
      } catch (e) {
        logger.error("Failed to create dir", { e })
      }
    }
    res.send("Created")
  })

  app.post(`${BASE_API_ROUTE}/file/delete/dir`, (req, res) => {
    const file: string = req.body.file
    if (file) {
      try {
        fs.rmdirSync(file)
      } catch (e) {
        logger.error("Failed to delete files", { e })
      }
    }
    res.send("Deleted")
  })
}
