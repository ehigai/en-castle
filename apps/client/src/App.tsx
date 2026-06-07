import { useEffect, useState } from "react"
import { api } from "@/lib/eden"

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
    <div className="min-h-svh p-6">
      <p>Root data: {rootData}</p>
      <p>Data: {data}</p>
    </div>
  )
}

export default App
