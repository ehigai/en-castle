import { useChess } from "@/hooks/use-chess"
import { cn } from "@/lib/utils"
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react"
import { Button } from "./ui/button"

export function MoveHistory() {
  const { history, viewIndex, setViewIndex, reset } = useChess()

  const pairs = []
  for (let i = 0; i < history.length; i += 2) {
    pairs.push({
      white: { move: history[i], index: i + 1 },
      black: history[i + 1] ? { move: history[i + 1], index: i + 2 } : null,
    })
  }

  const navigate = (index: number) => {
    const clampedIndex = Math.max(0, Math.min(history.length, index))
    setViewIndex(clampedIndex)
  }

  return (
    <div className="flex h-1/2 w-full flex-col border border-border bg-card p-4">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-lg font-semibold text-card-foreground">
          Move History
        </h2>
      </div>

      <div className="custom-scrollbar flex-1 overflow-y-auto pr-2">
        <div className="space-y-0.5">
          {pairs.length === 0 ? (
            <div className="flex h-full items-center justify-center py-8">
              <p className="text-sm text-muted-foreground italic">
                No moves yet
              </p>
            </div>
          ) : (
            pairs.map((pair, index) => (
              <div
                key={index}
                className="grid grid-cols-[35px_1fr_1fr] gap-1 py-0.5 text-sm"
              >
                <span className="flex items-center justify-center rounded-sm bg-muted/30 font-mono text-[11px] text-muted-foreground">
                  {index + 1}
                </span>

                <button
                  onClick={() => navigate(pair.white.index)}
                  className={cn(
                    "cursor-pointer rounded px-2 py-1 text-left font-medium transition-colors",
                    viewIndex === pair.white.index
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "text-foreground hover:bg-muted"
                  )}
                >
                  {pair.white.move}
                </button>

                {pair.black ? (
                  (() => {
                    const blackMove = pair.black

                    return (
                      <button
                        onClick={() => navigate(blackMove.index)}
                        className={cn(
                          "cursor-pointer rounded px-2 py-1 text-left font-medium transition-colors",
                          viewIndex === blackMove.index
                            ? "bg-primary text-primary-foreground shadow-sm"
                            : "text-foreground hover:bg-muted"
                        )}
                      >
                        {blackMove.move}
                      </button>
                    )
                  })()
                ) : (
                  <div />
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-4 flex items-center justify-between gap-1 border-t border-border pt-4">
        <button
          onClick={() => navigate(0)}
          disabled={viewIndex === 0}
          className="flex flex-1 items-center justify-center rounded p-2 transition-all hover:bg-muted active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Start"
        >
          <ChevronsLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => navigate(viewIndex - 1)}
          disabled={viewIndex === 0}
          className="flex flex-1 items-center justify-center rounded p-2 transition-all hover:bg-muted active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Previous"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          onClick={() => navigate(viewIndex + 1)}
          disabled={viewIndex === history.length}
          className="flex flex-1 items-center justify-center rounded p-2 transition-all hover:bg-muted active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Next"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
        <button
          onClick={() => navigate(history.length)}
          disabled={viewIndex === history.length}
          className="flex flex-1 items-center justify-center rounded p-2 transition-all hover:bg-muted active:scale-90 disabled:opacity-30 disabled:hover:bg-transparent"
          title="End"
        >
          <ChevronsRight className="h-4 w-4" />
        </button>
      </div>
      <Button onClick={reset} className="mt-4 w-full cursor-pointer">
        Reset Game
      </Button>
    </div>
  )
}
