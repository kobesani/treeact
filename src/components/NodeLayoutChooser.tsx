import { Button, ButtonGroup, Grid } from "@mui/material";

import { useAppStore } from "../state/AppStore";

const NodeLayoutChooser = () => {
  const { nodeStyle, setNodeStyle } = useAppStore((state) => ({
    nodeStyle: state.nodeStyle,
    setNodeStyle: state.setNodeStyle,
  }));

  return (
    <Grid container>
      <Grid item>
        <ButtonGroup>
          <Button
            onClick={() => setNodeStyle("angular")}
            variant={nodeStyle === "angular" ? "contained" : "outlined"}
            size="small"
            color="success"
          >
            Angular
          </Button>
          <Button
            onClick={() => setNodeStyle("squared")}
            variant={nodeStyle === "squared" ? "contained" : "outlined"}
            size="small"
            color="success"
          >
            Squared
          </Button>
        </ButtonGroup>
      </Grid>
    </Grid>
  );
};

export default NodeLayoutChooser;
