import Board from "@/components/board"
import { PieceSelector } from "./components/theme/piece-selector"

export function App() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <Board />

      <div>
        <PieceSelector />
      </div>
    </main>
  )
}

export default App
