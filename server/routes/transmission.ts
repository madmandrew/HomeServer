import { Express } from "express"
import { Transmission } from "@ctrl/transmission"

export function transmissionRoutes(app: Express) {
  const client = new Transmission({
    baseUrl: "http://localhost:9091",
    password: "",
  })

  app.get("/torrents", async (req, res) => {
    res.send(await client.getAllData())
  })

  app.post("/torrent/pause", async (req, res) => {
    res.send(await client.pauseTorrent(req.body.id))
  })

  app.post("/torrent/resume", async (req, res) => {
    res.send(await client.resumeTorrent(req.body.id))
  })

  app.post("/torrent/remove", async (req, res) => {
    res.send(await client.removeTorrent(req.body.id))
  })
}
