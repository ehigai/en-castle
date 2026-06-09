import { useState } from "react"
import { Check, Copy } from "lucide-react"

import { Button } from "@/components/ui/button"

export interface FenProps {
  fen: string
}

export default function Fen({ fen }: FenProps) {
  const [copied, setCopied] = useState(false)

  const copyFen = async () => {
    await navigator.clipboard.writeText(fen)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1200)
  }

  return (
    <div className="flex w-fit items-center gap-2 rounded border bg-secondary p-3 font-mono text-sm whitespace-nowrap">
      <span>
        <span className="font-semibold text-primary">FEN:</span> {fen}
      </span>
      <Button
        type="button"
        variant="ghost"
        size="icon-xs"
        onClick={copyFen}
        aria-label="Copy FEN"
        title="Copy FEN"
        className="font-sans"
      >
        {copied ? <Check /> : <Copy />}
      </Button>
    </div>
  )
}
