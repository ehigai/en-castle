/**
 * A 64x64 lookup table.
 * Usage: BETWEEN_RAYS[square1][square2] returns a bitboard of the squares strictly between them.
 */
export const BETWEEN_RAYS: bigint[][] = (() => {
  const table = Array.from({ length: 64 }, () => Array(64).fill(0n));

  for (let sq1 = 0; sq1 < 64; sq1++) {
    for (let sq2 = 0; sq2 < 64; sq2++) {
      if (sq1 === sq2) continue;

      // Convert 1D bit index into 2D File (x) and Rank (y) coordinates
      const f1 = sq1 % 8;
      const r1 = Math.floor(sq1 / 8);
      const f2 = sq2 % 8;
      const r2 = Math.floor(sq2 / 8);

      const df = f2 - f1;
      const dr = r2 - r1;

      // Are they on the same line or diagonal?
      const isOrthogonal = f1 === f2 || r1 === r2;
      const isDiagonal = Math.abs(df) === Math.abs(dr);

      if (isOrthogonal || isDiagonal) {
        // Determine the directional step (+1, -1, 0)
        const stepF = df === 0 ? 0 : df / Math.abs(df);
        const stepR = dr === 0 ? 0 : dr / Math.abs(dr);

        let currentF = f1 + stepF;
        let currentR = r1 + stepR;
        let ray = 0n;

        // Walk from sq1 to sq2, flipping on bits along the way
        while (currentF !== f2 || currentR !== r2) {
          const currentSq = currentR * 8 + currentF;
          ray |= 1n << BigInt(currentSq);

          currentF += stepF;
          currentR += stepR;
        }

        table[sq1]![sq2] = ray;
      }
    }
  }

  return table;
})();
