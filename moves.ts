import {
  CLAMP_64,
  NOT_A_FILE,
  NOT_AB_FILE,
  NOT_GH_FILE,
  NOT_H_FILE,
  RANK_4,
  RANK_5,
} from "./constants";

function getNorthAttacks(pieces: bigint, empty: bigint): bigint {
  let flood = pieces;
  let prop = empty;

  flood |= prop & (flood << 8n) & CLAMP_64;
  prop &= (prop << 8n) & CLAMP_64;

  flood |= prop & (flood << 16n) & CLAMP_64;
  prop &= (prop << 16n) & CLAMP_64;

  flood |= prop & (flood << 32n) & CLAMP_64;
  return (flood << 8n) & CLAMP_64;
}

function getSouthAttacks(pieces: bigint, empty: bigint): bigint {
  let flood = pieces;
  let prop = empty;

  flood |= prop & (flood >> 8n);
  prop &= prop >> 8n;

  flood |= prop & (flood >> 16n);
  prop &= prop >> 16n;

  flood |= prop & (flood >> 32n);

  return flood >> 8n;
}

function getEastAttacks(pieces: bigint, empty: bigint): bigint {
  let flood = pieces;
  let prop = empty & NOT_A_FILE;

  flood |= prop & (flood << 1n) & CLAMP_64;
  prop &= (prop << 1n) & CLAMP_64;

  flood |= prop & (flood << 2n) & CLAMP_64;
  prop &= (prop << 2n) & CLAMP_64;

  flood |= prop & (flood << 4n) & CLAMP_64;

  return (flood << 1n) & NOT_A_FILE & CLAMP_64;
}

function getWestAttacks(pieces: bigint, empty: bigint): bigint {
  let flood = pieces;
  let prop = empty & NOT_H_FILE;

  flood |= prop & (flood >> 1n);
  prop &= prop >> 1n;

  flood |= prop & (flood >> 2n);
  prop &= prop >> 2n;

  flood |= prop & (flood >> 4n);

  return (flood >> 1n) & NOT_H_FILE;
}

function getNorthEastAttacks(pieces: bigint, empty: bigint): bigint {
  let flood = pieces;
  let prop = empty & NOT_A_FILE;

  flood |= prop & (flood << 9n) & CLAMP_64;
  prop &= (prop << 9n) & CLAMP_64;

  flood |= prop & (flood << 18n) & CLAMP_64;
  prop &= (prop << 18n) & CLAMP_64;

  flood |= prop & (flood << 36n) & CLAMP_64;

  return (flood << 9n) & NOT_A_FILE & CLAMP_64;
}

function getNorthWestAttacks(pieces: bigint, empty: bigint): bigint {
  let flood = pieces;
  let prop = empty & NOT_H_FILE;

  flood |= prop & (flood << 7n) & CLAMP_64;
  prop &= (prop << 7n) & CLAMP_64;

  flood |= prop & (flood << 14n) & CLAMP_64;
  prop &= (prop << 14n) & CLAMP_64;

  flood |= prop & (flood << 28n) & CLAMP_64;

  return (flood << 7n) & NOT_H_FILE & CLAMP_64;
}

function getSouthEastAttacks(pieces: bigint, empty: bigint): bigint {
  let flood = pieces;
  let prop = empty & NOT_A_FILE;

  flood |= prop & (flood >> 7n);
  prop &= prop >> 7n;

  flood |= prop & (flood >> 14n);
  prop &= prop >> 14n;

  flood |= prop & (flood >> 28n);

  return (flood >> 7n) & NOT_A_FILE;
}

function getSouthWestAttacks(pieces: bigint, empty: bigint): bigint {
  let flood = pieces;
  let prop = empty & NOT_H_FILE;

  flood |= prop & (flood >> 9n);
  prop &= prop >> 9n;

  flood |= prop & (flood >> 18n);
  prop &= prop >> 18n;

  flood |= prop & (flood >> 36n);

  return (flood >> 9n) & NOT_H_FILE;
}

export function getKnightMoves(knights: bigint, ownPieces: bigint): bigint {
  let attacks = 0n;

  // Westward jumps
  attacks |= (knights & NOT_A_FILE) >> 17n; // SSW
  attacks |= (knights & NOT_AB_FILE) >> 10n; // SWW
  attacks |= (knights & NOT_AB_FILE) << 6n; // NWW
  attacks |= (knights & NOT_A_FILE) << 15n; // NNW

  // Eastward jumps
  attacks |= (knights & NOT_H_FILE) << 17n; // NNE
  attacks |= (knights & NOT_GH_FILE) << 10n; // NEE
  attacks |= (knights & NOT_GH_FILE) >> 6n; // SEE
  attacks |= (knights & NOT_H_FILE) >> 15n; // SSE

  attacks &= CLAMP_64;
  const validSquares = ~ownPieces & CLAMP_64;

  return attacks & validSquares;
}

export function getWhitePawnMoves(
  whitePawns: bigint,
  emptySquares: bigint,
  blackPieces: bigint,
): bigint {
  const singlePushes = (whitePawns << 8n) & CLAMP_64 & emptySquares;
  const doublePushes = (singlePushes << 8n) & CLAMP_64 & emptySquares & RANK_4;

  const capturesLeft =
    ((whitePawns & NOT_A_FILE) << 7n) & CLAMP_64 & blackPieces;
  const capturesRight =
    ((whitePawns & NOT_H_FILE) << 9n) & CLAMP_64 & blackPieces;

  return singlePushes | doublePushes | capturesLeft | capturesRight;
}

export function getBlackPawnMoves(
  blackPawns: bigint,
  emptySquares: bigint,
  whitePieces: bigint,
): bigint {
  const singlePushes = (blackPawns >> 8n) & emptySquares;
  const doublePushes = (singlePushes >> 8n) & emptySquares & RANK_5;

  const capturesLeft = ((blackPawns & NOT_A_FILE) >> 9n) & whitePieces;
  const capturesRight = ((blackPawns & NOT_H_FILE) >> 7n) & whitePieces;

  return singlePushes | doublePushes | capturesLeft | capturesRight;
}

export function getRookMoves(
  rooks: bigint,
  empty: bigint,
  ownPieces: bigint,
): bigint {
  const attacks =
    getNorthAttacks(rooks, empty) |
    getSouthAttacks(rooks, empty) |
    getEastAttacks(rooks, empty) |
    getWestAttacks(rooks, empty);

  return attacks & (~ownPieces & CLAMP_64);
}

export function getBishopMoves(
  bishops: bigint,
  empty: bigint,
  ownPieces: bigint,
): bigint {
  const attacks =
    getNorthEastAttacks(bishops, empty) |
    getNorthWestAttacks(bishops, empty) |
    getSouthEastAttacks(bishops, empty) |
    getSouthWestAttacks(bishops, empty);

  return attacks & (~ownPieces & CLAMP_64);
}

export function getQueenMoves(
  queens: bigint,
  empty: bigint,
  ownPieces: bigint,
): bigint {
  return (
    getRookMoves(queens, empty, ownPieces) |
    getBishopMoves(queens, empty, ownPieces)
  );
}

export function getKingMoves(king: bigint, ownPieces: bigint): bigint {
  let attacks = 0n;

  // Orthogonal single steps
  attacks |= (king << 8n) & CLAMP_64; // North
  attacks |= king >> 8n; // South
  attacks |= ((king & NOT_H_FILE) << 1n) & CLAMP_64; // East
  attacks |= (king & NOT_A_FILE) >> 1n; // West

  // Diagonal single steps
  attacks |= ((king & NOT_H_FILE) << 9n) & CLAMP_64; // NE
  attacks |= ((king & NOT_A_FILE) << 7n) & CLAMP_64; // NW
  attacks |= (king & NOT_H_FILE) >> 7n; // SE
  attacks |= (king & NOT_A_FILE) >> 9n; // SW

  // Ensure the King doesn't step on his own army
  const validSquares = ~ownPieces & CLAMP_64;
  return attacks & validSquares;
}
