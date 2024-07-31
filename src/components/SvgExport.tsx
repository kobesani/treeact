import { useState } from "react";
import { useAppStore } from "../state/AppStore";
import { Button, Grid, TextField } from "@mui/material";

const SvgExport = () => {
  const svgRef = useAppStore((state) => state.svgRef);

  const [exportFilename, setExportFilename] = useState<string>("example.svg");

  const exportSvg = (filename: string) => {
    if (!svgRef) return;

    const svgElement = svgRef.current;
    const serializer = new XMLSerializer();
    const svgString = serializer.serializeToString(svgElement!!);
    const blob = new Blob([svgString], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);

    const downloadLink = document.createElement("a");
    downloadLink.href = url;
    downloadLink.download = filename;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
    URL.revokeObjectURL(url);
  };

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid item>
        <TextField
          label="SVG Filename"
          variant="outlined"
          value={exportFilename}
          onChange={(event) => setExportFilename(event.target.value)}
          inputProps={{ spellCheck: false }}
          helperText="Enter a filename for export."
        />
      </Grid>
      <Grid item pb={3}>
        <Button
          onClick={() => exportSvg(exportFilename)}
          variant="contained"
          size="medium"
        >
          Export
        </Button>
      </Grid>
    </Grid>
  );
};

export default SvgExport;
