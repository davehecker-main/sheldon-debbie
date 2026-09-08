# The consult protocol — shared by /debbie, /sheldon, and /rex

How a consult travels to an advisor agent and how the answer comes back. Each
command's own file says how its agent is reached (spawn, persistence,
addressing) and carries its agent-specific rules; this file owns the payload
shape and the relay, so the three cannot drift apart.

## What goes on the wire

A consult is three labelled sections, in this order. **The labels are
load-bearing**: what the agent is handed is written by the actor whose work it
is judging, and it can only weigh that if it can see which words are whose
(one undifferentiated blob is what this exists to prevent).

### 1. The message, verbatim

When the user typed `/<command> <message>`, the harness substitutes their message into
the `$ARGUMENTS` placeholder **in the command file itself** — each of the three
command files therefore carries the fenced placeholder in its own text
(installer copies this file into the command directory; a placeholder that lives only
in this shared file is never substituted). The shape each command carries:

User typed this, verbatim:

    ````
    $ARGUMENTS
    ````

- **The fence is four backticks on purpose.** A three-backtick block inside the
  user's own message — a pasted plan excerpt, code, a diff — would otherwise close it
  early and spill the rest of their words into prose. If their message carries a
  four-backtick fence of its own, lengthen this one further.
- **Copy the contents of that fence into the consult unchanged. Do not retype
  it from memory.** No summarizing, no sharpening, no fixing their spelling. The user
  is talking to the advisor; we are the wire. This overrides any "describe the
  situation" rule in the command's own file — that rule governs only the case
  where the user typed nothing.
- **When Claude invoked the consult rather than the user**, the fence is empty or
  holds our own words, and the header says so: `Claude is asking:`. Never put
  our framing under the user's name. We can tell the two apart from our own
  context: the user invocation arrives as a `<command-name>` block, ours as a
  `Skill` or `Agent` call we made. For Debbie and Sheldon the fence is also
  the only thing that can lift the word ceiling their agent files set, so
  labelling our words as the user's words grants us an authority that is the user's alone.

### 2. Sources — addresses, never summaries

Name the primary sources and let the advisor read them: file paths, plan
paths, issue and PR numbers, commit SHAs, the rule or doc section under
discussion.

    Sources — read these yourself:
    - ~/.claude/plans/<name>.md
    - #123

**Name them; do not characterize them.** A description of a source is our
summary wearing a source's clothes — and it is what gets ruled on
instead of the 3,238-word plan it stood in front of.

Where the consult turns on what was *discussed* rather than on anything in a
file, add the session transcript — and **resolve its path rather than assuming
one**: the directory under `~/.claude/projects/` is derived from the session's
working directory, so a worktree session writes to
the project-specific worktree transcript directory, not the main
tree's directory. Confirm the file exists before naming it, and tell the
advisor to `grep` or `tail` it — transcripts run 125KB to 7.7MB and must never
be read whole. Expect a permission prompt: the grant lives in
`.claude/settings.local.json`, which is gitignored and absent from worktrees.
Leave the transcript out when the consult turns on a file, which is most of
the time.

### 3. Claude's account — only what is in no readable source

Last, and labelled as ours:

    Claude's account — our words, not the user's:
    - <what was already tried, and what happened>
    - <what was rejected, and why>
    - <a constraint from the conversation that is written down nowhere>

**At most six lines**, carrying only what the advisor cannot reach through
section 2. Not our confidence level, not our preferred outcome, and never a
précis of a file we listed above. If it runs past six lines, the thing being
described belongs in a file the advisor can read — write it there and cite it
instead.

## Relaying the answer back

**The answer must appear in the main conversation thread.** Finishing the
`Agent` or `SendMessage` call is not completion: its transcript pane is not the
user-visible reply. After the call returns, emit one assistant response in the
parent session whose body begins with the advisor's returned text, and do not
end the slash-command turn until that response has been sent.

- **Paste the block unaltered, header line and all.** A paraphrased block is
  indistinguishable from never having consulted (`local repo policy` rule 15), so it
  counts as a failed consult. Never drop a verdict or finding that is
  inconvenient, and never present the advisor's reasoning as ours.
- **After the block: nothing.** Add text only on genuine disagreement, in at
  most two sentences, after the block — never inside it (appended
  analysis doubled the apparent length of the block).
- **The block never leaves chat.** It is for the user; it never reaches a GitHub
  comment, PR body, or issue thread whole. In the repo record we write
  our own account of what was ruled and why it mattered. The one exception is
  the `## Debbie` section of an issue we file, which carries her verdict and
  reasoning quoted verbatim and contiguous — `local issue process`, "Filing an
  issue", owns that format.
