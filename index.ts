import { validateFen } from "./fen";
import { fenToBitboards } from "./generator";
import {
  getBlackPawnMoves,
  getKnightMoves,
  getWhitePawnMoves,
  getRookMoves,
  getBishopMoves,
  getQueenMoves,
  getKingMoves,
} from "./moves";

let currentFen = "";
const fenPrompt = "Enter FEN (or Ctrl+C to exit):\n> ";
const movePrompt = "Enter Move (or press Enter to skip):\n> ";

process.stdout.write(fenPrompt);

for await (const line of console) {
  const input = line.trim();

  if (!currentFen) {
    if (!input) {
      process.stdout.write(fenPrompt);
      continue;
    }
    currentFen = input;
    process.stdout.write(movePrompt);
  } else {
    const move = input;

    const { isValid, error } = validateFen(currentFen);

    if (!isValid) {
      console.error(`\n${error}`);
    } else {
      console.log(`\nValid FEN: ${currentFen}`);
      if (move) {
        console.log(`Move to process: ${move}`);
      } else {
        console.log(`No move provided.`);
      }

      const bitboards = fenToBitboards(currentFen);

      const whitePieces =
        bitboards.P |
        bitboards.B |
        bitboards.N |
        bitboards.R |
        bitboards.Q |
        bitboards.K;
      const blackPieces =
        bitboards.p |
        bitboards.b |
        bitboards.n |
        bitboards.r |
        bitboards.q |
        bitboards.k;
      const emptySquares = ~(whitePieces | blackPieces);

      console.log(`Bitboards:`, bitboards);

      console.log(
        `White Pawns moves:`,
        getWhitePawnMoves(bitboards.P, emptySquares, blackPieces).toString(16),
      );
      console.log(
        `Black Pawns moves:`,
        getBlackPawnMoves(bitboards.p, emptySquares, whitePieces).toString(16),
      );
      console.log(
        `White Knight moves:`,
        getKnightMoves(bitboards.N, whitePieces).toString(16),
      );

      console.log(
        `Black Knight moves:`,
        getKnightMoves(bitboards.n, blackPieces).toString(16),
      );

      console.log(
        `White Rook moves:`,
        getRookMoves(bitboards.R, emptySquares, whitePieces).toString(16),
      );

      console.log(
        `Black Rook moves:`,
        getRookMoves(bitboards.r, emptySquares, blackPieces).toString(16),
      );

      console.log(
        `White Bishop moves:`,
        getBishopMoves(bitboards.B, emptySquares, whitePieces).toString(16),
      );

      console.log(
        `Black Bishop moves:`,
        getBishopMoves(bitboards.b, emptySquares, blackPieces).toString(16),
      );

      console.log(
        `White Queen moves:`,
        getQueenMoves(bitboards.Q, emptySquares, whitePieces).toString(16),
      );

      console.log(
        `Black Queen moves:`,
        getQueenMoves(bitboards.q, emptySquares, blackPieces).toString(16),
      );

      console.log(
        `White King moves:`,
        getKingMoves(bitboards.K, whitePieces).toString(16),
      );

      console.log(
        `Black King moves:`,
        getKingMoves(bitboards.k, blackPieces).toString(16),
      );
    }

    currentFen = "";
    console.log("\n-------------------------");
    process.stdout.write(fenPrompt);
  }
}
