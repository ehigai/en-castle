import { useThemeStore } from "@/store/theme.store"
import type { PendingPromotion } from "@/hooks/use-chess"

interface PromotionDialogProps {
  pendingPromotion: PendingPromotion | null
  onSelect: (pieceType: "q" | "r" | "b" | "n") => void
  onClose: () => void
}

export function PromotionDialog({
  pendingPromotion,
  onSelect,
  onClose,
}: PromotionDialogProps) {
  const pieceTheme = useThemeStore((state) => state.pieceTheme)

  if (!pendingPromotion) return null

  const color = pendingPromotion.color
  const options = [
    { type: "q", label: "Queen", code: "Q" },
    { type: "r", label: "Rook", code: "R" },
    { type: "b", label: "Bishop", code: "B" },
    { type: "n", label: "Knight", code: "N" },
  ] as const

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs rounded-sm animate-in fade-in duration-200">
      <div className="w-80 bg-card p-5 rounded-lg shadow-lg border border-border text-center flex flex-col gap-4 animate-in zoom-in-95 duration-200">
        <h3 className="font-semibold text-foreground text-md">Pawn Promotion</h3>
        <div className="grid grid-cols-4 gap-2">
          {options.map((opt) => (
            <button
              key={opt.type}
              onClick={() => onSelect(opt.type)}
              className="flex flex-col items-center justify-center p-2 rounded-md hover:bg-secondary cursor-pointer border border-transparent hover:border-border transition-all active:scale-95"
            >
              <img
                src={`/pieces/${pieceTheme}/${color}${opt.code}.svg`}
                alt={opt.label}
                className="w-12 h-12 object-contain"
              />
              <span className="text-xs text-muted-foreground mt-1 font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-1 text-xs font-semibold py-1.5 px-3 rounded-md hover:bg-secondary text-muted-foreground hover:text-foreground transition-all cursor-pointer"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}
export default PromotionDialog
