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
  defaults?: PhylogenyDefaults;
}

const Phylogeny = ({
  tree,
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

  // // prepping horizontal axis domain and range
  // // add a little space for a small piece of branch for the root
  // const domainLowerBound = -defaults.rootBranchLength;
  // const domainUpperBound = tree.getMaxDistanceToRoot();
  // const rangeLowerBound = defaults.paddingLeft;
  // // adjusting upper bound for adding node labels for the leaf nodes
  // // leaves maximum space for a label, plus default padding and node label padding between tips
  // const rangeUpperBound =
  //   width -
  //   (defaults.paddingRight + defaults.nodeLabelPadding + maxLabelLength);

  // const horizontalAxisMapping = useLinearScale({
  //   domain: [domainLowerBound, domainUpperBound],
  //   range: [rangeLowerBound, rangeUpperBound],
  // });

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
        {tree.getAllNodes("preorder").map((node, index) => (
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
