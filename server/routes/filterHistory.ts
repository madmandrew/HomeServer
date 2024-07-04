import {Express, Request} from "express"
import {BASE_API_ROUTE} from "../utils/app_constants.js"
import {FilterData} from "../../ui/src/shared-types/filterData"
import {FilterHistoryUtil} from "../utils/filterHistory.js"

export function filterHistoryRoutes(app: Express)
{
    app.get(`${BASE_API_ROUTE}/filterHistory`, async (req, res) =>
    {
        res.send(await FilterHistoryUtil.readHistory())
    })

    app.post(`${BASE_API_ROUTE}/filterHistory`, async (req: Request<undefined, boolean, FilterData>, res) =>
    {
        res.send(await FilterHistoryUtil.writeHistory(req.body))
    })

    app.delete(`${BASE_API_ROUTE}/filterHistory/:movieTitle`, async (req: Request<{
        movieTitle: string
    }, FilterData[]>, res) =>
    {
        res.send(await FilterHistoryUtil.deleteHistory(req.params.movieTitle))
    })
}
