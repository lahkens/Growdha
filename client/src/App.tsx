import { ThemeProvider, createTheme } from "@mui/material/styles"
import { useMemo } from "react"
import { themeSettings } from "./theme"
import { Box, CssBaseline } from "@mui/material"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import Navbar from "./scenes/navbar"
import Dashboard from "@/scenes/dashboard";
import Predictions from "@/scenes/predictions";
import Upload from "./scenes/upload/index";
import { useEffect, useState } from "react";

function App() {

    const [, setMessage] = useState("");

    useEffect(() => {
      fetch("https://appsail-50023410479.development.catalystappsail.in")
        .then((res) => res.json())
        .then((data) => setMessage(data.message));
    },[]);

  const theme = useMemo(() => createTheme(themeSettings), [])
    
  return (
      <div className="app">
        <BrowserRouter>
          <ThemeProvider theme={theme}>
              <CssBaseline/>
              <Box width="100%" height="100%" padding="1 rem 2rem 4rem 2rem">
                <Navbar />
                <Routes>
                   <Route path="/" 
                          element={<Dashboard></Dashboard>}/>
                   <Route path="/predictions"
                          element={<Predictions></Predictions>}/>
                    <Route path="/upload" 
                          element={<Upload></Upload>}/>

                </Routes>

              </Box>
          </ThemeProvider>
        </BrowserRouter>
      </div>
  )
}

export default App
