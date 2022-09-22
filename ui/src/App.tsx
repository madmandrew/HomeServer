import React from "react"
import "./App.css"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { createTheme, ThemeProvider } from "@mui/material"
import ToFilter from "./pages/ToFilter"
import FilterMovie from "./pages/filterMovie/FilterMovie"
import Home from "./pages/home/Home"
import { PAGE_ROUTES } from "./utils/AppConstants"
import Test from "./pages/Test"
import AppToolbar from "./components/App-Toolbar"
import Move from "./pages/move/Move"

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
          <AppToolbar />
          <div className="Routes">
            <Routes>
              <Route path={PAGE_ROUTES.toFilter} element={<ToFilter />} />
              <Route path={PAGE_ROUTES.filterMovie} element={<FilterMovie />} />
              <Route path={PAGE_ROUTES.move} element={<Move />} />
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
