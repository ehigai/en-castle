import { create } from "zustand"

export type PieceTheme = "classic" | "neon" | "retro" | "3d"

interface ThemeState {
  pieceTheme: PieceTheme
  setPieceTheme: (theme: PieceTheme) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  pieceTheme: "classic",
  setPieceTheme: (theme) => set({ pieceTheme: theme }),
}))
