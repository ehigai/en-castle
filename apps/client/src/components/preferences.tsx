import { PieceSelector } from "./theme/piece-selector"
import { BoardSelector } from "./theme/board-selector"
import { useThemeStore } from "@/store/theme.store"
import useGlobalStore from "@/store/global.store"
import { RotateCw, Zap, Hash } from "lucide-react"
import { Button } from "./ui/button"
import { cn } from "@/lib/utils"

export default function Preferences() {
  const { toggleFlipped, flipped } = useThemeStore()
  const {
    autoFlip,
    toggleAutoFlip,
    showNotations,
    toggleNotations,
  } = useGlobalStore()

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
      <hr className="border-border/50" />
      <div className="mt-2 grid grid-cols-1 gap-2">
        <Button onClick={toggleFlipped} className="w-full justify-center">
          <RotateCw
            className={`h-4 w-4 transition-transform duration-500 ${
              flipped ? "rotate-180" : ""
            }`}
          />
          Flip Board
        </Button>

        <div className="grid grid-cols-2 gap-2">
          <Button
            onClick={toggleAutoFlip}
            className={cn(
              "justify-center",
              autoFlip
                ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                : "border-border bg-secondary text-foreground hover:bg-muted"
            )}
          >
            <Zap className={`h-4 w-4 ${autoFlip ? "fill-primary" : ""}`} />
            Auto-flip {autoFlip ? "ON" : "OFF"}
          </Button>

          <Button
            onClick={toggleNotations}
            className={cn(
              "justify-center",
              showNotations
                ? "border-primary bg-primary/10 text-primary hover:bg-primary/20"
                : "border-border bg-secondary text-foreground hover:bg-muted"
            )}
          >
            <Hash className="h-4 w-4" />
            Notations {showNotations ? "ON" : "OFF"}
          </Button>
        </div>
      </div>
    </div>
  )
}
