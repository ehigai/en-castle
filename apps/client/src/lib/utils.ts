import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FixedLengthArray, IPiece } from "@/types"
import type { Square } from "@/components/square"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function createBoard(): FixedLengthArray<Square, 64> {
  const bd: Square[] = []
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
  for (let rank = 8; rank >= 1; rank--) {
    for (let file = 0; file < 8; file++) {
      const squareId = files[file]! + rank
      let piece: IPiece | null = null

      if (rank === 2) {
        piece = "wP"
      } else if (rank === 7) {
        piece = "bP"
      } else if (rank === 1 || rank === 8) {
        const isWhite = rank === 1
        const prefix = isWhite ? "w" : "b"
        const backRank = ["R", "N", "B", "Q", "K", "B", "N", "R"] as const
        piece = `${prefix}${backRank[file]!}` as IPiece
      }

      bd.push({
        notation: squareId,
        piece,
      })
    }
  }
  return bd as unknown as FixedLengthArray<Square, 64>
}
