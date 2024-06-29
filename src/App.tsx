import "./assets/css/App.css";

import { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";

import Phylogeny from "./components/Phylogeny";

import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const App = () => {
  const [layout, setLayout] = useState<"squared" | "angular">("squared");

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Grid container alignItems="center" flexDirection="row" spacing={2}>
        <Grid item>
          <Button
            onClick={() => setLayout("squared")}
            variant="contained"
            size="large"
          >
            Squared
          </Button>
        </Grid>
        <Grid item>
          <Button
            onClick={() => setLayout("angular")}
            variant="contained"
            size="large"
          >
            Angular
          </Button>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Phylogeny layout={layout} />
        </Grid>
      </Grid>
    </ThemeProvider>  
  );
};

export default App;
