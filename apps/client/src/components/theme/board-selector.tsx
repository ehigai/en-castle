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

  return (
    <Select
      value={boardTheme}
      onValueChange={(value) => setBoardTheme(value as BoardTheme)}
    >
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select a board theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Board Theme</SelectLabel>
          <SelectItem value="blue">Blue</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
