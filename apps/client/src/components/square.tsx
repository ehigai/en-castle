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
}: {
  id: string
  piece: IPiece
  pieceTheme: string
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
      className="h-full w-full object-contain cursor-grab active:cursor-grabbing touch-none"
    />
  )
}

export default function Square({ square }: { square: Square }) {
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
      className={cn(
        isLightSquare ? "bg-gray-50" : "bg-green-700",
        "flex aspect-square w-26! items-center justify-center border"
      )}
    >
      {square.piece && (
        <DraggablePiece
          id={square.notation}
          piece={square.piece}
          pieceTheme={pieceTheme}
        />
      )}
    </div>
  )
}

