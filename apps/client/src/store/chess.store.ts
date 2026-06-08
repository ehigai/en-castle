import { create } from "zustand"
import { STARTING_FEN } from "@/constants"

interface ChessState {
  fen: string
  history: string[]
  setFen: (fen: string) => void
  addMove: (move: string) => void
  resetGame: () => void
}

export const useChessStore = create<ChessState>((set) => ({
  fen: STARTING_FEN,
  history: [],
  setFen: (fen) => set({ fen }),
  addMove: (move) => set((state) => ({ history: [...state.history, move] })),
  resetGame: () => set({ fen: STARTING_FEN, history: [] }),
}))
