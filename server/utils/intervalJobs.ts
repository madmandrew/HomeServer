import fs, { Dirent } from "fs"

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
