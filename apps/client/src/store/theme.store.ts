import { create } from "zustand"

export type PieceTheme = "alpha" | "cburnett"
export type BoardTheme = "blue" | "brown"

interface ThemeState {
  pieceTheme: PieceTheme
  boardTheme: BoardTheme
  flipped: boolean
  setPieceTheme: (theme: PieceTheme) => void
  setBoardTheme: (theme: BoardTheme) => void
  toggleFlipped: () => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  pieceTheme: "alpha",
  boardTheme: "brown",
  flipped: false,
  setPieceTheme: (theme) => set({ pieceTheme: theme }),
  setBoardTheme: (theme) => set({ boardTheme: theme }),
  toggleFlipped: () => set((state) => ({ flipped: !state.flipped })),
}))
