import { PieceSelector } from "./theme/piece-selector"
import { BoardSelector } from "./theme/board-selector"
import { useThemeStore } from "@/store/theme.store"
import useGlobalStore from "@/store/global.store"
import { RotateCw, Zap } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

export default function Preferences() {
  const { toggleFlipped, flipped } = useThemeStore()
  const { autoFlip, toggleAutoFlip } = useGlobalStore()

  return (
    <div className="flex h-full w-full flex-col gap-4 border border-border bg-card p-4">
      <h2 className="mb-4 text-lg font-semibold text-card-foreground">
        Preferences
      </h2>
      <div className="space-y-2 px-1">
        <label className="text-sm font-medium">Pieces</label>
        <PieceSelector />
      </div>
      <div className="space-y-2 px-1">
        <label className="text-sm font-medium">Board</label>
        <BoardSelector />
      </div>
      <hr />
      <div className="mt-2 flex items-center justify-center gap-2">
        <Button onClick={toggleFlipped}>
          <RotateCw
            className={`h-4 w-4 transition-transform duration-500 ${
              flipped ? "rotate-180" : ""
            }`}
          />
          Flip Board
        </Button>

        <Button
          onClick={toggleAutoFlip}
          className={cn(
            autoFlip
              ? "border-primary bg-primary/10 text-primary"
              : "border-border bg-secondary text-foreground hover:bg-muted"
          )}
        >
          <Zap className={`h-4 w-4 ${autoFlip ? "fill-primary" : ""}`} />
          Auto-flip {autoFlip ? "ON" : "OFF"}
        </Button>
      </div>
    </div>
  )
}
