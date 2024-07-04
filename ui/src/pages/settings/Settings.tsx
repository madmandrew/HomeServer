import React, { useEffect, useState } from "react"
import { Alert, Box, Button, CircularProgress, Snackbar, TextField } from "@mui/material"
import { fetchSettings, updateSettings } from "../../api/setings.api"
import {Settings} from "../../shared-types/settings";

export default function SettingsPage() {
  const [origSettings, setOrigSettings] = useState<Settings>()
  const [settings, setSettings] = useState<Settings>()
  const [settingsChanged, setSettingsChanged] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(false)
  const [openSnackBar, setOpenSnackBar] = useState(false)

  useEffect(() => {
    fetchSettings().then((newSettings) => {
      setSettings(newSettings)
      setOrigSettings(newSettings)
    })
  }, [])

  useEffect(() => {
    if (JSON.stringify(settings) !== JSON.stringify(origSettings)) {
      setSettingsChanged(true)
    } else {
      setSettingsChanged(false)
    }
  }, [settings, origSettings])

  const handleSettingsUpdate = (value: string, key: keyof Settings) => {
    setSettings({ ...(settings ?? ({} as Settings)), [key]: value })
  }

  const pushSettingsUpdate = async () => {
    if (!settings) return

    setLoading(true)
    const result = await updateSettings(settings)
    if (result) {
      setOrigSettings(settings)
      setOpenSnackBar(true)
    }
    setLoading(false)
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "column",
        }}
      >
        <h1>Settings</h1>

        <TextField
          required
          style={{ width: "400px" }}
          id="outlined-required"
          label="Plex Media Root Location"
          value={settings?.root ?? ""}
          onChange={(e) => handleSettingsUpdate(e.target.value, "root")}
        />
        <TextField
          required
          style={{ marginTop: "16px", width: "400px" }}
          id="outlined-required"
          label="Movies Location"
          value={settings?.movies ?? ""}
          onChange={(e) => handleSettingsUpdate(e.target.value, "movies")}
        />
        <TextField
          required
          style={{ marginTop: "16px", width: "400px" }}
          id="outlined-required"
          label="TV Location"
          value={settings?.tv ?? ""}
          onChange={(e) => handleSettingsUpdate(e.target.value, "tv")}
        />
        <TextField
          style={{ marginTop: "16px", width: "400px" }}
          required
          id="outlined-required"
          label="Un-Filtered Location"
          value={settings?.unfiltered ?? ""}
          onChange={(e) => handleSettingsUpdate(e.target.value, "unfiltered")}
        />
        <TextField
          required
          style={{ marginTop: "16px", width: "400px" }}
          id="outlined-required"
          label="Filter Archive Location"
          value={settings?.filtered ?? ""}
          onChange={(e) => handleSettingsUpdate(e.target.value, "filtered")}
        />
        <Box sx={{ m: 1, position: "relative" }}>
          <Button
            style={{ marginTop: "16px", width: "300px" }}
            variant="contained"
            disabled={!settingsChanged || loading}
            onClick={() => pushSettingsUpdate()}
          >
            Update
          </Button>
          {loading && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-6px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Box>
      </div>

      <Snackbar open={openSnackBar} autoHideDuration={5000} onClose={() => setOpenSnackBar(false)}>
        <Alert onClose={() => setOpenSnackBar(false)} severity="success">
          Settings Updated
        </Alert>
      </Snackbar>
    </div>
  )
}
