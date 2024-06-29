import { Node } from "../utils/Tree/Node";

export interface AngularNodeLayoutProps {
  node: Node;
  verticalAxisMapping: (domainValue: number) => number;
  horizontalAxisMapping: (domainValue: number) => number;
  leafNodeIndexMap: Map<Node, number>;
  defaultBranchLength: number;
  nodeLabelPadding: number;
}

const AngularNodeLayout = ({
  node,
  verticalAxisMapping,
  horizontalAxisMapping,
  leafNodeIndexMap,
  defaultBranchLength,
  nodeLabelPadding,
}: AngularNodeLayoutProps) => {
  const getVerticalPositioning = (node: Node): number => {
    if (node.isLeaf() && leafNodeIndexMap.has(node)) {
      // add 0.5 to center the tree in the SVG relative to padding
      return leafNodeIndexMap.get(node)! + 0.5;
    } else {
      return (
        node.children.reduce(
          (acc, child) => acc + getVerticalPositioning(child),
          0
        ) / node.children.length
      );
    }
  };

  // need to flip these around somehow so that the both are still in the domain range.
  const initialHorizontalPosition = horizontalAxisMapping(
    node.getDistanceToRoot()
  );
  const finalHorizontalPosition = horizontalAxisMapping(
    node.getDistanceToRoot() -
      (node.branchLength !== undefined
        ? node.branchLength
        : defaultBranchLength)
  );
  const verticalPosition = verticalAxisMapping(getVerticalPositioning(node));

  const parentVerticalPosition = node.parent
    ? verticalAxisMapping(getVerticalPositioning(node.parent))
    : verticalPosition;

  return (
    <>
      <g id={`tree-node-${node.id}`}>
        <circle
          r={5}
          cx={initialHorizontalPosition}
          cy={verticalPosition}
          fill="red"
        />
        {node.label !== undefined ? (
          <text
            id={`tree-node-${node.id}-label`}
            textAnchor="start"
            fontSize={16}
            dominantBaseline="middle"
            fill="white"
            x={initialHorizontalPosition + nodeLabelPadding}
            y={verticalPosition}
          >
            {node.label}
          </text>
        ) : null}
        <line
          id={`tree-node-${node.id}-branch-delimiter`}
          x1={initialHorizontalPosition}
          x2={finalHorizontalPosition}
          y1={verticalPosition}
          y2={parentVerticalPosition}
          stroke="white"
          strokeWidth={3}
          strokeLinecap="round"
        />
      </g>
    </>
  );
};

export default AngularNodeLayout;
