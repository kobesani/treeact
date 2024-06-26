import { ReactNode, useEffect, useRef, useState } from "react";

import { SvgDimensions, SvgDimensionsContext } from "../hooks/SvgDimensions";

interface SvgDimensionsProviderProps {
  children: ReactNode;
}

const SvgDimensionsProvider = ({ children }: SvgDimensionsProviderProps) => {
  const [dimensions, setDimensions] = useState<SvgDimensions>({
    width: 0,
    height: 0,
  });
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (svgRef.current) {
        const { width, height } = svgRef.current.getBoundingClientRect();
        setDimensions({ width, height });
      }
    };

    updateDimensions();

    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <SvgDimensionsContext.Provider value={dimensions}>
      <svg
        ref={svgRef}
        style={{ width: "100%", height: "100%" }}
        // viewBox="0 0 600 600"
        // preserveAspectRatio="xMidYMid slice"
        // preserveAspectRatio="none"
      >
        {children}
      </svg>
    </SvgDimensionsContext.Provider>
  );
};

export default SvgDimensionsProvider;
