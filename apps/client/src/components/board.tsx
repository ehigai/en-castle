import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import Square from "./square"
import Fen from "./fen"
import { useChess } from "@/hooks/use-chess"
import { PromotionDialog } from "./promotion-dialog"
import { useThemeStore } from "@/store/theme.store"
import { DraggablePiece } from "./piece"

export default function Board() {
  const {
    board,
    fen,
    selectedSquare,
    highlightedSquares,
    pendingPromotion,
    selectSquare,
    completePromotion,
    cancelPromotion,
    handleDragStart,
    handleDragEnd,
    reset,
  } = useChess()

  const { pieceTheme, boardTheme } = useThemeStore()

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  return (
    <div className="flex flex-col items-center gap-4">
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          className="relative aspect-square w-150 overflow-hidden border bg-cover shadow-2xl select-none"
          style={{ backgroundImage: `url(/boards/${boardTheme}.png)` }}
        >
          {/* Invisible Droppable Overlay */}
          <div className="absolute inset-0 grid grid-cols-8 grid-rows-8">
            {board.map((square) => (
              <Square
                key={square.notation}
                notation={square.notation}
                isSelected={selectedSquare === square.notation}
                isHighlighted={highlightedSquares.includes(square.notation)}
                hasPiece={!!square.piece}
                onClick={() => selectSquare(square.notation)}
              />
            ))}
          </div>

          {/* Draggable Pieces Layer */}
          {board
            .filter((s) => s.piece)
            .map((s) => (
              <DraggablePiece
                key={s.notation}
                id={s.notation}
                piece={s.piece!}
                pieceTheme={pieceTheme}
                onClick={() => selectSquare(s.notation)}
              />
            ))}
        </div>
      </DndContext>
      <PromotionDialog
        pendingPromotion={pendingPromotion}
        onSelect={completePromotion}
        onClose={cancelPromotion}
      />
      <div className="mt-2 flex w-full items-center justify-center gap-4">
        <Fen fen={fen} />
        <button
          onClick={reset}
          className="flex cursor-pointer items-center gap-1.5 rounded-md border border-border bg-secondary px-4 py-2 text-sm font-semibold whitespace-nowrap text-foreground shadow-xs transition-all hover:bg-muted active:scale-95"
        >
          Reset Game
        </button>
      </div>
    </div>
  )
}
