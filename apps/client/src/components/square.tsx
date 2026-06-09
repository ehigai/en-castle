import { cn } from "@/lib/utils"
import { useDroppable } from "@dnd-kit/core"

export default function Square({
  notation,
  isSelected,
  isHighlighted,
  isLastMove,
  hasPiece,
  onClick,
}: {
  notation: string
  isSelected?: boolean
  isHighlighted?: boolean
  isLastMove?: boolean
  hasPiece?: boolean
  onClick?: () => void
}) {
  const { setNodeRef } = useDroppable({
    id: notation,
  })

  return (
    <div
      ref={setNodeRef}
      onClick={onClick}
      className={cn(
        "relative flex aspect-square w-full items-center justify-center cursor-pointer select-none",
        isSelected && "after:absolute after:inset-0 after:bg-board-selected/50 after:pointer-events-none",
        isLastMove && "before:absolute before:inset-0 before:bg-yellow-500/30 before:pointer-events-none"
      )}
    >
      {isHighlighted && (
        <div
          className={cn(
            "absolute pointer-events-none rounded-full",
            hasPiece
              ? "inset-1 border-4 border-board-highlight/50"
              : "h-6 w-6 bg-board-highlight/50"
          )}
        />
      )}
    </div>
  )
}


