import "./assets/css/App.css";

import Grid from "@mui/material/Grid";
import CssBaseline from "@mui/material/CssBaseline";
import { ThemeProvider, createTheme } from "@mui/material/styles";

import { useAppStore } from "./state/AppStore";
import Phylogeny from "./components/Phylogeny";
import ResponsiveAppBar from "./components/AppBar";
import EntryInterface from "./components/InputTypeChooser";
import NodeLayoutChooser from "./components/NodeLayoutChooser";
import SvgExport from "./components/SvgExport";
import { IconButton } from "@mui/material";
import {
  KeyboardArrowLeftRounded,
  KeyboardArrowRightRounded,
} from "@mui/icons-material";

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
        <Grid item xs={0} sm={0} md={6} lg={8}>
          {/* Empty item to make EntryInterface not take up entire width on big screens*/}
        </Grid>
        <Grid item xs={12} sm={12} md={6} lg={4}>
          <EntryInterface />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Phylogeny />
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <SvgExport />
        </Grid>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <Grid
            container
            justifyContent="flex-end"
            alignItems="center"
            spacing={1}
          >
            <Grid item>
              <IconButton size="small" color="primary">
                <KeyboardArrowLeftRounded fontSize="large" />
              </IconButton>
            </Grid>
            <Grid item>FIX THEME CHANGING!</Grid>
            <Grid item>
              <IconButton size="small" color="primary">
                <KeyboardArrowRightRounded fontSize="large" />
              </IconButton>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default App;
