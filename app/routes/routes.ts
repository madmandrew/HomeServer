import { Express } from "express"
import { transmissionRoutes } from "./transmission.js"
import { toFilterRoutes } from "./toFilter.js"
import { MySimpleQueue } from "../utils/mySimpleQueue.js"
import axios from "axios"

export function buildRoutes(app: Express, queue: MySimpleQueue) {
  transmissionRoutes(app)
  toFilterRoutes(app, queue)

  app.get("/clearplay/:assetId", async (req, res) => {
    const assetId = req.params.assetId

    const filterResponse = await axios.post(
      "https://filter.clearplay.com/v1/filter",
      {
        asset_id: assetId.toString(),
        dev_mode: false,
        filter_settings: 3,
        format_id: 1,
        platform_id: 7,
        provider_id: 3,
      },
      {
        headers: {
          Authorization: "Basic Y3BhZG1pbkBjbGVhcnBsYXkuY29tOkNsZWFycGxheUZpbHRlcnMyMDE3IQ==",
        },
      }
    )

    res.send(filterResponse.data)
  })
}
