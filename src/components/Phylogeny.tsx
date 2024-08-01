import { Grid, useTheme } from "@mui/material";

import { useAppStore } from "../state/AppStore";
import { useLinearScale } from "../hooks/LinearScale";
import useWidthOptimizer from "../hooks/OptimizeWidth";


import { Node } from "../utils/Tree/Node";
import AngularNodeLayout from "./AngularNode";
import NodeLayout from "./Node";
import SvgCanvas from "./SvgCanvas";

interface PhylogenyDefaults {
  rootBranchLength: number;
  nodeLabelPadding: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
}

interface PhylogenySvgProps {
  defaults?: PhylogenyDefaults;
}

const Phylogeny = () => {
  const tree = useAppStore((state) => state.tree);

  return (
    <Grid container alignItems="center" spacing={2}>
      <Grid
        item
        xs={12}
        sm={12}
        md={12}
        lg={12}
        className="svg-container"
        sx={{ height: 600 }}
      >
        <SvgCanvas>{tree ? <PhylogenySvg /> : null}</SvgCanvas>
      </Grid>
    </Grid>
  );
};

const PhylogenySvg = ({
  defaults = {
    rootBranchLength: 1,
    nodeLabelPadding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 0,
    paddingBottom: 0,
  },
}: PhylogenySvgProps) => {
  const width = useAppStore((state) => state.width);
  const height = useAppStore((state) => state.height);
  const nodeStyle = useAppStore((state) => state.nodeStyle);
  // TODO: refactor phylogeny svg and phylogeny component, should just be one
  // tree here is definitely not null, bc of conditional rendering in parent component
  const tree = useAppStore((state) => state.tree!!);
  const theme = useTheme();

  console.log(`PhylogenySvg: ${width} ${height}`);
  console.log({
    tree: tree,
    svgWidth:
      width -
      defaults.paddingLeft -
      defaults.paddingRight -
      defaults.nodeLabelPadding -
      defaults.rootBranchLength,
    dummyRootBranchLength: defaults.rootBranchLength,
    maxIters: 100,
    precision: 0.1,
    fontSize: 16,
  });

  const horizontalLengthScalar = useWidthOptimizer({
    tree: tree,
    svgWidth:
      width -
      defaults.paddingLeft -
      defaults.paddingRight -
      defaults.nodeLabelPadding -
      defaults.rootBranchLength,
    dummyRootBranchLength: defaults.rootBranchLength,
    maxIters: 100,
    precision: 0.1,
    fontSize: 16,
  });

  const leafNodes = tree.getLeafNodes();

  const horizontalAxisMapping = (n: number) =>
    horizontalLengthScalar * (n + defaults.rootBranchLength) +
    defaults.paddingLeft;

  const verticalAxisMapping = useLinearScale({
    domain: [0, leafNodes.length],
    range: [defaults.paddingTop, height - defaults.paddingBottom],
  });

  const leafNodesToIndex = new Map<Node, number>(
    leafNodes.map((node, index) => [node, index])
  );

  const nodes = tree.getAllNodes("preorder");

  return (
    <>
      <g>
        {theme.palette.mode === "dark" ? (
          <rect
            id="background"
            height="100%"
            width="100%"
            fill={theme.palette.background.default}
          ></rect>
        ) : null}
      </g>
      <g>
        {nodeStyle === "angular"
          ? nodes.map((node, index) => (
              <AngularNodeLayout
                key={index}
                node={node}
                verticalAxisMapping={verticalAxisMapping}
                horizontalAxisMapping={horizontalAxisMapping}
                leafNodeIndexMap={leafNodesToIndex}
                defaultBranchLength={defaults.rootBranchLength}
                nodeLabelPadding={defaults.nodeLabelPadding}
              />
            ))
          : nodes.map((node, index) => (
              <NodeLayout
                key={index}
                node={node}
                verticalAxisMapping={verticalAxisMapping}
                horizontalAxisMapping={horizontalAxisMapping}
                leafNodeIndexMap={leafNodesToIndex}
                defaultBranchLength={defaults.rootBranchLength}
                nodeLabelPadding={defaults.nodeLabelPadding}
              />
            ))}
      </g>
    </>
  );
};

export default Phylogeny;
