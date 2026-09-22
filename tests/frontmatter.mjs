import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

function parse(text) {
  const lines = text.split("\n").map((line) => line.replace(/\r$/, ""));
  if (lines[0] !== "---") return { ok: false, reason: "missing opening delimiter" };
  const close = lines.findIndex((line, index) => index > 0 && line === "---");
  if (close === -1) return { ok: false, reason: "missing closing delimiter" };
  const keys = new Map();
  for (let index = 1; index < close; index++) {
    const line = lines[index];
    if (line.trim() === "" || line.trimStart().startsWith("#")) continue;
    const match = /^([A-Za-z][A-Za-z0-9_-]*):[ \t]*(.*)$/.exec(line);
    if (!match) return { ok: false, reason: "invalid key/value line" };
    if (keys.has(match[1])) return { ok: false, reason: "duplicate key" };
    keys.set(match[1], match[2].trim());
  }
  if (!keys.has("description")) return { ok: false, reason: "missing description" };
  if (keys.get("description") === "") return { ok: false, reason: "empty description" };
  return { ok: true, keys };
}

const files = [];
for (const dir of ["claude/commands", "claude/agents"]) {
  try {
    for (const file of readdirSync(dir)) if (file.endsWith(".md")) files.push(join(dir, file));
  } catch (error) {
    if (error.code !== "ENOENT") throw error;
  }
}
assert.ok(files.length > 0, "no Claude command or agent definitions found");
for (const file of files) {
  const result = parse(readFileSync(file, "utf8"));
  assert.equal(result.ok, true, file + ": " + result.reason);
}

assert.equal(parse("# command\n").ok, false);
assert.equal(parse("---\ndescription: x\n").ok, false);
assert.equal(parse("---\n## description: x\n---\n").ok, false);
assert.equal(parse("---\neffort: medium\n---\n").ok, false);
assert.equal(parse("---\ndescription:\n---\n").ok, false);
assert.equal(parse("---\ndescription: one\n  - Read\n---\n").ok, false);
assert.equal(parse("---\ndescription: one\ndescription: two\n---\n").ok, false);
const valid = parse("---\r\ndescription: Do a thing\r\neffort: medium\r\n---\r\n");
assert.equal(valid.ok, true);
assert.equal(valid.keys.get("effort"), "medium");
console.log("Claude frontmatter contracts passed");
