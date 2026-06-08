import { cn } from "@/lib/utils"
import { useThemeStore } from "@/store/theme.store"
import type { IPiece } from "@/types"
import { useDraggable, useDroppable } from "@dnd-kit/core"

export interface Square {
  notation: string
  piece: IPiece | null
}

function DraggablePiece({
  id,
  piece,
  pieceTheme,
  onClick,
}: {
  id: string
  piece: IPiece
  pieceTheme: string
  onClick?: () => void
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  })

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 1000,
        opacity: isDragging ? 0.6 : 1,
      }
    : undefined

  return (
    <img
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      src={`/pieces/${pieceTheme}/${piece}.svg`}
      alt={piece}
      onClick={onClick}
      className="h-full w-full object-contain cursor-grab active:cursor-grabbing touch-none"
    />
  )
}

export default function Square({
  square,
  isSelected,
  isHighlighted,
  onClick,
}: {
  square: Square
  isSelected?: boolean
  isHighlighted?: boolean
  onClick?: () => void
}) {
  const pieceTheme = useThemeStore((state) => state.pieceTheme)
  const file = square.notation.charCodeAt(0) - 97
  const rank = parseInt(square.notation[1] as string, 10) - 1
  const isLightSquare = (file + rank) % 2 !== 0

  const { setNodeRef } = useDroppable({
    id: square.notation,
  })

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        isLightSquare ? "bg-board-light" : "bg-board-dark",
        "relative flex aspect-square w-26! items-center justify-center border cursor-pointer select-none",
        isSelected && "after:absolute after:inset-0 after:bg-board-selected after:pointer-events-none"
      )}
    >
      {square.piece && (
        <DraggablePiece
          id={square.notation}
          piece={square.piece}
          pieceTheme={pieceTheme}
          onClick={onClick}
        />
      )}
      {isHighlighted && (
        <div
          className={cn(
            "absolute pointer-events-none rounded-full",
            square.piece
              ? "inset-1 border-4 border-board-highlight"
              : "h-6 w-6 bg-board-highlight"
          )}
        />
      )}
    </div>
  )
}


