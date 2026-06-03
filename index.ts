const prompt = "Enter a positen in FEN notation: ";
process.stdout.write(prompt);
for await (const line of console) {
  console.log(`You typed: ${line}`);
  process.stdout.write(prompt);
}
