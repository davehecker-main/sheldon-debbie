import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { readFileSync } from "node:fs";

const FILES = [
  new URL("../claude/commands/consult.md", import.meta.url),
  new URL("../profiles/shareview.md", import.meta.url),
];
if (process.env.CONSULT_COMMAND_FILE) FILES.push(process.env.CONSULT_COMMAND_FILE);
const PLACEHOLDER = "$ARGUMENTS";
const MIN_TICKS = 4;

// Walk the file as markdown does: a fence opens on a run of >= 3 backticks and
// closes only on a run at least as long with nothing else on the line. That
// second clause is the whole point - it is what makes a three-backtick block
// inside a four-backtick fence a *line of content* rather than a closer, and a
// checker that just paired up backtick lines would report the opposite.
function scanFences(text) {
  const lines = text.split("\n");
  const fences = [];
  let open = null;
  for (const line of lines) {
    const m = /^(`{3,})(.*)$/.exec(line);
    if (open === null) {
      if (m) open = { ticks: m[1].length, body: [] };
      continue;
    }
    if (m === null) {
      open.body.push(line);
      continue;
    }
    // Both clauses of the closer test carry weight. The length is what makes a
    // ``` block inside a ```` fence content rather than a closer; the empty
    // remainder is what stops an info-string line (```js) closing anything.
    const closes = m[1].length >= open.ticks && m[2].trim() === "";
    if (!closes) {
      open.body.push(line);
      continue;
    }
    fences.push({ ticks: open.ticks, body: open.body, terminated: true });
    open = null;
  }
  if (open !== null)
    fences.push({ ticks: open.ticks, body: open.body, terminated: false });
  return fences;
}

function readWire(text) {
  const occurrences = text.split(PLACEHOLDER).length - 1;
  const holding = scanFences(text).filter((f) =>
    f.body.some((l) => l.includes(PLACEHOLDER)),
  );
  const inside = holding.reduce(
    (n, f) =>
      n + f.body.reduce((k, l) => k + (l.split(PLACEHOLDER).length - 1), 0),
    0,
  );
  return { occurrences, holding, outside: occurrences - inside };
}

describe("every consult command fences the message placeholder", () => {
  for (const file of FILES) {
    const read = readWire(readFileSync(file, "utf8"));
    it(`${file} carries the placeholder exactly once`, () => {
      assert.equal(read.occurrences, 1);
    });
    it(`${file} puts it inside a fence, not in prose`, () => {
      assert.equal(read.outside, 0);
    });
    it(`${file} opens that fence with at least four backticks`, () => {
      assert.equal(read.holding.length, 1);
      assert.ok(read.holding[0].ticks >= MIN_TICKS);
    });
    it(`${file} terminates that fence`, () => {
      assert.deepEqual(read.holding.map((f) => f.terminated), [true]);
    });
  }
});

describe("the consult-wire pin rejects the drift it exists to catch", () => {
  const tick = String.fromCharCode(96);
  const run = (n) => tick.repeat(n);
  const fenced = (ticks) =>
    [
      "Dave typed this, verbatim:",
      "",
      run(ticks),
      PLACEHOLDER,
      run(ticks),
      "",
    ].join("\n");

  it("notices the placeholder missing entirely", () => {
    const read = readWire("Pass a direct /consult <message> argument verbatim.\n");
    assert.equal(read.occurrences, 0);
    assert.deepEqual(read.holding, []);
  });

  it("notices it sitting in prose rather than a fence", () => {
    const read = readWire(`Pass ${PLACEHOLDER} on to her.\n`);
    assert.equal(read.occurrences, 1);
    assert.equal(read.outside, 1);
  });

  it("notices a three-backtick fence", () => {
    assert.deepEqual(readWire(fenced(3)).holding.map((f) => f.ticks), [3]);
  });

  it("accepts four, and five", () => {
    assert.deepEqual(readWire(fenced(4)).holding.map((f) => f.ticks), [4]);
    assert.deepEqual(readWire(fenced(5)).holding.map((f) => f.ticks), [5]);
  });

  it("reads a three-backtick block inside a four-backtick fence as content", () => {
    const text = [
      run(4),
      PLACEHOLDER,
      run(3),
      "const x = 1;",
      run(3),
      run(4),
      "",
    ].join("\n");
    const read = readWire(text);
    assert.equal(read.holding.length, 1);
    assert.equal(read.holding[0].ticks, 4);
    assert.equal(read.holding[0].terminated, true);
    assert.equal(read.outside, 0);
  });

  it("notices an unterminated fence", () => {
    const read = readWire([run(4), PLACEHOLDER, ""].join("\n"));
    assert.deepEqual(read.holding.map((f) => f.terminated), [false]);
  });

  it("notices a second placeholder added elsewhere", () => {
    assert.equal(
      readWire(`${fenced(4)}\nand also ${PLACEHOLDER} again\n`).occurrences,
      2,
    );
  });
});
