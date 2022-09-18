import { Express } from "express"
import { transmissionRoutes } from "./transmission.js"
import { toFilterRoutes } from "./toFilter.js"
import { MySimpleQueue } from "../utils/mySimpleQueue.js"

export function buildRoutes(app: Express, queue: MySimpleQueue) {
  transmissionRoutes(app)
  toFilterRoutes(app, queue)
}
