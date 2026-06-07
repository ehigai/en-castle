import { useState } from "react"
import type { FixedLengthArray } from "@/types"
import { createBoard } from "@/lib/utils"
import Square, { type Square as SquareType } from "./square"

type Board = FixedLengthArray<SquareType, 64>

export default function Board() {
  const [board] = useState<Board>(createBoard())
  return (
    <div className="grid aspect-square! w-fit! grid-cols-8! grid-rows-8! border">
      {board.map((square) => (
        <Square key={square.notation} square={square} />
      ))}
    </div>
  )
}
