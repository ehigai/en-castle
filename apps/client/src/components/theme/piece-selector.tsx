import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useThemeStore, type PieceTheme } from "@/store/theme.store"

export function PieceSelector() {
  const { pieceTheme, setPieceTheme } = useThemeStore()
  const themes: PieceTheme[] = ["alpha", "cburnett"]

  return (
    <Select
      value={pieceTheme}
      onValueChange={(value) => setPieceTheme(value as PieceTheme)}
    >
      <SelectTrigger className="w-full border-border bg-secondary/50 px-3 transition-colors hover:bg-muted">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent
        alignItemWithTrigger={false}
        className="border-border bg-popover"
      >
        <SelectGroup>
          <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
            Piece Theme
          </SelectLabel>
          {themes.map((theme) => (
            <SelectItem
              key={theme}
              value={theme}
              className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
            >
              <div className="flex items-center gap-3 py-1">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted p-1">
                  <img
                    src={`/pieces/${theme}/wK.svg`}
                    alt={theme}
                    className="h-full w-full object-contain"
                  />
                </div>
                <span className="font-medium capitalize">{theme}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
