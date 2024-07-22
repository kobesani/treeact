import "./assets/css/App.css";

import { useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import ButtonGroup from "@mui/material/ButtonGroup";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { ListItemIcon, ListItemText } from "@mui/material";
import { ArrowDropDown, Check } from "@mui/icons-material";
import CssBaseline from "@mui/material/CssBaseline";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Radio from "@mui/material/Radio";

import FileUpload from "./components/FileUpload";
import Phylogeny from "./components/Phylogeny";
import { useAppStore } from "./store";

interface BasicMenuProps {
  options: string[];
  defaultValueIndex?: number;
}

const BasicMenu = ({ options, defaultValueIndex }: BasicMenuProps) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(
    defaultValueIndex ? defaultValueIndex : 0
  );
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  // const handleClickedItem = (option: string) => {
  //   // setAnchorEl(null);
  //   setSelectedIndex(options.findIndex((value) => value === option));
  // };

  const handleClickedItem = (index: number) => {
    setSelectedIndex(index);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <Button
        id="basic-button"
        aria-controls={open ? "basic-menu" : undefined}
        aria-haspopup="true"
        aria-expanded={open ? "true" : undefined}
        onClick={handleClick}
        variant="contained"
        size="medium"
        endIcon={<ArrowDropDown />}
      >
        Node Style
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleCloseMenu}
        MenuListProps={{
          "aria-labelledby": "basic-button",
        }}
      >
        {options.map((option, index) => (
          <MenuItem
            key={index}
            onClick={() => handleClickedItem(index)}
            sx={{ width: 150 }}
          >
            {/* {index === selectedIndex ? ( */}
              <ListItemIcon>
                <Radio
                  checked={index === selectedIndex}
                  value={option}
                  name="radio-button-selection"
                />
              </ListItemIcon>
            {/* ) : null} */}
            <ListItemText>{option}</ListItemText>
          </MenuItem>
        ))}
      </Menu>
    </div>
  );
};

const App = () => {
  const file = useAppStore((state) => state.file);
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

  console.log(`file: ${file?.name} ${file?.size}`);

  return (
    <ThemeProvider theme={createTheme({ palette: { mode: theme } })}>
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
        <Grid item>
          <BasicMenu options={["Angular", "Squared"]} defaultValueIndex={1} />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <FileUpload />
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Phylogeny layout={layout} theme={theme} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );
};

export default App;
