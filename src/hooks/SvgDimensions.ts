import { createContext, useContext } from "react";

export interface SvgDimensions {
  width: number;
  height: number;
}

export const SvgDimensionsContext = createContext<SvgDimensions | undefined>(
  undefined
);

export const useSvgDimensions = (): SvgDimensions => {
  const context = useContext(SvgDimensionsContext);

  if (context === undefined) {
    throw new Error(
      "useSvgDimensions must be used within a SvgDimensionsProvider"
    );
  }

  return context;
};
