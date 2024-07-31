import { StateCreator } from "zustand";

import {
  FilePickerSlice,
  SvgCanvasSlice,
  ThemeControllerSlice,
  TreeSlice,
} from "./SliceTypes";
import { Tree } from "../utils/Tree/Node";
import { NewickParser } from "../utils/Tree/Parser";
import { NewickLexer } from "../utils/Tree/Lexer";
import { LexException, ParseException } from "../utils/Tree/Exceptions";

export const createFileSlice: StateCreator<
  FilePickerSlice & SvgCanvasSlice,
  [],
  [],
  FilePickerSlice
> = (set) => ({
  file: null,
  setFile: (newFile) => set({ file: newFile }),
});

export const createSvgCanvasSlice: StateCreator<SvgCanvasSlice> = (set) => ({
  svgRef: null,
  setSvgRef: (ref) => set({ svgRef: ref }),
  height: 0,
  width: 0,
  setDimensions: (w, h) => set({ height: h, width: w }),
});

export const createThemeControllerSlice: StateCreator<ThemeControllerSlice> = (
  set
) => ({
  style: "dark",
  setStyle: (newStyle) => set({ style: newStyle }),
  nodeStyle: "squared",
  setNodeStyle: (newStyle: "angular" | "squared") =>
    set({ nodeStyle: newStyle }),
});

export const createTreeSlice: StateCreator<TreeSlice> = (set, get) => ({
  newick: null,
  tree: null,
  nodes: [],
  parseError: null,
  setNewick: (newNewick: string) => set({ newick: newNewick }),
  setTree: () => {
    const newickString = get().newick;
    console.log(`from setTree: ${newickString}`);
    if (!newickString) {
      return;
    }
    let parsedTree: Tree | null;
    try {
      const lexer = new NewickLexer(newickString);
      const parser = new NewickParser(lexer.lex());
      parsedTree = parser.parseTree();
      get().setParseError(null);
    } catch (error) {
      if (error instanceof ParseException || error instanceof LexException) {
        get().setParseError("Unable to parse tree");
      } else {
        get().setParseError("Unable to lex tree");
      }
      parsedTree = null;
    }
    set({ tree: parsedTree, nodes: parsedTree?.getAllNodes("preorder") || [] });
    console.log(get().tree);
  },
  setParseError: (newParseError: string | null) =>
    set({ parseError: newParseError }),
});
