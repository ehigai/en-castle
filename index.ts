import { validateFen } from "./fen";

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
      console.error(`\nInvalid FEN: ${error}`);
    } else {
      console.log(`\nValid FEN: ${currentFen}`);
      if (move) {
        console.log(`Move to process: ${move}`);
      } else {
        console.log(`No move provided.`);
      }
    }

    currentFen = "";
    console.log("\n-------------------------");
    process.stdout.write(fenPrompt);
  }
}
