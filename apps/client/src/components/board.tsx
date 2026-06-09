import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import Square from "./square"
import Fen from "./fen"
import { useChess } from "@/hooks/use-chess"
import { PromotionDialog } from "./promotion-dialog"
import { useThemeStore } from "@/store/theme.store"
import { DraggablePiece } from "./piece"
import { useEffect, useRef } from "react"
import useGlobalStore from "@/store/global.store"
import { CapturedPieces } from "./captured-pieces"
import { cn } from "@/lib/utils"

export default function Board() {
  const {
    board,
    fen,
    history,
    selectedSquare,
    highlightedSquares,
    pendingPromotion,
    selectSquare,
    completePromotion,
    cancelPromotion,
    handleDragStart,
    handleDragEnd,
    lastMove,
  } = useChess()

  const { pieceTheme, boardTheme, flipped, toggleFlipped } = useThemeStore()
  const autoFlip = useGlobalStore((state) => state.autoFlip)
  const prevHistoryLen = useRef(history.length)

  useEffect(() => {
    if (autoFlip && history.length > prevHistoryLen.current) {
      toggleFlipped()
    }
    prevHistoryLen.current = history.length
  }, [history.length, autoFlip, toggleFlipped])

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  )

  const lastMoveSquares = lastMove
    ? [lastMove.slice(0, 2), lastMove.slice(2, 4)]
    : []
  const displayBoard = flipped ? [...board].reverse() : board

  const topColor = flipped ? "w" : "b"
  const bottomColor = flipped ? "b" : "w"

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex w-150 items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center border border-border/50 text-xs font-bold uppercase",
              topColor === "w" ? "bg-white text-black" : "bg-black text-white"
            )}
          >
            {topColor}
          </div>
          <CapturedPieces board={board} color={topColor} />
        </div>
      </div>

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
            {displayBoard.map((square) => (
              <Square
                key={square.notation}
                notation={square.notation}
                isSelected={selectedSquare === square.notation}
                isHighlighted={highlightedSquares.includes(square.notation)}
                isLastMove={lastMoveSquares.includes(square.notation)}
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

      <div className="flex w-150 items-center justify-between px-2">
        <div className="flex items-center gap-3">
          <div
            className={cn(
              "flex h-8 w-8 items-center justify-center border border-border/50 text-xs font-bold uppercase",
              bottomColor === "w"
                ? "bg-white text-black"
                : "bg-black text-white"
            )}
          >
            {bottomColor}
          </div>
          <CapturedPieces board={board} color={bottomColor} />
        </div>
      </div>

      <PromotionDialog
        pendingPromotion={pendingPromotion}
        onSelect={completePromotion}
        onClose={cancelPromotion}
      />
      <div className="mt-2 flex w-full items-center justify-center gap-4">
        <Fen fen={fen} />
      </div>
    </div>
  )
}
