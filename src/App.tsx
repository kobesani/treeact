import "./assets/css/App.css";

import { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import Phylogeny from "./components/Phylogeny";
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const App = () => {
  const [layout, setLayout] = useState<"squared" | "angular">("squared");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const themeHandler = (mode: "light" | "dark") => {
    setTheme(mode);
    return createTheme({
      palette: {
        mode: mode,
      },
    });
  };

  return (
    <ThemeProvider theme={createTheme({palette: {mode: theme}})}>
      <CssBaseline />
      <Grid
        container
        alignItems="center"
        flexDirection="row"
        spacing={2}
        padding={2}
      >
        <Grid item>
          <ButtonGroup>
            <Button
              onClick={() => themeHandler("light")}
              variant={theme === "light" ? "contained" : "outlined"}
              size="small"
              color="success"
            >
              <LightModeIcon />
            </Button>
            <Button
              onClick={() => themeHandler("dark")}
              variant={theme === "dark" ? "contained" : "outlined"}
              size="small"
              color="success"
            >
              <DarkModeIcon />
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item>
          <ButtonGroup>
            <Button
              onClick={() => setLayout("angular")}
              variant={layout === "angular" ? "contained" : "outlined"}
              size="small"
              color="success"
            >
              Angular
            </Button>
            <Button
              onClick={() => setLayout("squared")}
              variant={layout === "squared" ? "contained" : "outlined"}
              size="small"
              color="success"
            >
              Squared
            </Button>
          </ButtonGroup>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Phylogeny layout={layout} theme={theme} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default App;
