import { Node, Tree } from "../utils/Tree/Node";
import { useLinearScale } from "../hooks/LinearScale";
import { useSvgDimensions } from "../hooks/SvgDimensions";
import useWidthOptimizer from "../hooks/OptimizeWidth";

import NodeLayout from "./Node";

interface PhylogenyDefaults {
  rootBranchLength: number;
  nodeLabelPadding: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
}

interface PhylogenyProps {
  tree: Tree;
  nodes: Node[];
  defaults?: PhylogenyDefaults;
}

const Phylogeny = ({
  tree,
  nodes,
  defaults = {
    rootBranchLength: 1,
    nodeLabelPadding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 20,
    paddingBottom: 20,
  },
}: PhylogenyProps) => {
  const { width, height } = useSvgDimensions();

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

  return (
    <>
      <g>
        {nodes.map((node, index) => (
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
