import { useChessStore } from "@/store/chess.store"
import { Button } from "./ui/button"
import { useChess } from "@/hooks/use-chess"

export function MoveHistory() {
  const history = useChessStore((state) => state.history)
  const { reset } = useChess()

  const pairs = []
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      white: history[i],
      black: history[i + 1],
    })
  }

  return (
    <div className="flex h-1/2 w-full flex-col border border-border bg-card p-4">
      <h2 className="mb-4 text-lg font-semibold text-card-foreground">
        Move History
      </h2>
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-1">
          {pairs.length === 0 ? (
            <pre className="text-sm text-muted-foreground">No moves yet</pre>
          ) : (
            pairs.map((pair, index) => (
              <div
                key={index}
                className="grid grid-cols-[30px_1fr_1fr] gap-2 border-b border-border/50 py-1 text-sm last:border-0"
              >
                <span className="font-mono text-muted-foreground">
                  {index + 1}.
                </span>
                <span className="font-medium text-foreground">
                  {pair.white}
                </span>
                <span className="font-medium text-foreground">
                  {pair.black || ""}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <Button onClick={reset}>Reset Game</Button>
    </div>
  )
}
