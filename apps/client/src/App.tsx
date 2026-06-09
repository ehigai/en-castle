import Board from "@/components/board"
import { MoveHistory } from "./components/move-history"
import Preferences from "./components/preferences"
import Tools from "./components/tools"

export function App() {
  return (
    <main className="flex h-screen w-full items-center justify-center gap-8 p-8">
      <div className="flex h-full w-1/5 flex-col gap-4">
        <MoveHistory />
        <Tools />
      </div>

      <div className="flex h-full flex-col gap-4">
        <Board />
      </div>

      <div className="flex h-full w-1/5 flex-col gap-4">
        <Preferences />
      </div>
    </main>
  )
}

export default App
