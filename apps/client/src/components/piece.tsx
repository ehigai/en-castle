import { useDraggable } from "@dnd-kit/core"
import type { IPiece } from "@/types"
import { useThemeStore } from "@/store/theme.store"

export interface PieceProps {
  id: string
  piece: IPiece
  pieceTheme: string
  onClick?: () => void
}

export function DraggablePiece({ id, piece, pieceTheme, onClick }: PieceProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  })
  const flipped = useThemeStore((state) => state.flipped)

  const file = id.charCodeAt(0) - 97
  const rank = parseInt(id[1], 10) - 1

  const displayFile = flipped ? 7 - file : file
  const displayRank = flipped ? rank : 7 - rank

  const left = `${displayFile * 12.5}%`
  const top = `${displayRank * 12.5}%`

  const style = {
    position: "absolute" as const,
    left,
    top,
    width: "12.5%",
    height: "12.5%",
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    zIndex: isDragging ? 1000 : 10,
    opacity: isDragging ? 0.6 : 1,
    transition: isDragging ? "none" : "all 0.2s ease-out",
  }

  return (
    <img
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      src={`/pieces/${pieceTheme}/${piece}.svg`}
      alt={piece}
      onClick={onClick}
      className="cursor-grab touch-none object-contain p-1 active:cursor-grabbing"
    />
  )
}
