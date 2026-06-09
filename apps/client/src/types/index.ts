// prettier-ignore
type FixedLengthArray<Type, Length extends number, Acc extends readonly Type[] = []> = 
  Acc['length'] extends Length 
    ? Acc 
    : FixedLengthArray<Type, Length, [Type, ...Acc]>;

// prettier-ignore
export type IPiece = "wP" | "wN" | "wB" | "wR" | "wQ" | "wK" |
                     "bP" | "bN" | "bB" | "bR" | "bQ" | "bK"

export interface Square {
  notation: string
  piece: IPiece | null
}

type Board = FixedLengthArray<Square, 64>

export type { Board, FixedLengthArray }
