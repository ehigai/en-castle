import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import type { FixedLengthArray, IPiece, Square } from "@/types"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function fenToBoard(fen: string): FixedLengthArray<Square, 64> {
  const board: Square[] = []
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"]
  const parts = fen.split(" ")
  const boardPart = parts[0] || ""
  const rows = boardPart.split("/")

  for (let r = 0; r < 8; r++) {
    const rank = 8 - r
    const row = rows[r] || ""
    let fileIndex = 0
    for (let i = 0; i < row.length; i++) {
      const char = row[i]!
      if (/\d/.test(char)) {
        const numEmpty = parseInt(char, 10)
        for (let e = 0; e < numEmpty; e++) {
          board.push({
            notation: files[fileIndex]! + rank,
            piece: null,
          })
          fileIndex++
        }
      } else {
        const isWhite = char === char.toUpperCase()
        const pieceType = char.toUpperCase()
        const piece = `${isWhite ? "w" : "b"}${pieceType}` as IPiece
        board.push({
          notation: files[fileIndex]! + rank,
          piece,
        })
        fileIndex++
      }
    }
  }
  return board as unknown as FixedLengthArray<Square, 64>
}
