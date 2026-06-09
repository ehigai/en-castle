import { PieceSelector } from "./theme/piece-selector"
import { BoardSelector } from "./theme/board-selector"

export default function Preferences() {
  return (
    <div className="flex h-full w-full flex-col gap-4 rounded-lg border border-border bg-card p-4 shadow-sm">
      <div className="space-y-2">
        <label className="text-sm font-medium">Pieces</label>
        <PieceSelector />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium">Board</label>
        <BoardSelector />
      </div>
    </div>
  )
}
