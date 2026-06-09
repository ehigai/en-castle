import { useState } from "react"
import { useChessStore } from "@/store/chess.store"
import { validateFen } from "en-castle"
import { STARTING_FEN } from "@/constants"
import { Button } from "./ui/button"

export default function Tools() {
  const [fenInput, setFenInput] = useState("")
  const { setFen } = useChessStore()
  const [error, setError] = useState<string | null>(null)

  const handleLoadFen = () => {
    if (!fenInput) {
      setError("No FEN value set")
      return
    }
    const result = validateFen(fenInput)
    if (result.isValid) {
      setFen(fenInput)
      setError(null)
    } else {
      setError(result.error || "Invalid FEN")
    }
  }

  return (
    <div className="flex h-1/2 w-full flex-col border border-border bg-card p-4">
      <h2 className="mb-4 text-lg font-semibold text-card-foreground">Tools</h2>

      <div className="space-y-4">
        <div className="flex flex-col gap-2">
          <label htmlFor="fen-input" className="text-sm font-medium">
            Load from FEN
          </label>
          <div className="flex gap-2">
            <input
              id="fen-input"
              type="text"
              value={fenInput}
              onChange={(e) => setFenInput(e.target.value)}
              placeholder={STARTING_FEN}
              className="flex-1 border border-input bg-background px-3 py-2 text-sm outline-hidden transition-colors focus-visible:ring-1 focus-visible:ring-ring"
            />
            <Button onClick={handleLoadFen}>Load</Button>
          </div>
          {error && <p className="text-xs text-destructive">{error}</p>}
        </div>
      </div>
    </div>
  )
}
