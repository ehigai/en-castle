import { PieceSelector } from "./theme/piece-selector"

export default function Preferences() {
  return (
    <div className="flex h-full w-full flex-col rounded-lg border border-border bg-card p-4 shadow-sm">
      <PieceSelector />
    </div>
  )
}
