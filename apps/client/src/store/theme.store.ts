import { create } from "zustand"

export type PieceTheme = "alpha" | "cburnett"

interface ThemeState {
  pieceTheme: PieceTheme
  setPieceTheme: (theme: PieceTheme) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  pieceTheme: "alpha",
  setPieceTheme: (theme) => set({ pieceTheme: theme }),
}))
