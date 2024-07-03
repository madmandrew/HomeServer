import { useEffect, useState } from "react"
import { Button, TextField } from "@mui/material"
import { Settings } from "../../../../shared/settings"
import { fetchSettings } from "../../api/setings.api"

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>()

  useEffect(() => {
    fetchSettings().then(newSettings => setSettings(newSettings))
  }, [])

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column"
        }}
      >
        <h1>Settings</h1>

        <TextField
          required
          style={{ width: "400px" }}
          id="outlined-required"
          label="Plex Media Root Location"
          defaultValue={settings?.root}
        />
        <TextField
          required
          style={{ marginTop: "16px", width: "400px" }}
          id="outlined-required"
          label="Movies Location"
        />
        <TextField
          required
          style={{ marginTop: "16px", width: "400px" }}
          id="outlined-required"
          label="TV Location"
        />
        <TextField
          required
          style={{ marginTop: "16px", width: "400px" }}
          id="outlined-required"
          label="Downloads Location"
        />
        <TextField
          style={{ marginTop: "16px", width: "400px" }}
          required
          id="outlined-required"
          label="Un-Filtered Location"
        />
        <TextField
          required
          style={{ marginTop: "16px", width: "400px" }}
          id="outlined-required"
          label="Filter Output Location"
        />
        <Button
          disabled
          style={{ marginTop: "16px", "width": "300px" }}
          variant="contained"
        >
          Update
        </Button>
      </div>
    </div>
  )
}
