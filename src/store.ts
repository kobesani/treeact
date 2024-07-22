import { create } from "zustand";

interface AppState {
  file: File | null;
  setFile: (newFile: File) => void;
}

export const useAppStore = create<AppState>((set) => ({
  file: null,
  setFile: (newFile: File) => set({file: newFile})
}))
