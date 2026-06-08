import { useState, useMemo } from "react"
import type { DragEndEvent, DragStartEvent } from "@dnd-kit/core"
import { fenToBoard } from "@/lib/utils"
import {
  generateLegalMoves,
  makeMove as engineMakeMove,
  validateFen,
} from "en-castle"
import { useChessStore } from "@/store/chess.store"

export interface PendingPromotion {
  from: string
  to: string
  color: "w" | "b"
}

export function useChess() {
  const { fen, setFen, addMove, resetGame, history } = useChessStore()
  const [error, setError] = useState<string | undefined>(undefined)
  const [selectedSquare, setSelectedSquare] = useState<string | null>(null)
  const [pendingPromotion, setPendingPromotion] = useState<PendingPromotion | null>(null)

  const board = useMemo(() => fenToBoard(fen), [fen])

  const turn = useMemo(() => {
    const parts = fen.split(" ")
    return parts[1] || "w"
  }, [fen])

  const legalMoves = useMemo(() => {
    try {
      return generateLegalMoves(fen) || []
    } catch {
      return []
    }
  }, [fen])

  const highlightedSquares = useMemo(() => {
    if (!selectedSquare) return []
    return legalMoves
      .filter((move) => move.startsWith(selectedSquare))
      .map((move) => move.slice(2, 4))
  }, [selectedSquare, legalMoves])

  const movePiece = (fromSquare: string, toSquare: string) => {
    if (fromSquare === toSquare) return

    const fromSq = board.find((s) => s.notation === fromSquare)
    if (!fromSq || !fromSq.piece) return

    // Intercept promotion
    const isPromotion =
      (fromSq.piece === "wP" && toSquare[1] === "8") ||
      (fromSq.piece === "bP" && toSquare[1] === "1")

    if (isPromotion) {
      const uciPrefix = `${fromSquare}${toSquare}`
      const hasLegalPromotion = legalMoves.some(
        (move) => move.startsWith(uciPrefix) && move.length === 5
      )
      if (hasLegalPromotion) {
        const color = fromSq.piece.startsWith("w") ? "w" : "b"
        setPendingPromotion({ from: fromSquare, to: toSquare, color })
        return
      }
    }

    const uci = `${fromSquare}${toSquare}`

    const response = validateFen(fen)
    if (!response.isValid) {
      setError(response.error || "Invalid FEN")
      return
    }

    try {
      if (legalMoves && legalMoves.includes(uci)) {
        const nextFen = engineMakeMove(fen, uci)
        setFen(nextFen)
        addMove(uci)
        setError(undefined)
      } else {
        setError("Illegal move")
      }
    } catch (e) {
      setError(`Error processing move ${uci}`)
    }
  }

  const completePromotion = (promotionChar: "q" | "r" | "b" | "n") => {
    if (!pendingPromotion) return
    const { from, to } = pendingPromotion
    const uci = `${from}${to}${promotionChar}`

    try {
      if (legalMoves && legalMoves.includes(uci)) {
        const nextFen = engineMakeMove(fen, uci)
        setFen(nextFen)
        addMove(uci)
        setError(undefined)
      } else {
        setError("Illegal promotion move")
      }
    } catch (e) {
      setError(`Error processing promotion move ${uci}`)
    } finally {
      setPendingPromotion(null)
    }
  }

  const cancelPromotion = () => {
    setPendingPromotion(null)
  }

  const handleDragStart = (event: DragStartEvent) => {
    const fromSquare = event.active.id as string
    const sq = board.find((s) => s.notation === fromSquare)
    if (sq && sq.piece && sq.piece.startsWith(turn)) {
      setSelectedSquare(fromSquare)
    }
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event
    setSelectedSquare(null)
    if (!over) return

    const fromSquare = active.id as string
    const toSquare = over.id as string

    movePiece(fromSquare, toSquare)
  }

  const selectSquare = (notation: string) => {
    const sq = board.find((s) => s.notation === notation)
    if (!selectedSquare) {
      if (sq && sq.piece && sq.piece.startsWith(turn)) {
        setSelectedSquare(notation)
      }
    } else {
      if (selectedSquare === notation) {
        setSelectedSquare(null)
      } else if (highlightedSquares.includes(notation)) {
        movePiece(selectedSquare, notation)
        setSelectedSquare(null)
      } else if (sq && sq.piece && sq.piece.startsWith(turn)) {
        setSelectedSquare(notation)
      } else {
        setSelectedSquare(null)
      }
    }
  }

  const reset = () => {
    resetGame()
    setError(undefined)
    setSelectedSquare(null)
    setPendingPromotion(null)
  }

  return {
    fen,
    history,
    board,
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
  }
}
