import { useEffect, useState } from "react"
import { makeMove } from "en-castle"

export interface FenProps {
  lastMove: string | null
}

export default function Fen({ lastMove }: FenProps) {
  const [fen, setFen] = useState(
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"
  )

  useEffect(() => {
    if (lastMove) {
      setFen((prevFen) => {
        try {
          const nextFen = makeMove(prevFen, lastMove)
          return nextFen
        } catch (e) {
          console.error(`[FEN Component] Error processing move ${lastMove}:`, e)
          return prevFen
        }
      })
    }
  }, [lastMove])

  return (
    <div className="mt-4 w-fit rounded border bg-secondary p-3 font-mono text-sm whitespace-nowrap">
      <span className="font-semibold text-primary">FEN:</span> {fen}
    </div>
  )
}
