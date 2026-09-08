---
description: Consult Debbie, the second-engineer agent, on the current decision - she challenges scope, necessity, and whether the work is worth doing at all
---

# /debbie

Consult Debbie on whatever is currently being decided. With an argument, aim her at that:
`/debbie is this migration worth it?`. With none, hand her the decision in front of us.

`.claude/agents/debbie.md` owns her judgment, her verdicts, and her output format.
`.claude/consult-protocol.md` owns the payload shape (the three labelled sections) and
the relay rules — **read it and follow it for every consult**. This file covers how she
is reached and the rules that are hers alone.

## How to consult her

**Once per session, then keep her.** Spawn her the first time with
`Agent(subagent_type: "debbie", run_in_background: false)`. Every consult after that goes
to the same Debbie with `SendMessage`, so her context is intact and she can see when a
proposal is one she already ruled on. Repetition detection is a large part of why she
exists, and it only works if she is the same Debbie.

**Address her by the `agentId` the spawn result gives us, never by the bare name
`debbie`.** `Agent` registers a name only when a `name` argument is passed, and we pass
none, so nothing in this session answers to that word — `SendMessage` would resolve it
against an address space that is not ours (other local sessions, prefix matches, pinned
names), and the consult either lands in one of those or fails outright with
`No agent named 'debbie' is currently addressable`. Keep the id string for the session.
Lost it? Read her row from `ListAgents`; do not spawn a second Debbie — one with no
memory of what she already ruled on cannot tell us we are asking twice.

**Always synchronous.** `run_in_background: false`, without exception. She is a gate in
front of a decision; a background Debbie returns after we have already walked past the
thing she was meant to stop.

**Hand her the contract.** The proposal, the evidence behind it, and the alternative
that was rejected — not our confidence level, not our preferred outcome. It arrives as
the protocol's three labelled sections, never as free prose.

## The message, verbatim

When the user typed the command with an argument, the harness substitutes the user's message
into the fence below — the placeholder must live in THIS file for that to happen
(the installer keeps this placeholder in the command file). `.claude/consult-protocol.md` owns
the rules around it: never retype from memory, the `Claude is asking:` case, and
what the fence can lift. Pass it on under this exact header:

User typed this, verbatim:

````
$ARGUMENTS
````

## Debbie-specific rules

- Her block stays in chat, with the protocol's one exception: the `## Debbie` section
  of an issue we file carries her verdict and her own reasoning, quoted verbatim and
  contiguous (`local repo policy` rule 15; `local issue process`, "Filing an issue", owns the
  format). Do not ask her for a lighter variant; she no longer writes one — the quote
  is cut from the block we already have.
- `local repo policy` rule 15 owns when she must be consulted without being asked, and what
  proceeding over a `STOP` or `NARROW` requires.

## Relaying the answer back

**Her answer must appear in the main conversation thread.** Finishing the `Agent` or
`SendMessage` call is not completion: its transcript pane is not the user-visible reply.
After the call returns, emit one assistant response in the parent session whose body
begins with her block, and do not end the slash-command turn until that response has
been sent. `.claude/consult-protocol.md` owns the rest of the relay rules (verbatim,
nothing after the block, the block never leaves chat).
