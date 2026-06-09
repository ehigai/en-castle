import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useThemeStore, type BoardTheme } from "@/store/theme.store"

export function BoardSelector() {
  const { boardTheme, setBoardTheme } = useThemeStore()
  const boards: BoardTheme[] = ["blue", "brown"]

  return (
    <Select
      value={boardTheme}
      onValueChange={(value) => setBoardTheme(value as BoardTheme)}
    >
      <SelectTrigger className="w-full border-border bg-secondary/50 px-3 transition-colors hover:bg-muted">
        <SelectValue placeholder="Select a board theme" />
      </SelectTrigger>
      <SelectContent
        alignItemWithTrigger={false}
        className="border-border bg-popover"
      >
        <SelectGroup>
          <SelectLabel className="text-xs font-semibold text-muted-foreground uppercase tracking-wider px-2 py-1.5">
            Board Theme
          </SelectLabel>
          {boards.map((board) => (
            <SelectItem
              key={board}
              value={board}
              className="cursor-pointer focus:bg-accent focus:text-accent-foreground"
            >
              <div className="flex items-center gap-3 py-1">
                <div
                  className="h-8 w-8 rounded-md bg-cover border border-border/50 shadow-xs"
                  style={{ backgroundImage: `url(/boards/${board}.png)` }}
                />
                <span className="font-medium capitalize">{board}</span>
              </div>
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
