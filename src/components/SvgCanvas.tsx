import { ReactNode, useEffect, useRef } from "react";
import { useAppStore } from "../state/AppStore";

interface SvgCanvasProps {
  children: ReactNode | ReactNode[];
}

const SvgCanvas = ({ children }: SvgCanvasProps) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const setSvgRef = useAppStore((state) => state.setSvgRef);
  const setDimensions = useAppStore((state) => state.setDimensions);

  const updateDimensions = () => {
    if (svgRef.current) {
      const { width, height } = svgRef.current.getBoundingClientRect();
      setDimensions(width, height);
    }
  };

  useEffect(() => {
    // set reference on initial render
    setSvgRef(svgRef);
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
  });

  return (
    <svg id="svg-tree-plot" ref={svgRef} style={{ width: "100%", height: "100%" }}>
      {children}
    </svg>
  );
};

export default SvgCanvas;
