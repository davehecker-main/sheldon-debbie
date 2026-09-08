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

## Notes

These definitions were extracted from a project-local setup and cleaned for general use. Review them before installing if your repository has strict rules about agents, shell access, or issue tracker writes.

Best use case: consult Debbie and Sheldon before opening a new issue, expanding scope, or going down a rabbit hole that might cost more effort than it returns.
