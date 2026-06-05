// LERF array
// prettier-ignore
export const SQUARES = [
  'a1', 'b1', 'c1', 'd1', 'e1', 'f1', 'g1', 'h1',
  'a2', 'b2', 'c2', 'd2', 'e2', 'f2', 'g2', 'h2',
  'a3', 'b3', 'c3', 'd3', 'e3', 'f3', 'g3', 'h3',
  'a4', 'b4', 'c4', 'd4', 'e4', 'f4', 'g4', 'h4',
  'a5', 'b5', 'c5', 'd5', 'e5', 'f5', 'g5', 'h5',
  'a6', 'b6', 'c6', 'd6', 'e6', 'f6', 'g6', 'h6',
  'a7', 'b7', 'c7', 'd7', 'e7', 'f7', 'g7', 'h7',
  'a8', 'b8', 'c8', 'd8', 'e8', 'f8', 'g8', 'h8'
] as const;

export type SquareName = (typeof SQUARES)[number];

export const SquareBitboards: Record<SquareName, bigint> = {} as Record<
  SquareName,
  bigint
>;

SQUARES.forEach((sqName, i) => {
  SquareBitboards[sqName] = 1n << BigInt(i);
});

export const CLAMP_64 = 0xffffffffffffffffn;

// Edge Masks (To prevent Wrap-Around)
export const NOT_A_FILE = 0xfefefefefefefefen;
export const NOT_AB_FILE = 0xfcfcfcfcfcfcfcfcn;
export const NOT_H_FILE = 0x7f7f7f7f7f7f7f7fn;
export const NOT_GH_FILE = 0x3f3f3f3f3f3f3f3fn;

export const RANK_4 = 0x00000000ff000000n; // White
export const RANK_5 = 0x000000ff00000000n; // Black

// White Castling Masks
export const WHITE_K_EMPTY = 0x0000000000000060n;
export const WHITE_K_SAFE = 0x0000000000000070n;

export const WHITE_Q_EMPTY = 0x000000000000000en;
export const WHITE_Q_SAFE = 0x0000000000000038n;

// Black Castling Masks
export const BLACK_K_EMPTY = 0x6000000000000000n;
export const BLACK_K_SAFE = 0x7000000000000000n;

export const BLACK_Q_EMPTY = 0x0e00000000000000n;
export const BLACK_Q_SAFE = 0x3800000000000000n;
