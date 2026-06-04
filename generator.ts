/**
 * Parses the board portion of a FEN string into 12 piece bitboards.
 * Uses LERF mapping (A1 = index 0).
 */
export function fenToBitboards(fen: string) {
  // Initialize 12 empty bitboards
  // prettier-ignore
  const boards = {
        P: 0n, N: 0n, B: 0n, R: 0n, Q: 0n, K: 0n, // White
        p: 0n, n: 0n, b: 0n, r: 0n, q: 0n, k: 0n  // Black
    };

  const boardPart = fen.split(" ")[0]!;

  // Set starting coordinates (A8)
  let rank = 7;
  let file = 0;

  for (let i = 0; i < boardPart.length; i++) {
    const char = boardPart[i]!;

    if (char === "/") {
      rank--;
      file = 0;
    } else if (char >= "1" && char <= "8") {
      // It's a number: skip that many empty squares
      file += parseInt(char, 10);
    } else {
      // It's a piece: Calculate its exact LERF bit index
      const bitIndex = BigInt(rank * 8 + file);

      const piece = char as keyof typeof boards;
      // Turn on the '1' bit at that specific index using a Left Shift
      boards[piece] |= 1n << bitIndex;

      // Move to the next square
      file++;
    }
  }

  return boards;
}
