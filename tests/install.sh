#!/bin/sh
set -eu
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
tmp_dir=$(mktemp -d)
trap 'rm -rf "$tmp_dir"' EXIT HUP INT TERM
mkdir -p "$tmp_dir/claude/commands"
printf 'legacy\n' > "$tmp_dir/claude/commands/debbie.md"
mkdir -p "$tmp_dir/claude/commands"
printf 'legacy\n' > "$tmp_dir/claude/commands/sheldon.md"
CLAUDE_HOME="$tmp_dir/claude" CODEX_HOME="$tmp_dir/codex" XDG_STATE_HOME="$tmp_dir/state" "$repo_dir/scripts/install.sh" >/dev/null
command_file="$tmp_dir/claude/commands/consult.md"
skill_file="$tmp_dir/codex/skills/consult/SKILL.md"
test -s "$command_file"
test -s "$skill_file"
test -s "$tmp_dir/codex/agents/debbie.toml"
test -s "$tmp_dir/claude/agents/debbie.md"
test -s "$tmp_dir/codex/agents/sheldon.toml"
test -s "$tmp_dir/claude/agents/sheldon.md"
test ! -e "$tmp_dir/claude/commands/debbie.md"
find "$tmp_dir/state/personal-tools/backups/sheldon-debbie" -type f -name 'commands-debbie.md' | grep . >/dev/null
test ! -e "$tmp_dir/claude/commands/sheldon.md"
find "$tmp_dir/state/personal-tools/backups/sheldon-debbie" -type f -name 'commands-sheldon.md' | grep . >/dev/null
grep -F "$repo_dir/workflow.md" "$command_file" >/dev/null
grep -F "$repo_dir/workflow.md" "$skill_file" >/dev/null

test "$(sed -n '1p' "$command_file")" = '---'
test "$(sed -n '1p' "$skill_file")" = '---'
CLAUDE_HOME="$tmp_dir/claude" CODEX_HOME="$tmp_dir/codex" XDG_STATE_HOME="$tmp_dir/state" "$repo_dir/scripts/install.sh" >/dev/null
printf 'local conflict\n' >> "$command_file"
CLAUDE_HOME="$tmp_dir/claude" CODEX_HOME="$tmp_dir/codex" XDG_STATE_HOME="$tmp_dir/state" "$repo_dir/scripts/install.sh" >/dev/null
find "$tmp_dir/state/personal-tools/backups/sheldon-debbie" -type f -name 'commands-consult.md' | grep . >/dev/null
printf 'sheldon-debbie: install smoke test passed\n'
