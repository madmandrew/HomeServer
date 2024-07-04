import { Express, Request } from "express"
import { toFilterRoutes } from "./toFilter.js"
import { MySimpleQueue } from "../utils/mySimpleQueue.js"
import axios from "axios"
import { fileNavRoutes } from "./fileNav.js"
import { settingsRoutes } from "./settings.js"
import { SettingsCacheType } from "../utils/settingsCache.js"
import { BASE_API_ROUTE } from "../utils/app_constants.js"
import { filterHistoryRoutes } from "./filterHistory.js"

export function buildRoutes(app: Express, queue: MySimpleQueue, settingsCache: SettingsCacheType) {
  toFilterRoutes(app, queue, settingsCache)
  fileNavRoutes(app)
  settingsRoutes(app, settingsCache)
  filterHistoryRoutes(app)

  app.get(`${BASE_API_ROUTE}/clearplay/:assetId`, async (req: Request<{ assetId: string }>, res) => {
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
