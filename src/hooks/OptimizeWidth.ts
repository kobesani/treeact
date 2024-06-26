import { Tree } from "../utils/Tree/Node";

interface WidthOptimizerProps {
  tree: Tree;
  svgWidth: number;
  dummyRootBranchLength: number;
  fontSize: number;
  maxIters: number;
  precision: number;
}

const useWidthOptimizer = ({
  tree,
  svgWidth,
  dummyRootBranchLength,
  fontSize,
  maxIters,
  precision,
}: WidthOptimizerProps) => {
  const nodes = tree.getAllNodes("preorder");
  const textsToRender = nodes.map((node) => node.label);

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.style.position = "absolute";
  svg.style.visibility = "hidden";

  document.body.appendChild(svg);

  const nodeDistancesToRoot = nodes.map((node) => node.getDistanceToRoot());
  const nodeLabelLengths = textsToRender.map((text) => {
    if (text === undefined) return 0;
    const textElement = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "text"
    );
    textElement.textContent = text;
    textElement.setAttribute("font-size", fontSize.toString());

    svg.appendChild(textElement);

    return textElement.getComputedTextLength();
  });

  document.body.removeChild(svg);

  const initialMin = 1;
  const initialMax = svgWidth / tree.getMaxDistanceToRoot();

  const binarySearch = () => {
    let min = initialMin;
    let max = initialMax;
    let mid = (max + min) / 2;
    let iters = 0;

    console.log(`${iters}: ${min} ${max}`);

    while (Math.abs(max - min) > precision && iters < maxIters) {
      let value = Math.max(
        ...nodeDistancesToRoot.map(
          (distance, index) =>
            mid * (dummyRootBranchLength + distance) +
            nodeLabelLengths[index]
        )
      );

      if (value <= svgWidth) {
        min = mid;
      } else {
        max = mid;
      }
      mid = (max + min) / 2;
      iters += 1;
      console.log(`${iters}: ${min} ${max}`);
    }

    // return (max + min) / 2;
    return mid;
  };

  return binarySearch();
};

export default useWidthOptimizer;
