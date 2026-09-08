---
description: Consult Sheldon, the resident genius and expert
---

# /sheldon

Ask Sheldon whatever is in front of us: `/sheldon is this label worth keeping?`. With no
argument and a rule or mechanism in play, hand him that.

`.claude/agents/sheldon.md` owns the agent's judgment, his finding tags, and the output format.
`.claude/consult-protocol.md` owns the payload shape (the three labelled sections) and
the relay rules — **read it and follow it for every consult**. This file covers how Sheldon
is reached.

## How to consult him

**Once per session, then keep him.** Spawn him the first time with
`Agent(subagent_type: "sheldon", run_in_background: false)`. Every consult after that
goes to the same Sheldon with `SendMessage`, so he can see when a rule he already
flagged has been broken again — which is most of what he is for.

**Address him by the `agentId` the spawn result gives us, never by the bare name
`sheldon`.** `Agent` registers a name only when a `name` argument is passed, and we
pass none, so nothing in this session answers to that word — `SendMessage` would
resolve it against an address space that is not ours (other local sessions, prefix
matches, pinned names), and the consult either lands in one of those or fails outright
with `No agent named 'sheldon' is currently addressable`. Keep the id string for the
session. Lost it? Read the agent row from `ListAgents`; do not spawn a second Sheldon — one
with no memory of what he already flagged cannot notice it being broken again.

**Always synchronous.** `run_in_background: false`, without exception. The user asked a
question and is waiting on the answer.

**Hand him the situation, not our position.** When there is a decision on the table:
the decision, the evidence, and the alternative that was rejected — not our preference
and not our confidence. It arrives as the protocol's three labelled sections, never as
free prose.

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

## Acting on a finding

His findings are proposals. Nothing in them authorizes an edit.

## Relaying the answer back

**His answer must appear in the main conversation thread.** Finishing the `Agent` or
`SendMessage` call is not completion: its transcript pane is not the user-visible reply.
After the call returns, emit one assistant response in the parent session whose body
begins with the returned block, and do not end the slash-command turn until that response has
been sent. `.claude/consult-protocol.md` owns the rest of the relay rules (verbatim,
nothing after the block, the block never leaves chat).
