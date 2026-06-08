import { useChessStore } from "@/store/chess.store"

export function MoveHistory() {
  const history = useChessStore((state) => state.history)

  const pairs = []
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      white: history[i],
      black: history[i + 1],
    })
  }

  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-border bg-card p-4 shadow-sm">
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
    </div>
  )
}
