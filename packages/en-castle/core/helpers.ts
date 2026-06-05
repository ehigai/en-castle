export const getEnPassantSquare = (fen: string): bigint => {
  const parts = fen.split(" ");
  const epSquare = parts && parts.length > 3 ? parts[3] : "-";
  if (epSquare === "-") {
    return 0n;
  }
  const file = epSquare ? epSquare.charCodeAt(0) - "a".charCodeAt(0) : 0;
  const rank = epSquare ? parseInt(epSquare[1]!) - 1 : 0;
  return 1n << (8n * BigInt(rank) + BigInt(file));
};

// Convert "e2" to bit index (12)
export const squareToIndex = (sq: string): number => {
  const file = sq.charCodeAt(0) - 97; // 'a' = 0
  const rank = parseInt(sq[1]!, 10) - 1;
  return rank * 8 + file;
};

// Convert bit index (12) to "e2"
export const indexToSquare = (index: number): string => {
  const file = String.fromCharCode(97 + (index % 8));
  const rank = Math.floor(index / 8) + 1;
  return `${file}${rank}`;
};
