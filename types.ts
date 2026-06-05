// prettier-ignore
export type BItboards = {
  // White Pieces
  P: bigint; N: bigint; B: bigint;
  R: bigint; Q: bigint; K: bigint;
  // Black pieces
  p: bigint; n: bigint; b: bigint;
  r: bigint; q: bigint; k: bigint;
};

export interface LegalMove {
  from: string;
  to: string;
}
