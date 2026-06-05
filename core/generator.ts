import { CLAMP_64, SQUARES } from "./constants";
import {
  getBitIndices,
  getBlackCastlingMoves,
  getBlackDangerZone,
  getPinMasks,
  getSingleBitIndex,
  getWhiteCastlingMoves,
  getWhiteDangerZone,
} from "./legal";
import {
  getBishopMoves,
  getBlackPawnAttacks,
  getBlackPawnMoves,
  getEastAttacks,
  getKingMoves,
  getKnightMoves,
  getQueenMoves,
  getRookMoves,
  getWestAttacks,
  getWhitePawnAttacks,
  getWhitePawnMoves,
} from "./moves";
import { BETWEEN_RAYS } from "./rays";
import type { BItboards } from "./types";
import { getEnPassantSquare } from "./helpers";

/**
 * Parses the board portion of a FEN string into 12 piece bitboards.
 * Uses LERF mapping (A1 = index 0).
 */
export function fenBoardToBitboards(fen: string): BItboards {
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

/**
 * Converts 12 piece bitboards back into the board portion of a FEN string.
 */
export function bitboardsToFenBoard(bitboards: BItboards): string {
  let fen = "";

  // FEN starts at Rank 8 (Top) and goes down to Rank 1
  for (let rank = 7; rank >= 0; rank--) {
    let emptyCount = 0;

    // File A to H
    for (let file = 0; file < 8; file++) {
      const bitIndex = BigInt(rank * 8 + file);
      const mask = 1n << bitIndex;
      let foundPiece = "";

      // Check which piece occupies this bit
      if ((bitboards.P & mask) !== 0n) foundPiece = "P";
      else if ((bitboards.N & mask) !== 0n) foundPiece = "N";
      else if ((bitboards.B & mask) !== 0n) foundPiece = "B";
      else if ((bitboards.R & mask) !== 0n) foundPiece = "R";
      else if ((bitboards.Q & mask) !== 0n) foundPiece = "Q";
      else if ((bitboards.K & mask) !== 0n) foundPiece = "K";
      else if ((bitboards.p & mask) !== 0n) foundPiece = "p";
      else if ((bitboards.n & mask) !== 0n) foundPiece = "n";
      else if ((bitboards.b & mask) !== 0n) foundPiece = "b";
      else if ((bitboards.r & mask) !== 0n) foundPiece = "r";
      else if ((bitboards.q & mask) !== 0n) foundPiece = "q";
      else if ((bitboards.k & mask) !== 0n) foundPiece = "k";

      if (foundPiece) {
        if (emptyCount > 0) {
          fen += emptyCount.toString();
          emptyCount = 0;
        }
        fen += foundPiece;
      } else {
        emptyCount++;
      }
    }

    if (emptyCount > 0) {
      fen += emptyCount.toString();
    }

    if (rank > 0) {
      fen += "/";
    }
  }

  return fen;
}

/**
 * Master Orchestrator.
 * Parses a FEN and returns an array of all strictly legal moves in UCI format (e.g., "e2e4").
 */
export function generateLegalMoves(fen: string): string[] {
  const bitboards = fenBoardToBitboards(fen);
  const epSquare = getEnPassantSquare(fen);

  // Parse FEN metadata
  const fenParts = fen.split(" ");
  const activeColor = fenParts[1] || "w";
  const castlingRights = fenParts[2] || "-";

  // Generate summary boards
  // prettier-ignore
  const whitePieces = bitboards.P | bitboards.B | bitboards.N | bitboards.R | bitboards.Q | bitboards.K;
  // prettier-ignore
  const blackPieces = bitboards.p | bitboards.b | bitboards.n | bitboards.r | bitboards.q | bitboards.k;

  const occupied = whitePieces | blackPieces;
  const emptySquares = ~occupied & CLAMP_64;

  const isWhite = activeColor === "w";
  const friendlyPieces = isWhite ? whitePieces : blackPieces;
  const ownKingBoard = isWhite ? bitboards.K : bitboards.k;
  const kingSquare = getSingleBitIndex(ownKingBoard);

  // Generate the Enemy Danger Zone
  const enemyDangerZone = isWhite
    ? getBlackDangerZone(bitboards, occupied)
    : getWhiteDangerZone(bitboards, occupied);

  // Identify Checkers (Backward scanning from the King's square)
  const kingBit = 1n << BigInt(kingSquare);
  let checkers = 0n;

  // prettier-ignore
  if (isWhite) {
    checkers |= getWhitePawnAttacks(kingBit) & bitboards.p;
    checkers |= getKnightMoves(kingBit, 0n) & bitboards.n;
    checkers |= getBishopMoves(kingBit, emptySquares, 0n) & (bitboards.b | bitboards.q);
    checkers |= getRookMoves(kingBit, emptySquares, 0n) & (bitboards.r | bitboards.q);
  } else {
    checkers |= getBlackPawnAttacks(kingBit) & bitboards.P;
    checkers |= getKnightMoves(kingBit, 0n) & bitboards.N;
    checkers |= getBishopMoves(kingBit, emptySquares, 0n) & (bitboards.B | bitboards.Q);
    checkers |= getRookMoves(kingBit, emptySquares, 0n) & (bitboards.R | bitboards.Q);
  }

  const checkerIndices = getBitIndices(checkers);
  const inCheck = checkerIndices.length > 0;
  const inDoubleCheck = checkerIndices.length >= 2;

  // Construct the Check Mask
  let checkMask = CLAMP_64;
  if (inDoubleCheck) {
    checkMask = 0n; // Only the King can move during double check
  } else if (inCheck) {
    const checkerSq = checkerIndices[0]!;

    // Safely extract the ray with optional chaining and a fallback to 0n
    const ray = BETWEEN_RAYS[kingSquare]?.[checkerSq] ?? 0n;

    // Must either capture the checker or block its line of sight
    checkMask = ray | (1n << BigInt(checkerSq));
  }

  // Calculate Absolute Pins
  // prettier-ignore
  const pinMasks = isWhite
    ? getPinMasks( kingSquare, whitePieces, occupied, bitboards.r, bitboards.b, bitboards.q,)
    : getPinMasks( kingSquare, blackPieces, occupied, bitboards.R, bitboards.B, bitboards.Q,);

  const legalMovesList: string[] = [];

  // Generate legal moves for every square holding a friendly piece
  for (let srcSq = 0; srcSq < 64; srcSq++) {
    const srcBit = 1n << BigInt(srcSq);
    if ((srcBit & friendlyPieces) === 0n) continue;

    let moves = 0n;
    const isKing = srcSq === kingSquare;

    // Isolate piece types and fetch their pseudo-legal bitboards
    if (isKing) {
      moves = getKingMoves(srcBit, friendlyPieces) & ~enemyDangerZone;
      // Add castling if not in check
      if (!inCheck) {
        moves |= isWhite
          ? getWhiteCastlingMoves(castlingRights, occupied, enemyDangerZone)
          : getBlackCastlingMoves(castlingRights, occupied, enemyDangerZone);
      }
    } else {
      if (inDoubleCheck) continue; // Non-king pieces cannot move in double check

      // Identify specific piece type
      if (srcBit & (bitboards.P | bitboards.p)) {
        moves = isWhite
          ? getWhitePawnMoves(srcBit, emptySquares, blackPieces, epSquare)
          : getBlackPawnMoves(srcBit, emptySquares, whitePieces, epSquare);
      } else if (srcBit & (bitboards.N | bitboards.n)) {
        moves = getKnightMoves(srcBit, friendlyPieces);
      } else if (srcBit & (bitboards.B | bitboards.b)) {
        moves = getBishopMoves(srcBit, emptySquares, friendlyPieces);
      } else if (srcBit & (bitboards.R | bitboards.r)) {
        moves = getRookMoves(srcBit, emptySquares, friendlyPieces);
      } else if (srcBit & (bitboards.Q | bitboards.q)) {
        moves = getQueenMoves(srcBit, emptySquares, friendlyPieces);
      }

      // Restrict move targets by check defense requirements and absolute pin rays
      moves &= checkMask;
      if (pinMasks[srcSq] !== undefined) {
        moves &= pinMasks[srcSq]!;
      }

      if ((moves & epSquare) !== 0n) {
        const epIndex = getSingleBitIndex(epSquare);
        const capturedPawnIndex = isWhite ? epIndex - 8 : epIndex + 8;

        const simulatedOccupied =
          (occupied ^ srcBit ^ (1n << BigInt(capturedPawnIndex))) | epSquare;

        const enemyOrthogonal = isWhite
          ? bitboards.r | bitboards.q
          : bitboards.R | bitboards.Q;

        let isEpSafe = true;

        // We only need to check horizontal safety if the King is on the same rank as the pawns
        if (Math.floor(kingSquare / 8) === Math.floor(srcSq / 8)) {
          const kRank = Math.floor(kingSquare / 8);
          const rankMask = 0xffn << BigInt(kRank * 8);
          const rankOccupied = simulatedOccupied & rankMask;

          // Does a ray from the king hit an enemy sliding piece first?
          const kingBit = 1n << BigInt(kingSquare);
          const eastRay = getEastAttacks(kingBit, ~rankOccupied & CLAMP_64);
          const westRay = getWestAttacks(kingBit, ~rankOccupied & CLAMP_64);

          if (((eastRay | westRay) & enemyOrthogonal) !== 0n) {
            isEpSafe = false;
          }
        }

        if (!isEpSafe) {
          moves &= ~epSquare;
        }
      }
    }

    const destIndices = getBitIndices(moves);
    const fromName = SQUARES[srcSq]!;
    for (const destSq of destIndices) {
      const toName = SQUARES[destSq]!;
      legalMovesList.push(`${fromName}${toName}`);
    }
  }

  return legalMovesList;
}
