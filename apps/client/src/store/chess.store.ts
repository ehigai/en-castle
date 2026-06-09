import { create } from "zustand"
import { STARTING_FEN } from "@/constants"

interface ChessState {
  initialFen: string
  fen: string
  history: string[]
  viewIndex: number
  setFen: (fen: string) => void
  makeMove: (move: string, nextFen: string) => void
  resetGame: () => void
  setViewIndex: (index: number) => void
}

export const useChessStore = create<ChessState>((set) => ({
  initialFen: STARTING_FEN,
  fen: STARTING_FEN,
  history: [],
  viewIndex: 0,
  setFen: (fen) => set({ initialFen: fen, fen, history: [], viewIndex: 0 }),
  makeMove: (move, nextFen) =>
    set((state) => {
      const newHistory = [...state.history, move]
      return {
        fen: nextFen,
        history: newHistory,
        viewIndex: newHistory.length,
      }
    }),
  resetGame: () =>
    set({
      initialFen: STARTING_FEN,
      fen: STARTING_FEN,
      history: [],
      viewIndex: 0,
    }),
  setViewIndex: (index) => set({ viewIndex: index }),
}))

