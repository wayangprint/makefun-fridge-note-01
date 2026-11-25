// The fridge has been keeping score since Monday.
// It saw the cake go behind the salad, and the salad —
// a notorious gossip — told it everything before lunch.

import * as fs from "node:fs";
import * as path from "node:path";

// The memo itself, verbatim, 115 characters of quiet judgment.
const FRIDGE_MEMO =
  "Day 6 of the diet. I watched you hide the cake behind the salad. The salad told me. The salad is also disappointed.";

// Where the memo lands: the harness folder when set, /output otherwise.
const DROP_FOLDER = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

// Shape rule: exactly one line, 1–200 characters, not blank.
function guardLineShape(text: string): void {
  const clean = text.trim();
  if (text.length === 0 || text.length > 200 || clean.length === 0 || text.includes("\n")) {
    throw new Error("memo must be a single non-empty line of at most 200 characters");
  }
}

// Pin the memo to the door: make the folder, write the file, no trailing newline.
function pinMemo(): string {
  const target = path.join(DROP_FOLDER, "entry.txt");
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, FRIDGE_MEMO, "utf8");
  return target;
}

guardLineShape(FRIDGE_MEMO);
const pinnedPath = pinMemo();

// Read it back off the door: the pinned memo must match, byte for byte.
function confirmPinnedMemo(pinned: string, expected: string): void {
  const onDoor = fs.readFileSync(pinned, "utf8");
  if (onDoor !== expected || Buffer.byteLength(onDoor, "utf8") !== expected.length) {
    throw new Error("pinned memo does not match the memo");
  }
}

confirmPinnedMemo(pinnedPath, FRIDGE_MEMO);
process.stdout.write(fs.readFileSync(pinnedPath, "utf8") + "\n");
