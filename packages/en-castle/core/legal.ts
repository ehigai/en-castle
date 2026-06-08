import {
  BLACK_K_EMPTY,
  BLACK_K_SAFE,
  BLACK_Q_EMPTY,
  BLACK_Q_SAFE,
  CLAMP_64,
  WHITE_K_EMPTY,
  WHITE_K_SAFE,
  WHITE_Q_EMPTY,
  WHITE_Q_SAFE,
} from "./constants";
import {
  getBishopMoves,
  getBlackPawnAttacks,
  getKingMoves,
  getKnightMoves,
  getQueenMoves,
  getRookMoves,
  getWhitePawnAttacks,
} from "./moves";
import { BETWEEN_RAYS } from "./rays";
import type { BItboards } from "./types";

export function getWhiteDangerZone(
  bitboards: BItboards,
  occupied: bigint,
): bigint {
  let attacks = getWhitePawnAttacks(bitboards.P);

  // Jumping Pieces
  attacks |= getKnightMoves(bitboards.N, 0n);
  attacks |= getKingMoves(bitboards.K, 0n);

  // Sliding Piece
  const blockersWithoutBlackKing = occupied & ~bitboards.k;
  const emptyForAttacks = ~blockersWithoutBlackKing & CLAMP_64;

  attacks |= getBishopMoves(bitboards.B, emptyForAttacks, 0n);
  attacks |= getRookMoves(bitboards.R, emptyForAttacks, 0n);
  attacks |= getQueenMoves(bitboards.Q, emptyForAttacks, 0n);

  return attacks;
}

export function getBlackDangerZone(bitboards: BItboards, occupied: bigint) {
  let attacks = getBlackPawnAttacks(bitboards.p);

  // Jumping Piece
  attacks |= getKnightMoves(bitboards.n, 0n);
  attacks |= getKingMoves(bitboards.k, 0n);

  // Sliding Piece
  const blockersWithoutWhiteKing = occupied & ~bitboards.K;
  const emptyForAttacks = ~blockersWithoutWhiteKing & CLAMP_64;

  attacks |= getBishopMoves(bitboards.b, emptyForAttacks, 0n);
  attacks |= getRookMoves(bitboards.r, emptyForAttacks, 0n);
  attacks |= getQueenMoves(bitboards.q, emptyForAttacks, 0n);

  return attacks;
}

export function getWhiteCastlingMoves(
  castlingRights: string,
  occupied: bigint,
  blackDangerZone: bigint,
): bigint {
  let castlingMoves = 0n;

  // Kingside Castling
  if (castlingRights.includes("K")) {
    if ((occupied & WHITE_K_EMPTY) === 0n) {
      if ((blackDangerZone & WHITE_K_SAFE) === 0n) {
        castlingMoves |= 0x40n;
      }
    }
  }

  // Queenside Castling
  if (castlingRights.includes("Q")) {
    if ((occupied & WHITE_Q_EMPTY) === 0n) {
      if ((blackDangerZone & WHITE_Q_SAFE) === 0n) {
        castlingMoves |= 0x04n;
      }
    }
  }

  return castlingMoves;
}

export function getBlackCastlingMoves(
  castlingRights: string,
  occupied: bigint,
  whiteDangerZone: bigint,
): bigint {
  let castlingMoves = 0n;

  // Kingside Castling
  if (castlingRights.includes("k")) {
    if ((occupied & BLACK_K_EMPTY) === 0n) {
      if ((whiteDangerZone & BLACK_K_SAFE) === 0n) {
        castlingMoves |= 0x4000000000000000n;
      }
    }
  }

  // Queenside Castling
  if (castlingRights.includes("q")) {
    if ((occupied & BLACK_Q_EMPTY) === 0n) {
      if ((whiteDangerZone & BLACK_Q_SAFE) === 0n) {
        castlingMoves |= 0x0400000000000000n;
      }
    }
  }

  return castlingMoves;
}

// Get the single bit index from a power-of-2 bitboard
export function getSingleBitIndex(board: bigint): number {
  let index = 0;
  while (board > 1n) {
    board >>= 1n;
    index++;
  }
  return index;
}

// Extract square indices (0-63) from a bitboard
export function getBitIndices(board: bigint): number[] {
  const indices: number[] = [];
  for (let i = 0n; i < 64n; i++) {
    if ((board & (1n << i)) !== 0n) {
      indices.push(Number(i));
    }
  }
  return indices;
}

export function getPinMasks(
  kingSquare: number,
  friendlyPieces: bigint,
  occupied: bigint,
  enemyRooks: bigint,
  enemyBishops: bigint,
  enemyQueens: bigint,
): Record<number, bigint> {
  const pinMasks: Record<number, bigint> = {};

  const enemyOrthogonal = enemyRooks | enemyQueens;
  const enemyDiagonal = enemyBishops | enemyQueens;

  const orthogonalAttackers = getBitIndices(enemyOrthogonal);
  const diagonalAttackers = getBitIndices(enemyDiagonal);

  const kRank = Math.floor(kingSquare / 8);
  const kFile = kingSquare % 8;

  // Check Orthogonal Pins (Rooks & Queens)
  for (const attackerSq of orthogonalAttackers) {
    // Are they strictly on the same rank or file?
    if (attackerSq % 8 === kFile || Math.floor(attackerSq / 8) === kRank) {
      const ray = BETWEEN_RAYS?.[kingSquare]?.[attackerSq];
      const blockers = (ray as bigint) & occupied;

      // MAGIC TRICK: Does the ray hit exactly ONE piece?
      if (blockers !== 0n && (blockers & (blockers - 1n)) === 0n) {
        if ((blockers & friendlyPieces) !== 0n) {
          const pinnedSq = getSingleBitIndex(blockers);
          pinMasks[pinnedSq] = (ray as bigint) | (1n << BigInt(attackerSq));
        }
      }
    }
  }

  // Check Diagonal Pins (Bishops & Queens)
  for (const attackerSq of diagonalAttackers) {
    const df = Math.abs((attackerSq % 8) - kFile);
    const dr = Math.abs(Math.floor(attackerSq / 8) - kRank);

    if (df === dr) {
      const ray = BETWEEN_RAYS?.[kingSquare]?.[attackerSq];
      const blockers = (ray as bigint) & occupied;

      if (blockers !== 0n && (blockers & (blockers - 1n)) === 0n) {
        if ((blockers & friendlyPieces) !== 0n) {
          const pinnedSq = getSingleBitIndex(blockers);
          pinMasks[pinnedSq] = (ray as bigint) | (1n << BigInt(attackerSq));
        }
      }
    }
  }

  return pinMasks;
}
