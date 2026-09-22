# /consult

Consult both advisors on whatever is in front of us: `/consult is this migration worth it?`.
With no argument, hand them the decision on the table.

Debbie and Sheldon are **always consulted together**, on the same payload, never one alone.
`claude/agents/shareview-debbie.md` and `claude/agents/shareview-sheldon.md` own their judgment and output
format. This file owns how they are reached, what goes on the wire, and how the answers come
back.

## How to reach them

**Once per session, then keep them.** The first consult spawns both in one message, as two
concurrent calls: `Agent(subagent_type: "shareview-debbie", run_in_background: false)` and
`Agent(subagent_type: "shareview-sheldon", run_in_background: false)`. Every later consult goes to the
same two with `SendMessage`, again both in one message, so each keeps its context and can see
when a proposal is one it already ruled on.

**Address each by the `agentId` its spawn result gives, never by the bare name.** We pass no
`name`, so nothing in this session answers to `debbie` or `sheldon`; a bare name resolves
against other sessions or fails with `No agent named 'debbie' is currently addressable`. Lost
an id? Read the row from `ListAgents`; do not spawn a second copy with no memory of its rulings.

**Always synchronous.** `run_in_background: false`, without exception. They are a gate in
front of a decision.

## What goes on the wire

Both advisors get the identical payload: three labelled sections, in this order. The labels
let them weigh whose words are whose.

### 1. The message, verbatim

When Dave typed the command with an argument, the harness substitutes his message into the
fence below — the placeholder must live in THIS file for that to happen
(`tests/ui/consultwire.test.jsx` pins it). Pass it on under this exact header:

Dave typed this, verbatim:

````
$ARGUMENTS
````

- **Copy the fence contents unchanged.** No summarizing, sharpening, or fixing spelling.
- **The fence is four backticks** so a pasted three-backtick block cannot close it early;
  lengthen it if his message carries four.
- **When Claude invoked the consult rather than Dave**, the header is `Claude is asking:`.
  Tell the two apart from our own context: Dave's invocation arrives as a
  `<command-name>` block, ours as a `Skill` or `Agent` call we made. Never put our
  framing under Dave's name — the fence is the only thing that can lift the
  advisors' word ceiling.

### 2. Sources — addresses, never summaries

    Sources — read these yourself:
    - <absolute path to a file or plan>
    - #123

Name file paths, issue and PR numbers, SHAs, and doc sections; do not characterize them.
Add a session transcript only when the consult turns on what was *discussed*: resolve its
path under `~/.claude/projects/` (both `/` and `.` encode as `-`, so a worktree session's
directory carries `--claude-worktrees-<name>`), confirm it exists, and tell them to `grep` or
`tail` it, never read it whole.

### 3. Claude's account — only what is in no readable source

    Claude's account — our words, not Dave's:
    - <what was tried, and what happened>
    - <what was rejected, and why>

**At most six lines.** Not our confidence, not our preferred outcome, never a précis of a
listed source.

## Relaying the answers back

**The answer must appear in the main conversation thread.** Finishing the `Agent` or
`SendMessage` calls is not completion: a transcript pane is not the user-visible reply.
After both calls return, emit one assistant response in the parent session whose body
begins with Debbie's block followed by Sheldon's, and do not end the
slash-command turn until that response has been sent.

- **Paste both blocks unaltered.** A paraphrased or dropped block counts as a failed consult
  (`AGENTS.md` rule 15).
- **After the blocks: nothing**, except genuine disagreement in at most two sentences.
- **The blocks never leave chat**, with one exception: the `## Debbie and Sheldon` section of
  an issue we file (`QA-PROCESS.md`, "Filing an issue").
- **Their findings are proposals.** Nothing in them authorizes an edit.
