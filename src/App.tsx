import "./assets/css/App.css";

import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useAppStore } from "./state/AppStore";
import Phylogeny from "./components/Phylogeny";
import ResponsiveAppBar from "./components/AppBar";
import EntryInterface from "./components/InputTypeChooser";
import NodeLayoutChooser from "./components/NodeLayoutChooser";


const App = () => {
  const file = useAppStore((state) => state.file);
  const theme = useAppStore((state) => state.style);

  console.log(`file: ${file?.name} ${file?.size}`);

  return (
    <ThemeProvider theme={createTheme({ palette: { mode: theme } })}>
      <CssBaseline />
      <ResponsiveAppBar />
      <Grid
        container
        alignItems="center"
        flexDirection="row"
        spacing={2}
        padding={2}
      >
        <Grid item>
          <NodeLayoutChooser />
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={8}>
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <EntryInterface />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Phylogeny />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default App;
