# 🏰 en-castle

[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=flat-square&logo=typescript&logoColor=white)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](#)

A blazingly fast, 100% stateless, mathematically pure bitboard chess engine core written in TypeScript. 

`en-castle` handles the hardest parts of chess logic—like En Passant discovered checks and castling rights revocation—without maintaining any internal state. It takes a FEN and an action, and returns the exact legal permutations or the next state. It is the perfect, zero-dependency engine to wrap in REST APIs, GraphQL resolvers, or WebSocket game managers.

Just pure, unadulterated bitwise math.

---

## ✨ Features

* **Purely Stateless:** No internal memory, no class instances, no side effects. `f(state, action) = newState`.
* **Advanced Bitboard Math:** Utilizes 64-bit integers (`BigInt`) for lightning-fast board representation and parallel-prefix ray casting.
* **Pre-calculated Ray Lookups:** O(1) performance for Absolute Pin masks and Check Evasions.
* **Perfect Edge-Case Handling:** Flawlessly calculates En Passant discovered checks, castling rights revocation, and the 50-move rule clocks.
* **Zero Dependencies:** A pristine dependency tree.
* **Fully Typed:** First-class TypeScript support with exported types.

---

## 📦 Installation

Built with modern workflows in mind. Install via your preferred package manager (pnpm recommended):

```bash
pnpm add en-castle
```
(Also supports npm install, yarn add, or bun add)

## 🚀 Usage

`en-castle` exposes a highly focused Public API.

### 1. Generating Legal Moves

Pass a standard FEN string to get an array of strictly legal UCI moves.

```typescript
import { generateLegalMoves } from "en-castle";

const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const moves = generateLegalMoves(startFen);

console.log(moves); 
// Output: ["a2a3", "a2a4", "b2b3", ..., "g1f3", "g1h3"]
```
### 2. Executing a move

Pass a FEN and a legal move to calculate the next state of the game. This automatically updates turn colors, castling rights, En Passant targets, and halfmove/fullmove clocks.

```typescript
import { makeMove } from "en-castle";

const startFen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
const move = "e2e4";

const nextFen = makeMove(startFen, move);

console.log(nextFen);
// Output: "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq e3 0 1"
```
### 3. Validating a FEN

Verify if an arbitrary FEN string is structurally sound before processing it.
```typescript
import { validateFen } from "en-castle";

const { isValid, error } = validateFen("invalid-fen-string");

if (!isValid) {
  console.error(error); 
}
```

## 🧠 Architecture (Under the Hood)

If you are curious about how en-castle works, it relies on a few core concepts:

- LERF (Little-Endian Rank-File): A1 is index 0, H8 is index 63.

- The Danger Zone: A unified bitboard of all squares attacked by the enemy, heavily optimizing King move generation and Castling validation.

- X-Ray Bug Prevention: Enemy sliders dynamically ignore the opposing King to highlight the squares behind the King, preventing illegal backward steps.

- The n & (n - 1) Trick: Bitwise intersections combined with power-of-2 checks to instantly find single-blocker Absolute Pins without looping.

## 👨‍💻 Author

Built with ⚡ by [ehigai](https://github.com/ehigai)

## 📄 License

MIT License. See LICENSE for details.

## Acknowledgements
Encastle uses open-source vector graphics for its chess pieces. Please see the [ATTRIBUTION.md](./ATTRIBUTION.md) file for full details, creators, and license requirements.