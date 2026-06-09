import type { IPiece, Square } from "@/types"
import { useThemeStore } from "@/store/theme.store"
import { cn } from "@/lib/utils"

type PieceType = IPiece extends `${"w" | "b"}${infer Type}` ? Type : never

const getPieceType = (piece: IPiece): PieceType => piece.slice(1) as PieceType

const PIECE_VALUES: Record<PieceType, number> = {
  P: 1,
  N: 3,
  B: 3,
  R: 5,
  Q: 9,
  K: 0,
}

const INITIAL_COUNTS: Record<IPiece, number> = {
  wP: 8,
  wN: 2,
  wB: 2,
  wR: 2,
  wQ: 1,
  wK: 1,
  bP: 8,
  bN: 2,
  bB: 2,
  bR: 2,
  bQ: 1,
  bK: 1,
}

interface CapturedPiecesProps {
  board: Square[]
  color: "w" | "b"
}

export function CapturedPieces({ board, color }: CapturedPiecesProps) {
  const pieceTheme = useThemeStore((state) => state.pieceTheme)

  // Count current pieces on board
  const currentCounts: Record<string, number> = {}
  board.forEach((sq) => {
    if (sq.piece) {
      currentCounts[sq.piece] = (currentCounts[sq.piece] || 0) + 1
    }
  })

  // Calculate captured pieces of the OPPOSITE color
  const oppositeColor = color === "w" ? "b" : "w"
  const captured: IPiece[] = []
  let score = 0
  let opponentScore = 0

  // Calculate material for both sides to get the relative advantage
  Object.entries(INITIAL_COUNTS).forEach(([p, count]) => {
    const piece = p as IPiece
    const current = currentCounts[piece] || 0
    const missing = count - current

    const pColor = piece[0]
    const pieceType = getPieceType(piece)
    const val = PIECE_VALUES[pieceType] || 0

    if (pColor === oppositeColor) {
      for (let i = 0; i < missing; i++) {
        captured.push(piece)
      }
    }

    if (pColor === "w") score += (currentCounts[piece] || 0) * val
    else opponentScore += (currentCounts[piece] || 0) * val
  })

  // Group captured by type for better display
  const sortedCaptured = [...captured].sort((a, b) => {
    const valA = PIECE_VALUES[getPieceType(a)]
    const valB = PIECE_VALUES[getPieceType(b)]
    return valA - valB
  })

  const relativeScore =
    color === "w" ? score - opponentScore : opponentScore - score

  return (
    <div className="flex h-8 items-center gap-2">
      <div
        className={cn(
          "flex items-center overflow-visible px-1",
          sortedCaptured.length > 1 && "-space-x-3"
        )}
      >
        {sortedCaptured.map((piece, i) => (
          <img
            key={`${piece}-${i}`}
            src={`/pieces/${pieceTheme}/${piece}.svg`}
            alt={piece}
            className={cn(
              "h-7 w-7 object-contain drop-shadow-sm transition-transform hover:scale-110",
              piece[0] === "w"
                ? "drop-shadow-[0.5px_0.5px_0_rgba(0,0,0,0.5)]filter"
                : "drop-shadow-[0.5px_0.5px_0_rgba(255,255,255,0.8)] filter"
            )}
          />
        ))}
      </div>
      {relativeScore > 0 && (
        <span className="ml-1 text-xs font-bold text-muted-foreground">
          +{relativeScore}
        </span>
      )}
    </div>
  )
}
