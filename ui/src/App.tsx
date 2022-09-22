import React from "react"
import "./App.css"
import { BrowserRouter, Link, Route, Routes } from "react-router-dom"
import { AppBar, Button, createTheme, ThemeProvider, Toolbar, Typography } from "@mui/material"
import ToFilter from "./pages/ToFilter"
import FilterMovie from "./pages/filterMovie/FilterMovie"
import Home from "./pages/home/Home"
import { PAGE_ROUTES } from "./utils/AppConstants"
import Test from "./pages/Test"

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
})

function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <BrowserRouter>
        <div className="App">
          <AppBar position="static" className="App-Toolbar">
            <Toolbar>
              <Button color="inherit" component={Link} to={PAGE_ROUTES.home}>
                <Typography variant="h6">Movie Library</Typography>
              </Button>
              <Button color="inherit" component={Link} to={PAGE_ROUTES.toFilter}>
                To Filter
              </Button>
            </Toolbar>
          </AppBar>
          <div className="Routes">
            <Routes>
              <Route path={PAGE_ROUTES.toFilter} element={<ToFilter />} />
              <Route path={PAGE_ROUTES.filterMovie} element={<FilterMovie />} />
              <Route path="/test" element={<Test />} />
              <Route path="/*" element={<Home />} />
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </ThemeProvider>
  )
}

export default App
