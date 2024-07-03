import {
  ReactNode,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { SvgDimensions, SvgDimensionsContext } from "../hooks/SvgDimensions";

interface SvgDimensionsProviderProps {
  children: ReactNode;
}

// Wrap the component with forwardRef to accept a ref from the parent
const SvgDimensionsProvider = forwardRef<
  SVGSVGElement,
  SvgDimensionsProviderProps
>(({ children }, ref) => {
  const [dimensions, setDimensions] = useState<SvgDimensions>({
    width: 0,
    height: 0,
  });

  // Create an internal ref for the SVG element
  const svgRef = useRef<SVGSVGElement>(null);

  // Use useImperativeHandle to expose the internal svgRef to the parent component
  useImperativeHandle(ref, () => svgRef.current as SVGSVGElement);

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
});

export default SvgDimensionsProvider;
