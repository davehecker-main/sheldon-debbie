import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const files = ["claude/agents/shareview-debbie.md", "claude/agents/shareview-sheldon.md"];
const sites = {
  template: /<the whole consult, as (?:Debbie|Sheldon), at most (\d+) words>/g,
  rule: /\*\*(\d+) words is a hard ceiling on the block\*\*/g,
  never: /^- Exceed (\d+) words in a block\.$/gm,
};
const anyCeiling = /\b(\d+)\s+words\b/g;
function readCeilings(text) {
  const found = {};
  const claimed = [];
  for (const [name, re] of Object.entries(sites)) {
    const hits = [...text.matchAll(re)];
    found[name] = hits.map((m) => Number(m[1]));
    for (const hit of hits) claimed.push([hit.index, hit.index + hit[0].length]);
  }
  const extras = [...text.matchAll(anyCeiling)].filter((m) => !claimed.some(([a, b]) => m.index >= a && m.index < b));
  return { found, extras, distinct: [...new Set(Object.values(found).flat())] };
}
for (const file of files) {
  const result = readCeilings(readFileSync(file, "utf8"));
  for (const values of Object.values(result.found)) assert.equal(values.length, 1, file + " missing ceiling site");
  assert.equal(result.extras.length, 0, file + " has an extra ceiling");
  assert.deepEqual(result.distinct, [150], file + " ceiling drifted");
}

const command = readFileSync("profiles/shareview.md", "utf8");
const placeholder = "$ARGUMENTS";
assert.equal(command.split(placeholder).length - 1, 1, "placeholder count");
const lines = command.split("\n");
const at = lines.findIndex((line) => line.includes(placeholder));
assert.ok(at > 0, "placeholder absent");
let open = -1;
for (let i = at - 1; i >= 0; i--) if (/^`{3,}/.test(lines[i])) { open = i; break; }
assert.ok(open >= 0, "placeholder is not fenced");
const ticks = lines[open].match(/^`+/)[0].length;
assert.ok(ticks >= 4, "fence shorter than four backticks");
assert.ok(lines.slice(at + 1).some((line) => new RegExp("^" + String.fromCharCode(96) + "{" + ticks + ",}$").test(line)), "fence is unterminated");
for (const pattern of [
  /consults are not relayed in chat/i,
  /originating thread for a `DROP`/i,
  /do not end the\s+slash-command turn until/i,
  /subagent_type: "shareview-debbie"/,
  /subagent_type: "shareview-sheldon"/,
]) assert.match(command, pattern);

const synthetic = ["<the whole consult, as Debbie, at most 200 words>", "**250 words is a hard ceiling on the block**", "- Exceed 200 words in a block."].join("\n");
assert.equal(readCeilings(synthetic).distinct.length, 2, "ceiling checker accepts drift");
console.log("sheldon-debbie: ShareView contracts passed");
