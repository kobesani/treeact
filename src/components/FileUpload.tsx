import { Button, TextField, Grid } from "@mui/material";
import { UploadFile } from "@mui/icons-material";
import { useAppStore } from "../store";

const FileUpload = () => {
  // const [file, setFile] = useState<File | null>(null);
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
    <Grid container alignItems="center" spacing={2}>
      <Grid item sx={{ display: "none" }}>
        <input id="fileInput" type="file" onChange={handleFileChange} />
      </Grid>
      <Grid item>
        <TextField
          variant="outlined"
          label="Selected File"
          value={file ? file.name : "Select a file..."}
          InputProps={{
            readOnly: true,
          }}
          helperText={file ? `bytes: ${file.size}` : "bytes: 0"}
        />
      </Grid>
      <Grid item pb={3}>
        <Button
          variant="contained"
          startIcon={<UploadFile />}
          onClick={handleUploadClick}
        >
          Upload File
        </Button>
      </Grid>
    </Grid>
  );
};

export default FileUpload;
