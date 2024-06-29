import { useState } from "react";
import { useLinearScale } from "../hooks/LinearScale";
import { useSvgDimensions } from "../hooks/SvgDimensions";
import useWidthOptimizer from "../hooks/OptimizeWidth";

import { Node, Tree } from "../utils/Tree/Node";
import { NewickLexer } from "../utils/Tree/Lexer";
import { NewickParser } from "../utils/Tree/Parser";

import NodeLayout from "./Node";
import SvgDimensionsProvider from "../providers/SvgDimensionsProvider";
import AngularNodeLayout from "./AngularNode";

interface PhylogenyDefaults {
  rootBranchLength: number;
  nodeLabelPadding: number;
  paddingLeft: number;
  paddingRight: number;
  paddingTop: number;
  paddingBottom: number;
}

interface PhylogenyProps {
  layout: "squared" | "angular";
}

interface PhylogenySvgProps {
  tree: Tree;
  nodes: Node[];
  layout: "squared" | "angular";
  defaults?: PhylogenyDefaults;
}

const Phylogeny = ({ layout }: PhylogenyProps) => {
  console.log(layout);
  const exampleTree =
    "(ant:17, ((bat:31, cow:22):25, dog:22):10, ((elk:33, fox:12):10, giraffe:15):11);";
  const [newick, setNewick] = useState(exampleTree);
  const [tree, setTree] = useState<Tree | null>(null);
  const [nodes, setNodes] = useState<Node[]>([]);

  const parseTree = () => {
    const lexer = new NewickLexer(newick);
    const parser = new NewickParser(lexer.lex());
    const parsedTree = parser.parseTree();
    setTree(parsedTree ? parsedTree : null);
    setNodes(parsedTree?.getAllNodes("preorder") || []);
    parsedTree
      ?.getAllNodes("preorder")
      .forEach((node) =>
        console.log(
          node.id,
          node.label,
          node.branchLength,
          node.isRoot(),
          node.isLeaf(),
          node.getDistanceToRoot()
        )
      );
  };

  return (
    <>
      <div style={{ color: "white" }}>
        Enter a newick tree:{" "}
        <input
          value={newick}
          onChange={(event) => setNewick(event.target.value)}
        />
        <button onClick={parseTree}>Submit</button>
      </div>
      <div
        id="svg-container-1"
        className="svg-container"
        style={{ height: "600px", width: "100%" }}
      >
        <SvgDimensionsProvider>
          {tree ? (
            <PhylogenySvg tree={tree} nodes={nodes} layout={layout} />
          ) : null}
        </SvgDimensionsProvider>
      </div>
    </>
  );
};

const PhylogenySvg = ({
  tree,
  nodes,
  layout,
  defaults = {
    rootBranchLength: 1,
    nodeLabelPadding: 5,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 0,
    paddingBottom: 0,
  },
}: PhylogenySvgProps) => {
  const { width, height } = useSvgDimensions();

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

  return (
    <>
      <g>
        {layout === "angular"
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
