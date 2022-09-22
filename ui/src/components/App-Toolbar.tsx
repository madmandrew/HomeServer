import { AppBar, Button, Toolbar, Typography } from "@mui/material"
import { Link } from "react-router-dom"
import { PAGE_ROUTES } from "../utils/AppConstants"
import React from "react"

export default function AppToolbar() {
  return (
    <AppBar position="static" className="App-Toolbar">
      <Toolbar>
        <Button color="inherit" component={Link} to={PAGE_ROUTES.home}>
          <Typography variant="h6">Movie Library</Typography>
        </Button>
        <Button color="inherit" component={Link} to={PAGE_ROUTES.toFilter}>
          To Filter
        </Button>
        <Button color="inherit" component={Link} to={PAGE_ROUTES.move}>
          Move Files
        </Button>
      </Toolbar>
    </AppBar>
  )
}
