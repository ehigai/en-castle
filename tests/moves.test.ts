import { describe, it, expect } from "bun:test";
import {
  getKnightMoves,
  getWhitePawnMoves,
  getBlackPawnMoves,
  getRookMoves,
  getBishopMoves,
  getQueenMoves,
  getKingMoves,
} from "../moves";
import { SquareBitboards, CLAMP_64 } from "../constants";

/**
 * Helper function to convert bitboard to array of square indices
 */
function bitboardToSquares(bb: bigint): number[] {
  const squares: number[] = [];
  for (let i = 0; i < 64; i++) {
    if ((bb & (1n << BigInt(i))) !== 0n) {
      squares.push(i);
    }
  }
  return squares;
}

/**
 * Helper function to get square name from index
 */
function getSquareName(index: number): string {
  const files = ["a", "b", "c", "d", "e", "f", "g", "h"];
  const ranks = ["1", "2", "3", "4", "5", "6", "7", "8"];
  const file = files[index % 8];
  const rank = ranks[Math.floor(index / 8)];
  return file + rank;
}

describe("Knight Moves", () => {
  it("should get valid knight moves from e4", () => {
    const knight = SquareBitboards.e4;
    const ownPieces = 0n;

    const moves = getKnightMoves(knight, ownPieces);
    const moveSquares = bitboardToSquares(moves);

    // Knight should have 8 possible moves from center
    expect(moveSquares.length).toBe(8);
    // Verify specific target squares: c3, c5, d2, d6, f2, f6, g3, g5
    expect(moveSquares).toContain(bitboardToSquares(SquareBitboards.c3)[0]);
    expect(moveSquares).toContain(bitboardToSquares(SquareBitboards.c5)[0]);
    expect(moveSquares).toContain(bitboardToSquares(SquareBitboards.d2)[0]);
    expect(moveSquares).toContain(bitboardToSquares(SquareBitboards.d6)[0]);
  });

  it("should not allow knight to capture own pieces", () => {
    const knight = SquareBitboards.e4;
    const ownPieces = SquareBitboards.c3 | SquareBitboards.d2;

    const moves = getKnightMoves(knight, ownPieces);
    const moveSquares = bitboardToSquares(moves);

    // c3 and d2 should be excluded
    const c3Index = bitboardToSquares(SquareBitboards.c3)[0];
    const d2Index = bitboardToSquares(SquareBitboards.d2)[0];
    expect(moveSquares).not.toContain(c3Index);
    expect(moveSquares).not.toContain(d2Index);
  });

  it("should handle knight in corner (a1)", () => {
    const knight = SquareBitboards.a1;
    const ownPieces = 0n;

    const moves = getKnightMoves(knight, ownPieces);
    const moveSquares = bitboardToSquares(moves);

    // From a1, knight can only move to b3 and c2
    expect(moveSquares.length).toBe(2);
  });

  it("should handle knight in opposite corner (h8)", () => {
    const knight = SquareBitboards.h8;
    const ownPieces = 0n;

    const moves = getKnightMoves(knight, ownPieces);
    const moveSquares = bitboardToSquares(moves);

    // From h8, knight can only move to f7 and g6
    expect(moveSquares.length).toBe(2);
  });
});

describe("White Pawn Moves", () => {
  it("should get single and double push from starting position", () => {
    const whitePawns = SquareBitboards.e2;
    // Only e3 and e4 are occupied, rest is empty
    const emptySquares =
      CLAMP_64 & ~whitePawns & ~SquareBitboards.a1 & ~SquareBitboards.a8;
    const blackPieces = 0n;

    const moves = getWhitePawnMoves(whitePawns, emptySquares, blackPieces);
    const moveSquares = bitboardToSquares(moves);

    // e2 pawn can move to e3 and e4
    expect(moveSquares.length).toBe(2);
  });

  it("should get single push when double push blocked", () => {
    const whitePawns = SquareBitboards.e2;
    // Block e4 but leave e3 empty
    const emptySquares = CLAMP_64 & ~whitePawns & ~SquareBitboards.e4;
    const blackPieces = 0n;

    const moves = getWhitePawnMoves(whitePawns, emptySquares, blackPieces);
    const moveSquares = bitboardToSquares(moves);

    // e2 pawn can only move to e3
    expect(moveSquares.length).toBe(1);
    expect(moveSquares).toContain(bitboardToSquares(SquareBitboards.e3)[0]);
  });

  it("should get capture moves", () => {
    const whitePawns = SquareBitboards.e4;
    const emptySquares = CLAMP_64;
    const blackPieces = SquareBitboards.d5 | SquareBitboards.f5;

    const moves = getWhitePawnMoves(whitePawns, emptySquares, blackPieces);
    const moveSquares = bitboardToSquares(moves);

    // e4 pawn can capture on d5 and f5
    expect(moveSquares).toContain(bitboardToSquares(SquareBitboards.d5)[0]);
    expect(moveSquares).toContain(bitboardToSquares(SquareBitboards.f5)[0]);
  });

  it("should prevent double push when blocked", () => {
    const whitePawns = SquareBitboards.e2;
    // Block e4 but leave e3 empty
    const emptySquares = CLAMP_64 & ~whitePawns & ~SquareBitboards.e4;
    const blackPieces = 0n;

    const moves = getWhitePawnMoves(whitePawns, emptySquares, blackPieces);
    const moveSquares = bitboardToSquares(moves);

    // Should only have one move (e3), not two
    expect(moveSquares.length).toBe(1);
  });
});

describe("Black Pawn Moves", () => {
  it("should get single and double push from starting position", () => {
    const blackPawns = SquareBitboards.e7;
    // e7 and surrounding squares empty
    const emptySquares =
      CLAMP_64 & ~blackPawns & ~SquareBitboards.a1 & ~SquareBitboards.a8;
    const whitePieces = 0n;

    const moves = getBlackPawnMoves(blackPawns, emptySquares, whitePieces);
    const moveSquares = bitboardToSquares(moves);

    // e7 pawn can move to e6 and e5
    expect(moveSquares.length).toBe(2);
  });

  it("should get capture moves", () => {
    const blackPawns = SquareBitboards.e5;
    const emptySquares = CLAMP_64;
    const whitePieces = SquareBitboards.d4 | SquareBitboards.f4;

    const moves = getBlackPawnMoves(blackPawns, emptySquares, whitePieces);
    const moveSquares = bitboardToSquares(moves);

    // e5 pawn can capture on d4 and f4
    expect(moveSquares).toContain(bitboardToSquares(SquareBitboards.d4)[0]);
    expect(moveSquares).toContain(bitboardToSquares(SquareBitboards.f4)[0]);
  });
});

describe("Rook Moves", () => {
  it("should get rook moves on empty board from e4", () => {
    const rooks = SquareBitboards.e4;
    const empty = CLAMP_64;
    const ownPieces = rooks;

    const moves = getRookMoves(rooks, empty, ownPieces);
    const moveSquares = bitboardToSquares(moves);

    // From e4, rook should move along rank 4 and file e
    // Expect rook to have many available moves on empty board
    expect(moveSquares.length).toBeGreaterThan(10);
    // Verify specific moves are available
    expect(moveSquares).toContain(bitboardToSquares(SquareBitboards.e1)[0]);
    expect(moveSquares).toContain(bitboardToSquares(SquareBitboards.a4)[0]);
  });

  it("should stop at blocked squares", () => {
    const rooks = SquareBitboards.e4;
    // Occupy e6 with own piece
    const ownPieces = rooks | SquareBitboards.e6;
    const empty = CLAMP_64 & ~ownPieces;

    const moves = getRookMoves(rooks, empty, ownPieces);
    const moveSquares = bitboardToSquares(moves);

    // Should not include e6 (own piece)
    const e6Index = bitboardToSquares(SquareBitboards.e6)[0];
    expect(moveSquares).not.toContain(e6Index);
    // Should still be able to move in other directions
    expect(moveSquares.length).toBeGreaterThan(0);
  });
});

describe("Bishop Moves", () => {
  it("should get bishop moves on empty board from e4", () => {
    const bishops = SquareBitboards.e4;
    const empty = CLAMP_64;
    const ownPieces = bishops;

    const moves = getBishopMoves(bishops, empty, ownPieces);
    const moveSquares = bitboardToSquares(moves);

    // From e4, bishop moves diagonally
    // NE: f5, g6, h7
    // NW: d5, c6, b7, a8
    // SE: f3, g2, h1
    // SW: d3, c2, b1
    expect(moveSquares.length).toBe(13);
  });

  it("should not capture own pieces", () => {
    const bishops = SquareBitboards.e4;
    const ownPieces = bishops | SquareBitboards.d3;
    const empty = CLAMP_64 & ~ownPieces;

    const moves = getBishopMoves(bishops, empty, ownPieces);
    const moveSquares = bitboardToSquares(moves);

    // Should not include d3
    expect(moveSquares).not.toContain(27); // d3
  });
});

describe("Queen Moves", () => {
  it("should get queen moves combining rook and bishop moves", () => {
    const queens = SquareBitboards.e4;
    const empty = CLAMP_64;
    const ownPieces = queens;

    const moves = getQueenMoves(queens, empty, ownPieces);
    const moveSquares = bitboardToSquares(moves);

    // Queen should have more moves than rook or bishop alone
    expect(moveSquares.length).toBeGreaterThan(14);
  });

  it("should block at first obstacle", () => {
    const queens = SquareBitboards.e4;
    const ownPieces = queens | SquareBitboards.e6 | SquareBitboards.g4;
    const empty = CLAMP_64 & ~ownPieces;

    const moves = getQueenMoves(queens, empty, ownPieces);
    const moveSquares = bitboardToSquares(moves);

    // Should not include blocked squares
    expect(moveSquares).not.toContain(44); // e6
    expect(moveSquares).not.toContain(30); // g4
  });
});

describe("King Moves", () => {
  it("should get all adjacent squares from center", () => {
    const king = SquareBitboards.e4;
    const ownPieces = king;

    const moves = getKingMoves(king, ownPieces);
    const moveSquares = bitboardToSquares(moves);

    // King from e4 can move to 8 adjacent squares
    expect(moveSquares.length).toBe(8);
  });

  it("should get limited moves from corner", () => {
    const king = SquareBitboards.a1;
    const ownPieces = king;

    const moves = getKingMoves(king, ownPieces);
    const moveSquares = bitboardToSquares(moves);

    // King from a1 can only move to 3 squares: a2, b1, b2
    expect(moveSquares.length).toBe(3);
  });

  it("should not allow king to capture own pieces", () => {
    const king = SquareBitboards.e4;
    const ownPieces = king | SquareBitboards.d5 | SquareBitboards.f4;

    const moves = getKingMoves(king, ownPieces);
    const moveSquares = bitboardToSquares(moves);

    // Should not include d5 or f4
    expect(moveSquares).not.toContain(35); // d5
    expect(moveSquares).not.toContain(29); // f4
    // Should still have other adjacent squares
    expect(moveSquares.length).toBeGreaterThan(0);
  });

  it("should get moves from edge squares", () => {
    const king = SquareBitboards.a4;
    const ownPieces = king;

    const moves = getKingMoves(king, ownPieces);
    const moveSquares = bitboardToSquares(moves);

    // King from a4 has 5 possible moves
    expect(moveSquares.length).toBe(5);
  });
});
