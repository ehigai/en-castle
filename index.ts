import { validateFen } from "./core/fen";
import {
  bitboardsToFenBoard,
  fenBoardToBitboards,
  generateLegalMoves,
} from "./core/generator";
import {
  getBlackCastlingMoves,
  getBlackDangerZone,
  getWhiteCastlingMoves,
  getWhiteDangerZone,
} from "./core/legal";
import {
  getBlackPawnMoves,
  getKnightMoves,
  getWhitePawnMoves,
  getRookMoves,
  getBishopMoves,
  getQueenMoves,
  getKingMoves,
} from "./core/moves";
import { makeMove } from "./core/state";
import { getEnPassantSquare } from "./core/helpers";

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
        // console.log(`Move to process: ${move}`);
      } else {
        console.log(`No move provided.`);
      }

      const bitboards = fenBoardToBitboards(currentFen);

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

      const epSquare: bigint = getEnPassantSquare(currentFen);

      console.log(
        `White Pawns moves:`,
        getWhitePawnMoves(
          bitboards.P,
          emptySquares,
          blackPieces,
          epSquare,
        ).toString(16),
      );
      console.log(
        `Black Pawns moves:`,
        getBlackPawnMoves(
          bitboards.p,
          emptySquares,
          whitePieces,
          epSquare,
        ).toString(16),
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

      const occupied = whitePieces | blackPieces;

      // Generate the Danger Zones
      const whiteDangerZone = getWhiteDangerZone(bitboards, occupied);
      const blackDangerZone = getBlackDangerZone(bitboards, occupied);

      console.log(`\n--- Danger Zones ---`);
      console.log(`White Danger Zone:`, whiteDangerZone.toString(16));
      console.log(`Black Danger Zone:`, blackDangerZone.toString(16));

      // Extract castling rights from the FEN string
      const fenParts = currentFen.split(" ");
      const castlingRights = fenParts.length > 2 ? fenParts[2] : "-";

      console.log(`\n--- Castling Moves ---`);
      console.log(
        `White Castling:`,
        getWhiteCastlingMoves(
          castlingRights as string,
          occupied,
          blackDangerZone,
        ).toString(16),
      );
      console.log(
        `Black Castling:`,
        getBlackCastlingMoves(
          castlingRights as string,
          occupied,
          whiteDangerZone,
        ).toString(16),
      );
      const legalMoves = generateLegalMoves(currentFen);
      console.log(
        `\n--- Strictly Legal Move List (${legalMoves.length} total) ---`,
      );
      console.log(legalMoves.join(", "));

      if (move) {
        console.log(`\n--- Executing Move: ${move} ---`);

        // Ensure the move is legally allowed before making it
        if (legalMoves.includes(move)) {
          const nextFen = makeMove(currentFen, move);
          console.log(`:: Move Successful!`);
          console.log(`Next State (FEN): ${nextFen}`);
        } else {
          console.log(
            `:: ILLEGAL MOVE! '${move}' was blocked by the Validator.`,
          );
        }
      }

      const originalBoardPart = currentFen.split(" ")[0];
      const reconstructedBoard = bitboardsToFenBoard(bitboards);

      console.log(`\n--- Re-Encoder Test ---`);
      console.log(`Original FEN:      ${originalBoardPart}`);
      console.log(`Reconstructed FEN: ${reconstructedBoard}`);
    }

    currentFen = "";
    console.log("\n-------------------------");
    process.stdout.write(fenPrompt);
  }
}
