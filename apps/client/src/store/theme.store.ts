import { create } from "zustand"

export type PieceTheme = "alpha" | "cburnett"
export type BoardTheme = "blue"

interface ThemeState {
  pieceTheme: PieceTheme
  boardTheme: BoardTheme
  setPieceTheme: (theme: PieceTheme) => void
  setBoardTheme: (theme: BoardTheme) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  pieceTheme: "alpha",
  boardTheme: "blue",
  setPieceTheme: (theme) => set({ pieceTheme: theme }),
  setBoardTheme: (theme) => set({ boardTheme: theme }),
}))
