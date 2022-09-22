import * as fs from "fs"
import { exec } from "child_process"
import dotenv from "dotenv"
import { logger } from "./logger.js"
import { PLEX_MOVIE_DIR, PLEX_MOVIE_UNFILTERED_DEST, PLEX_TV_DIR } from "./app_constants.js"

export interface FilterRequest {
  filterCommand: string
  fileName: string
  mediaType: "MOVIE" | "TV"
}

export interface FilterRequestError extends FilterRequest {
  error: string
}

dotenv.config()

const CONVERSION_LIMIT = Number(process.env.CONVERSION_LIMIT)

const buildConvertedFileName = (fileName: string) => {
  const parts = fileName.split(".")
  return parts.slice(0, -1).join(".") + "-converted." + parts.slice(-1)
}

export class MySimpleQueue {
  private queue: FilterRequest[] = []
  private doneItems: FilterRequest[] = []
  private workingItems: FilterRequest[] = []
  private erroredItems: FilterRequestError[] = []

  getItems() {
    return {
      queue: this.queue,
      doneItems: this.doneItems,
      workingItems: this.workingItems,
    }
  }

  add(item: FilterRequest) {
    logger.info({ message: `Added item ${item.fileName}` })
    this.queue.push(item)
  }

  moveDoneItems() {
    //Check if items are done if so move
    const doneItems = this.doneItems.slice()
    this.doneItems = []
    doneItems.forEach((item) => {
      // move converted file
      const convertedFileName = buildConvertedFileName(item.fileName)
      fs.rename(
        convertedFileName,
        (item.mediaType === "MOVIE" ? PLEX_MOVIE_DIR : PLEX_TV_DIR) + convertedFileName.split("/").slice(-1),
        (err) => {
          if (err) {
            logger.error({
              message: `Failed to move converted file ${item.fileName}`,
              meta: { err },
            })
            this.erroredItems.push({ ...item, error: err.message })
          }
        }
      )

      // move unfiltered item
      fs.rename(item.fileName, PLEX_MOVIE_UNFILTERED_DEST + item.fileName.split("/").slice(-1), (err) => {
        if (err) {
          logger.error({
            message: `Failed to move converted file ${item.fileName}`,
            meta: { err },
          })
          this.erroredItems.push({ ...item, error: err.message })
        }
      })
    })
  }

  checkStartNextJob() {
    //ffmpeg -y -i "H:/testing/plex-media/tofilter/Mobile Suit Gundam Wing S01E01 The Shooting Star She Saw.mkv" -v error -c:v copy -af "volume=enable='between(t,18,20)':volume=0" -c:a aac "H:/testing/plex-media/tofilter/Mobile Suit Gundam Wing S01E01 The Shooting Star She Saw-converted.mkv"
    if (this.workingItems.length < CONVERSION_LIMIT && this.queue.length > 0) {
      logger.info({
        message: `Start next job`,
      })
      const item = this.queue.shift()

      if (item) {
        this.workingItems.push(item)
        exec(item.filterCommand, (error) => {
          logger.info(`Job Finished ${item.fileName}`, { error })
          this.workingItems = this.workingItems.filter((workingItems) => workingItems.fileName !== item.fileName)
          this.doneItems.push(item)
        })
      }
    }
  }
}
