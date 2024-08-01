import { useEffect, useState } from "react";
import {
  Button,
  Grid,
  ToggleButtonGroup,
  ToggleButton,
  TextField,
} from "@mui/material";
import { useAppStore } from "../state/AppStore";

const RawTextInput = () => {
  const { newick, setNewick, setTree } = useAppStore((state) => ({
    newick: state.newick,
    setNewick: state.setNewick,
    setTree: state.setTree,
  }));

  // TODO: remove this useEffect later, just for debugging
  useEffect(
    () =>
      setNewick(
        "(ant:17, ((bat:31, cow:22):25, dog:22):10, ((elk:33, fox:12):10, giraffe:15):11);"
      ),
    [setNewick]
  );

  return (
    <>
      <Grid item xs={12} md={12} lg={12}>
        <TextField
          fullWidth
          error={false}
          label="Newick Tree"
          helperText={"Enter a valid newick tree."}
          color={"primary"}
          variant="outlined"
          value={newick ? newick : ""}
          onChange={(event) => setNewick(event.target.value)}
          multiline
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Button fullWidth color="primary" variant="contained" onClick={setTree}>
          Submit Raw Text
        </Button>
      </Grid>
    </>
  );
};

const UrlInput = () => {
  const [url, setUrl] = useState<string | null>(null);
  return (
    <>
      <Grid item xs={12} md={12} lg={12}>
        <TextField
          fullWidth
          error={false}
          label="URL"
          helperText={"Enter a url"}
          color={"primary"}
          variant="outlined"
          value={url ? url : ""}
          onChange={(event) => setUrl(event.target.value)}
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Button fullWidth color="primary" variant="contained">
          Submit URL
        </Button>
      </Grid>
    </>
  );
};

const FileInput = () => {
  const file = useAppStore((state) => state.file);
  const setFile = useAppStore((state) => state.setFile);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setFile(event.target.files[0]);
      console.log(`file size = ${event.target.files[0].size}`);
    }
  };

  const handleUploadClick = () => {
    document.getElementById("fileInput")?.click();
  };

  return (
    <>
      <Grid item sx={{ display: "none" }}>
        <input id="fileInput" type="file" onChange={handleFileChange} />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <TextField
          fullWidth
          variant="outlined"
          label="Selected File"
          value={file ? file.name : "Select a file..."}
          InputProps={{
            readOnly: true,
          }}
          helperText={
            file
              ? `File size: ${file.size / 10 ** 6} MB`
              : "Choose a file to import."
          }
        />
      </Grid>
      <Grid item xs={12} md={12} lg={12}>
        <Button
          fullWidth
          color="primary"
          variant="contained"
          onClick={handleUploadClick}
        >
          Choose File
        </Button>
      </Grid>
    </>
  );
};

const EntryInterface = () => {
  const [selected, setSelected] = useState<"string" | "file" | "url">("string");

  const handleInputMethodChange = (
    event: React.MouseEvent<HTMLElement>,
    newInputMethod: "string" | "file" | "url"
  ) => {
    event.preventDefault();
    // null check to force one of toggle buttons to always be selected
    if (newInputMethod !== null) {
      setSelected(newInputMethod);
    }
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={12} lg={12}>
        <ToggleButtonGroup
          fullWidth
          exclusive
          value={selected}
          onChange={handleInputMethodChange}
          color="primary"
          aria-label="select input method"
        >
          <ToggleButton value="string" aria-label="enter raw text">
            Text
          </ToggleButton>
          <ToggleButton value="file" aria-label="select a file">
            File
          </ToggleButton>
          <ToggleButton value="url" aria-label="enter a URL">
            URL
          </ToggleButton>
        </ToggleButtonGroup>
      </Grid>
      {selected === "string" ? (
        <RawTextInput />
      ) : selected === "url" ? (
        <UrlInput />
      ) : selected === "file" ? (
        <FileInput />
      ) : null}
    </Grid>
  );
};

export default EntryInterface;
