import { Node, Tree } from "../utils/Tree/Node";

export interface FilePickerSlice {
  file: File | null;
  setFile: (newFile: File) => void;
}

export interface SvgCanvasSlice {
  svgRef: React.RefObject<SVGSVGElement> | null;
  setSvgRef: (ref: React.RefObject<SVGSVGElement>) => void;
  height: number;
  width: number;
  setDimensions: (w: number, h: number) => void;
}

export interface ThemeControllerSlice {
  style: "light" | "dark";
  nodeStyle: "angular" | "squared";
  setStyle: (newStyle: "light" | "dark") => void;
  setNodeStyle: (newStyle: "angular" | "squared") => void;
}

export interface TreeSlice {
  newick: string | null;
  tree: Tree | null;
  nodes: Node[];
  parseError: string | null;
  setNewick: (newNewick: string) => void;
  setTree: () => void;
  setParseError: (newParseError: string | null) => void;
}
