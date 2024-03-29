import fs, { Dirent } from "fs"
import { logger } from "./logger.js"
import { DOWNLOADS_DIR } from "./app_constants.js"

const loadFiles = (dir: string): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, nextFiles) => {
      if (err) {
        reject(err)
      } else {
        resolve(nextFiles)
      }
    })
  })
}

export const loadFilesAndDirs = (dir: string): Promise<Dirent[]> => {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, { withFileTypes: true }, (err: NodeJS.ErrnoException | null, filesObj: Dirent[]) => {
      if (err) {
        reject(err)
      } else {
        resolve(filesObj)
      }
    })
  })
}

export async function checkDownloads() {
  // loop through downloads
  const files: string[] = []

  const fileObjs = await loadFilesAndDirs(DOWNLOADS_DIR)
  for (const file of fileObjs) {
    if (file.isDirectory()) {
      const nextDir = DOWNLOADS_DIR + file.name
      files.push(...(await loadFiles(nextDir)).map((bottomFile) => nextDir + "/" + bottomFile))
    } else {
      files.push(DOWNLOADS_DIR + file.name)
    }
  }

  // check anything that doesn't have a .part
  const finishedFiles = files.filter((file) => !file.endsWith(".part"))
  if (finishedFiles.length > 0) {
    // move to toFilter
    finishedFiles.forEach((file) => {
      fs.rename(
        file,
        (process.env.BASE_FILEPATH ?? "") +
          (process.env.PLEX_DIRECTORY ?? "") +
          "/tofilter/" +
          file.split("/").slice(-1),
        (err) => {
          if (err) {
            logger.error({
              message: `Failed to move file ${file}`,
              meta: { err },
            })
          }
        }
      )
    })
  }
}
