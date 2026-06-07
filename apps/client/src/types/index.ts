// prettier-ignore
type FixedLengthArray<Type, Length extends number, Acc extends readonly Type[] = []> = 
  Acc['length'] extends Length 
    ? Acc 
    : FixedLengthArray<Type, Length, [Type, ...Acc]>;

// prettier-ignore
export type IPiece = "wP" | "wN" | "wB" | "wR" | "wQ" | "wK" |
                     "bP" | "bN" | "bB" | "bR" | "bQ" | "bK"

export type { FixedLengthArray }
