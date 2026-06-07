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

  return (
    <Select
      value={pieceTheme}
      onValueChange={(value) => setPieceTheme(value as PieceTheme)}
    >
      <SelectTrigger className="w-full max-w-48">
        <SelectValue placeholder="Select a theme" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Piece Theme</SelectLabel>
          <SelectItem value="classic">Classic</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
