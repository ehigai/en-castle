/**
 * The validateFen function below is adapted from chess.js.
 * * Copyright (c) 2025, Jeff Hlywa (jhlywa@gmail.com)
 * All rights reserved.
 * * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met:
 * * 1. Redistributions of source code must retain the above copyright notice,
 * this list of conditions and the following disclaimer.
 * 2. Redistributions in binary form must reproduce the above copyright notice,
 * this list of conditions and the following disclaimer in the documentation
 * and/or other materials provided with the distribution.
 * * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 */

export function validateFen(fen: string): { isValid: boolean; error?: string } {
  // 1. Split into the 6 standard FEN fields
  const parts = fen.trim().split(/\s+/);
  if (parts.length !== 6) {
    return {
      isValid: false,
      error: "Invalid FEN: must contain exactly six space-delimited fields",
    };
  }

  const [
    pieces,
    activeColor,
    castling,
    enPassant,
    halfMoveClock,
    fullMoveNumber,
  ] = parts;

  if (
    pieces === undefined ||
    activeColor === undefined ||
    castling === undefined ||
    enPassant === undefined ||
    halfMoveClock === undefined ||
    fullMoveNumber === undefined
  ) {
    return { isValid: false, error: "Invalid FEN: missing fields" };
  }

  // 2. Full move number must be an integer > 0
  const parsedMoveNumber = parseInt(fullMoveNumber, 10);
  if (isNaN(parsedMoveNumber) || parsedMoveNumber <= 0) {
    return {
      isValid: false,
      error: "Invalid FEN: move number must be a positive integer",
    };
  }

  // 3. Half move counter must be an integer >= 0
  const parsedHalfMoves = parseInt(halfMoveClock, 10);
  if (isNaN(parsedHalfMoves) || parsedHalfMoves < 0) {
    return {
      isValid: false,
      error: "Invalid FEN: half move counter must be a non-negative integer",
    };
  }

  // 4. Valid en-passant string (either "-" or standard algebraic square on 3rd/6th rank)
  if (!/^(-|[a-h][36])$/.test(enPassant)) {
    return {
      isValid: false,
      error: "Invalid FEN: en-passant square is invalid",
    };
  }

  // 5. Valid castling string
  if (/[^kKqQ-]/.test(castling)) {
    return {
      isValid: false,
      error: "Invalid FEN: castling availability is invalid",
    };
  }

  // 6. Side to move must be "w" or "b"
  if (!/^(w|b)$/.test(activeColor)) {
    return { isValid: false, error: "Invalid FEN: side-to-move is invalid" };
  }

  // 7. Piece data must contain exactly 8 rows
  const rows = pieces.split("/");
  if (rows.length !== 8) {
    return {
      isValid: false,
      error: "Invalid FEN: piece data does not contain 8 '/'-delimited rows",
    };
  }

  // 8. Every row must be valid
  for (const row of rows) {
    let sumSquares = 0;
    let previousWasNumber = false;

    for (const char of row) {
      // Chess FEN empty squares are denoted by digits 1-8
      if (/[1-8]/.test(char)) {
        if (previousWasNumber) {
          return {
            isValid: false,
            error: "Invalid FEN: piece data is invalid (consecutive numbers)",
          };
        }
        sumSquares += parseInt(char, 10);
        previousWasNumber = true;
      } else {
        if (!/^[prnbqkPRNBQK]$/.test(char)) {
          return {
            isValid: false,
            error: "Invalid FEN: piece data is invalid (invalid piece)",
          };
        }
        sumSquares += 1;
        previousWasNumber = false;
      }
    }

    if (sumSquares !== 8) {
      return {
        isValid: false,
        error:
          "Invalid FEN: piece data is invalid (incorrect number of squares in rank)",
      };
    }
  }

  // 9. Is en-passant square legal given the active color?
  if (enPassant !== "-") {
    const epRank = enPassant[1];

    if (epRank === "3" && activeColor === "w") {
      return {
        isValid: false,
        error: "Invalid FEN: illegal en-passant square for white",
      };
    }
    if (epRank === "6" && activeColor === "b") {
      return {
        isValid: false,
        error: "Invalid FEN: illegal en-passant square for black",
      };
    }
  }

  // 10. Does the board contain exactly one white king and one black king?
  const whiteKings = pieces.match(/K/g)?.length ?? 0;
  const blackKings = pieces.match(/k/g)?.length ?? 0;

  if (whiteKings === 0)
    return { isValid: false, error: "Invalid FEN: missing white king" };
  if (whiteKings > 1)
    return { isValid: false, error: "Invalid FEN: too many white kings" };
  if (blackKings === 0)
    return { isValid: false, error: "Invalid FEN: missing black king" };
  if (blackKings > 1)
    return { isValid: false, error: "Invalid FEN: too many black kings" };

  // 11. Are there any pawns on the 1st or 8th ranks?
  const firstRow = rows[0];
  const lastRow = rows[7];

  // Narrow types so TS knows these rows aren't undefined
  if (firstRow === undefined || lastRow === undefined) {
    return { isValid: false, error: "Invalid FEN: missing rows" };
  }

  if (/[pP]/.test(firstRow) || /[pP]/.test(lastRow)) {
    return {
      isValid: false,
      error: "Invalid FEN: pawns cannot be on the first or eighth ranks",
    };
  }

  return { isValid: true };
}
// TODO: Add more FEN validation rules (e.g. check for impossible positions, validate castling rights against piece placement, validate valid turn sequences(white makes first move), etc.)
