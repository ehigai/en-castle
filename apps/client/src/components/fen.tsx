export interface FenProps {
  fen: string
}

export default function Fen({ fen }: FenProps) {
  return (
    <div className="w-fit rounded border bg-secondary p-3 font-mono text-sm whitespace-nowrap">
      <span className="font-semibold text-primary">FEN:</span> {fen}
    </div>
  )
}
