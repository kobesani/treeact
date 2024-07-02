import { useEffect, useRef } from "react";
import { Node } from "../utils/Tree/Node";
import { useTheme } from "@mui/material";

export interface NodeLayoutProps {
  node: Node;
  verticalAxisMapping: (domainValue: number) => number;
  horizontalAxisMapping: (domainValue: number) => number;
  leafNodeIndexMap: Map<Node, number>;
  defaultBranchLength: number;
  nodeLabelPadding: number;
}

const NodeLayout = ({
  node,
  verticalAxisMapping,
  horizontalAxisMapping,
  leafNodeIndexMap,
  defaultBranchLength,
  nodeLabelPadding,
}: NodeLayoutProps) => {
  const horizontalLineRef = useRef<SVGLineElement | null>(null);
  const verticalLineRef = useRef<SVGLineElement | null>(null);

  const theme = useTheme();

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

  /*
    Prepare to draw vertical lines (pipes below)
     ____________
    |
    |
    |
    |____________

    The min and max of the child heights are used to draw a vertical line
    for the parent node, which connects the branches of the children.
  */

  const verticalPositionsChildren = node.children.map((child) =>
    verticalAxisMapping(getVerticalPositioning(child))
  );

  const minVerticalPosition =
    verticalPositionsChildren.length !== 0
      ? Math.min(...verticalPositionsChildren)
      : 0;

  const maxVerticalPosition =
    verticalPositionsChildren.length !== 0
      ? Math.max(...verticalPositionsChildren)
      : 0;

  useEffect(() => {
    let start: number | null = null;
    const duration = 500; // Duration of animation in milliseconds
    console.log(`XDDD === ${horizontalLineRef.current}`);

    const animateHorizontalLine = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      if (horizontalLineRef.current) {
        const progress = Math.min(elapsed / duration, 1);
        const currentX =
          finalHorizontalPosition -
          (finalHorizontalPosition - initialHorizontalPosition) * progress;
        horizontalLineRef.current.setAttribute("x1", currentX.toString());

        if (progress < 1) {
          requestAnimationFrame(animateHorizontalLine);
        }
      }
    };

    requestAnimationFrame(animateHorizontalLine);
  }, [node]);

  useEffect(() => {
    if (verticalPositionsChildren.length === 0) return;

    let start: number | null = null;
    const duration = 500; // Duration of animation in milliseconds

    const animateVerticalLine = (timestamp: number) => {
      if (!start) start = timestamp;
      const elapsed = timestamp - start;

      if (verticalLineRef.current) {
        const progress = Math.min(elapsed / duration, 1);
        const currentY1 =
          verticalPosition +
          (maxVerticalPosition - verticalPosition) * progress;
        const currentY2 =
          verticalPosition +
          (minVerticalPosition - verticalPosition) * progress;
        // verticalLineRef.current.setAttribute("y2", currentY.toString());
        verticalLineRef.current.setAttribute("y1", currentY1.toString());
        verticalLineRef.current.setAttribute("y2", currentY2.toString());

        if (progress < 1) {
          requestAnimationFrame(animateVerticalLine);
        }
      }
    };

    requestAnimationFrame(animateVerticalLine);
  }, [node]);

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
            fill={theme.palette.getContrastText(theme.palette.background.default)}
            x={initialHorizontalPosition + nodeLabelPadding}
            y={verticalPosition}
          >
            {node.label}
          </text>
        ) : null}
        {/* 
          if there are no children, this is an internal node, we want to render a
          vertical line at the initial position of the node to connect the nodes
          for the children
        */}
        {verticalPositionsChildren.length !== 0 ? (
          <line
            ref={verticalLineRef}
            id={`tree-node-${node.id}-vertical-delimiter`}
            x1={initialHorizontalPosition}
            y1={minVerticalPosition}
            x2={initialHorizontalPosition}
            y2={maxVerticalPosition}
            stroke={theme.palette.getContrastText(theme.palette.background.default)}
            strokeWidth={3}
          />
        ) : null}
        <line
          ref={horizontalLineRef}
          id={`tree-node-${node.id}-branch-delimiter`}
          x1={initialHorizontalPosition}
          x2={finalHorizontalPosition}
          y1={verticalPosition}
          y2={verticalPosition}
          stroke={theme.palette.getContrastText(theme.palette.background.default)}
          strokeWidth={3}
          strokeLinecap="round"
        />
      </g>
    </>
  );
};

export default NodeLayout;
