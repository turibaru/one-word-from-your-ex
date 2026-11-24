import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

// This little script reads the single word we saved beside it,
// checks that it really is just one word and nothing else,
// then drops a clean copy into the folder the grader points at.
// If anything looks off, it stops loudly instead of guessing.

function fail(message: string): never {
  console.error(`error: ${message}`);
  process.exit(1);
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR;
if (!outDir) {
  fail("MAKEFUN_OUTPUT_DIR is not set");
}

const here = dirname(fileURLToPath(import.meta.url));

let raw: string;
try {
  raw = readFileSync(join(here, "entry.txt"), "utf8");
} catch {
  fail("could not read entry.txt next to main.ts");
}

const word = raw.trim();
if (word.length === 0) {
  fail("entry.txt is empty or only whitespace");
}
if (/\s/.test(word)) {
  fail("entry.txt must contain exactly one word");
}
if (word.length < 1 || word.length > 24) {
  fail("entry must be 1 to 24 characters");
}

mkdirSync(outDir, { recursive: true });
writeFileSync(join(outDir, "entry.txt"), word, "utf8");
