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
