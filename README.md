# Sheldon and Debbie

<img src="assets/sheldon-debbie.jpg" alt="Sheldon and Debbie" width="360">

Portable advisor-agent definitions for Codex and Claude-style agent setups.

- **Sheldon** is a read-only technical advisor: precise, evidence-oriented, and useful for questions about quality, architecture, testing, and tradeoffs.
- **Debbie** is a read-only second engineer: pessimistic by design, useful before you spend effort on a plan, scope expansion, or workflow change.

Both agents are intentionally read-only. They are meant to inspect, challenge, and advise; they should not edit files, post comments, label issues, close issues, or merge pull requests.

## Install

Clone the repo and run:

```sh
./scripts/install.sh
```

That installs:

- Codex agents into `~/.codex/agents/`
- Claude agents into `~/.claude/agents/`
- Claude slash-command files into `~/.claude/commands/`
- The shared Claude consult protocol into `~/.claude/consult-protocol.md`

You can override the destination homes:

```sh
CODEX_HOME=/path/to/.codex CLAUDE_HOME=/path/to/.claude ./scripts/install.sh
```

## Files

```text
codex/agents/
  debbie.toml
  sheldon.toml

claude/
  agents/
    debbie.md
    sheldon.md
  commands/
    debbie.md
    sheldon.md
  consult-protocol.md
```

## Usage

In Codex, select or invoke the installed agent definition where your client exposes custom agents.

In Claude-style setups, use:

```text
/debbie <proposal or question>
/sheldon <technical question or decision>
```

The command files assume a subagent-capable environment with `Agent` and `SendMessage` semantics. If your local harness differs, keep the agent files and adapt only the command wiring.

## How Consults Are Passed

Debbie and Sheldon work best when they are handed the situation as evidence, not as a persuasive summary. The Claude command files use a shared three-part consult payload:

1. **The user's message, verbatim.** The exact slash-command argument is copied into a fenced block. This lets the agent distinguish what the user actually asked from how the calling assistant frames the work.
2. **Sources by address.** Files, issue numbers, pull requests, commits, logs, or plans are listed as things the agent should open and inspect directly. The caller should name sources, not summarize them.
3. **The caller's account.** The calling assistant adds only the context that is not available in a readable source: what was already tried, what was rejected, and any conversation constraint the agent cannot otherwise see.

That structure is the point. Debbie is supposed to challenge whether work is worth doing before time is spent. Sheldon is supposed to answer from files, facts, and first principles. If either one receives only a tidy summary, they are judging the summary instead of the situation.

Example payload:

```text
User typed this, verbatim:

````
should we open an issue for this helper cleanup?
````

Sources — read these yourself:
- scripts/helper.mjs
- tests/ui/helper.test.jsx
- #123

Claude's account — our words, not the user's:
- The helper has one known caller.
- The alternative is deleting it instead of improving it.
- No production bug has been reported.
```

## Notes

These definitions were extracted from a project-local setup and cleaned for general use. Review them before installing if your repository has strict rules about agents, shell access, or issue tracker writes.

Best use case: consult Debbie and Sheldon before opening a new issue, expanding scope, or going down a rabbit hole that might cost more effort than it returns.
