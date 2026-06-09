import { cn } from "@/lib/utils"
import { useDroppable } from "@dnd-kit/core"
import { useThemeStore } from "@/store/theme.store"
import useGlobalStore from "@/store/global.store"

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

  const flipped = useThemeStore((state) => state.flipped)
  const showNotations = useGlobalStore((state) => state.showNotations)

  const fileChar = notation[0]
  const rankChar = notation[1]
  const file = fileChar.charCodeAt(0) - 97
  const rank = parseInt(rankChar, 10) - 1
  const isLight = (file + rank) % 2 !== 0

  const isLeftEdge = flipped ? fileChar === "h" : fileChar === "a"
  const isBottomEdge = flipped ? rankChar === "8" : rankChar === "1"

  const labelColor = isLight ? "text-board-dark" : "text-board-light"

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
      {/* Edge Labels - Always visible */}
      {isLeftEdge && (
        <span className={cn(
          "absolute top-0.5 left-0.5 text-[10px] font-bold leading-none select-none",
          labelColor
        )}>
          {rankChar}
        </span>
      )}
      
      {isBottomEdge && (
        <span className={cn(
          "absolute bottom-0.5 right-0.5 text-[10px] font-bold leading-none select-none",
          labelColor
        )}>
          {fileChar}
        </span>
      )}

      {/* Square Notation ID - Toggled */}
      {showNotations && (
        <span className={cn(
          "absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[14px] font-bold opacity-30 select-none pointer-events-none",
          labelColor
        )}>
          {notation}
        </span>
      )}

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


