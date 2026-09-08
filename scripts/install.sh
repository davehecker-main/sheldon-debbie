#!/bin/sh
set -eu

repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
codex_home=${CODEX_HOME:-"$HOME/.codex"}
claude_home=${CLAUDE_HOME:-"$HOME/.claude"}

install_file() {
  src=$1
  dest=$2
  mkdir -p "$(dirname -- "$dest")"
  cp "$src" "$dest"
  printf 'installed %s\n' "$dest"
}

install_file "$repo_dir/codex/agents/debbie.toml" "$codex_home/agents/debbie.toml"
install_file "$repo_dir/codex/agents/sheldon.toml" "$codex_home/agents/sheldon.toml"

install_file "$repo_dir/claude/agents/debbie.md" "$claude_home/agents/debbie.md"
install_file "$repo_dir/claude/agents/sheldon.md" "$claude_home/agents/sheldon.md"
install_file "$repo_dir/claude/commands/debbie.md" "$claude_home/commands/debbie.md"
install_file "$repo_dir/claude/commands/sheldon.md" "$claude_home/commands/sheldon.md"
install_file "$repo_dir/claude/consult-protocol.md" "$claude_home/consult-protocol.md"
