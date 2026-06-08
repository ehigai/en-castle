import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import Square from "./square"
import Fen from "./fen"
import { useChess } from "@/hooks/use-chess"
import { PromotionDialog } from "./promotion-dialog"

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
