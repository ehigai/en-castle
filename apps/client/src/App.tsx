import { useEffect, useState } from "react"
import { api } from "@/lib/eden"
import Board from "@/components/board"
import { PieceSelector } from "./components/theme/piece-selector"

export function App() {
  const [data, setData] = useState<string | null>("")
  const [rootData, setRootData] = useState<string | null>("")
  useEffect(() => {
    const fetchData = async () => {
      const { data: rootData } = await api.get()
      setRootData(rootData)

      const { data: idData } = await api.id({ id: "string" }).get()
      setData(idData)
    }
    fetchData()
  }, [])

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
