export type BoardState = {
  whitePawns: bigint;
  whiteKnights: bigint;
  whiteBishops: bigint;
  whiteRooks: bigint;
  whiteQueens: bigint;
  whiteKing: bigint;

  blackPawns: bigint;
  blackKnights: bigint;
  blackBishops: bigint;
  blackRooks: bigint;
  blackQueens: bigint;
  blackKing: bigint;

  allWhitePieces: bigint;
  allBlackPieces: bigint;
  occupiedSquares: bigint;

  whiteToMove: boolean;
  castlingRights: number;
  enPassantTarget: bigint;
  halfMoveClock: number;
  fullMoveNumber: number;
};
