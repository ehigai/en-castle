import { bitboardsToFenBoard, fenBoardToBitboards } from "./generator";
import type { BItboards, MoveIndices } from "./types";
import { indexToSquare, squareToIndex } from "./helpers";

function getIndicesFromMove(move: string): MoveIndices {
  const fromSquare = move.substring(0, 2);
  const toSquare = move.substring(2, 4);
  return {
    fromIndex: squareToIndex(fromSquare),
    toIndex: squareToIndex(toSquare),
  };
}

// Main function to make a move and return the new FEN
export function makeMove(fen: string, move: string): string {
  const bitBoards = fenBoardToBitboards(fen);
  const parts = fen.split(" ");

  let activeColor = parts[1]!;
  let castlingRights = parts[2]!;
  let epTarget = parts[3]!;
  let halfMove = parseInt(parts[4]!, 10);
  let fullMove = parseInt(parts[5]!, 10);

  const { fromIndex, toIndex } = getIndicesFromMove(move);
  const promotion = move.length === 5 ? move[4] : null;

  const fromBit = 1n << BigInt(fromIndex);
  const toBit = 1n << BigInt(toIndex);

  let movingPiece: keyof BItboards | null = null;
  let capturedPiece: keyof BItboards | null = null;

  // Find the moving piece
  for (const piece in bitBoards) {
    if ((bitBoards[piece as keyof BItboards] & fromBit) !== 0n) {
      movingPiece = piece as keyof BItboards;
      break;
    }
  }
  if (!movingPiece) return fen; // Invalid move, no piece at fromSquare

  // Identify captured piece if any
  for (const piece in bitBoards) {
    if ((bitBoards[piece as keyof BItboards] & toBit) !== 0n) {
      capturedPiece = piece as keyof BItboards;
      break;
    }
  }

  // Make the move on the bitboards
  bitBoards[movingPiece] &= ~fromBit;
  bitBoards[movingPiece] |= toBit;

  // Remove captured piece
  if (capturedPiece) {
    bitBoards[capturedPiece] &= ~toBit;
  }

  // :: Promotion
  if (promotion) {
    bitBoards[movingPiece] &= ~toBit; // Remove the pawn
    const promoPiece =
      activeColor === "w" ? promotion.toUpperCase() : promotion.toLowerCase();
    bitBoards[promoPiece as keyof BItboards] |= toBit; // Add the new piece
  }

  // :: En Passant Capture
  const isPawn = movingPiece.toLowerCase() === "p";
  if (isPawn && move.substring(2, 4) === epTarget) {
    const capturedPawnIndex = activeColor === "w" ? toIndex - 8 : toIndex + 8;
    const enemyPawn = activeColor === "w" ? "p" : "P";
    bitBoards[enemyPawn] &= ~(1n << BigInt(capturedPawnIndex));
    capturedPiece = enemyPawn; // Mark as capture for the halfmove clock
  }

  // :: Castling
  const isKing = movingPiece.toLowerCase() === "k";
  if (isKing && Math.abs(toIndex - fromIndex) === 2) {
    if (toIndex === 6) {
      // White Kingside
      bitBoards.R &= ~(1n << 7n);
      bitBoards.R |= 1n << 5n;
    } else if (toIndex === 2) {
      // White Queenside
      bitBoards.R &= ~(1n << 0n);
      bitBoards.R |= 1n << 3n;
    } else if (toIndex === 62) {
      // Black Kingside
      bitBoards.r &= ~(1n << 63n);
      bitBoards.r |= 1n << 61n;
    } else if (toIndex === 58) {
      // Black Queenside
      bitBoards.r &= ~(1n << 56n);
      bitBoards.r |= 1n << 59n;
    }
  }

  // :: Metadata Updates
  // Update en-passant target - only if a pawn moves two squares
  epTarget = "-";
  if (isPawn && Math.abs(toIndex - fromIndex) === 16) {
    const epIndex = activeColor === "w" ? fromIndex + 8 : fromIndex - 8;
    epTarget = indexToSquare(epIndex);
  }

  // Update castling rights
  let newCastlingRights = castlingRights;
  if (newCastlingRights !== "-") {
    // Loose all castling rights if the king moves
    if (movingPiece === "K")
      newCastlingRights = newCastlingRights.replace(/[KQ]/g, "");
    if (movingPiece === "k")
      newCastlingRights = newCastlingRights.replace(/[kq]/g, "");

    if (fromIndex === 0 || toIndex === 0)
      newCastlingRights = newCastlingRights.replace("Q", ""); // White Queenside Rook
    if (fromIndex === 7 || toIndex === 7)
      newCastlingRights = newCastlingRights.replace("K", ""); // White Kingside Rook
    if (fromIndex === 56 || toIndex === 56)
      newCastlingRights = newCastlingRights.replace("q", ""); // Black Queenside Rook
    if (fromIndex === 63 || toIndex === 63)
      newCastlingRights = newCastlingRights.replace("k", ""); // Black Kingside Rook
  }
  castlingRights = newCastlingRights === "" ? "-" : newCastlingRights;

  // Update active color
  activeColor = activeColor === "w" ? "b" : "w";

  // Update halfmove clock
  halfMove = isPawn || capturedPiece ? 0 : halfMove + 1;

  // Update fullmove number
  if (activeColor === "w") {
    fullMove += 1;
  }

  // :: Construct new FEN
  const newBoardString = bitboardsToFenBoard(bitBoards);
  return `${newBoardString} ${activeColor} ${castlingRights} ${epTarget} ${halfMove} ${fullMove}`;
}
