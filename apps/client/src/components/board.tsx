import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import Square from "./square"
import Fen from "./fen"
import { useChess } from "@/hooks/use-chess"
import { PromotionDialog } from "./promotion-dialog"

export default function Board() {
  const {
    board,
    fen,
    error,
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

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  return (
    <div className="flex flex-col items-center gap-4">
      {error && <div className="text-sm font-semibold text-destructive">{error}</div>}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="relative grid aspect-square! w-fit! grid-cols-8! grid-rows-8! border">
          {board.map((square) => (
            <Square
              key={square.notation}
              square={square}
              isSelected={selectedSquare === square.notation}
              isHighlighted={highlightedSquares.includes(square.notation)}
              onClick={() => selectSquare(square.notation)}
            />
          ))}
          <PromotionDialog
            pendingPromotion={pendingPromotion}
            onSelect={completePromotion}
            onClose={cancelPromotion}
          />
        </div>
      </DndContext>
      <div className="flex w-full max-w-lg items-center justify-between gap-4 mt-2">
        <Fen fen={fen} />
        <button
          onClick={reset}
          className="flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-md border border-border bg-secondary hover:bg-muted text-foreground cursor-pointer transition-all active:scale-95 shadow-xs"
        >
          Reset Game
        </button>
      </div>
    </div>
  )
}

