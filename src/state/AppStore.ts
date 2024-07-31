import { create } from "zustand";

import {
  FilePickerSlice,
  SvgCanvasSlice,
  ThemeControllerSlice,
  TreeSlice,
} from "./SliceTypes";

import {
  createFileSlice,
  createSvgCanvasSlice,
  createThemeControllerSlice,
  createTreeSlice,
} from "./SliceCreators";

export const useAppStore = create<
  FilePickerSlice & SvgCanvasSlice & ThemeControllerSlice & TreeSlice
>()((...storeArgs) => ({
  ...createFileSlice(...storeArgs),
  ...createSvgCanvasSlice(...storeArgs),
  ...createThemeControllerSlice(...storeArgs),
  ...createTreeSlice(...storeArgs),
}));
