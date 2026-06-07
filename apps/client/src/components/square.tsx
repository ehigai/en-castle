import { cn } from "@/lib/utils"
import { useThemeStore } from "@/store/theme.store"
import type { IPiece } from "@/types"

export interface Square {
  notation: string
  piece: IPiece | null
}

export default function Square({ square }: { square: Square }) {
  const pieceTheme = useThemeStore((state) => state.pieceTheme)
  const file = square.notation.charCodeAt(0) - 97
  const rank = parseInt(square.notation[1] as string, 10) - 1
  const isLightSquare = (file + rank) % 2 !== 0

  return (
    <div
      className={cn(
        isLightSquare ? "bg-gray-50" : "bg-green-700",
        "flex aspect-square w-26! items-center justify-center border"
      )}
    >
      {square.piece && (
        <img
          src={`/pieces/${pieceTheme}/${square.piece}.svg`}
          alt={square.piece}
          className="h-full w-full object-contain"
        />
      )}
    </div>
  )
}
