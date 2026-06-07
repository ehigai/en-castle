import { useState } from "react"
import { DndContext, type DragEndEvent } from "@dnd-kit/core"
import type { Board } from "@/types"
import { createBoard } from "@/lib/utils"
import Square from "./square"
import Fen from "./fen"

export default function Board() {
  const [board, setBoard] = useState<Board>(createBoard())
  const [lastMove, setLastMove] = useState<string | null>(null)

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    if (!over) return

    const fromSquare = active.id as string
    const toSquare = over.id as string

    if (fromSquare === toSquare) return

    setBoard((prevBoard) => {
      const newBoard = prevBoard.map((s) => ({ ...s }))
      const fromSq = newBoard.find((s) => s.notation === fromSquare)
      const toSq = newBoard.find((s) => s.notation === toSquare)

      if (fromSq?.piece) {
        const isPromotion =
          (fromSq.piece === "wP" && toSquare[1] === "8") ||
          (fromSq.piece === "bP" && toSquare[1] === "1")
        const uci = `${fromSquare}${toSquare}${isPromotion ? "q" : ""}`
        setLastMove(uci)

        if (toSq) {
          toSq.piece = fromSq.piece
        }
        fromSq.piece = null
      }
      return newBoard as unknown as Board
    })
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <DndContext onDragEnd={handleDragEnd}>
        <div className="grid aspect-square! w-fit! grid-cols-8! grid-rows-8! border">
          {board.map((square) => (
            <Square key={square.notation} square={square} />
          ))}
        </div>
      </DndContext>
      <Fen lastMove={lastMove} />
    </div>
  )
}
