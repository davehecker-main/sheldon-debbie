#!/bin/sh
set -eu

repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
claude_home=${CLAUDE_HOME:-"$HOME/.claude"}
codex_home=${CODEX_HOME:-"$HOME/.codex"}
state_home=${XDG_STATE_HOME:-"$HOME/.local/state"}
stamp=$(date -u +%Y%m%dT%H%M%SZ)
backup_dir="$state_home/personal-tools/backups/sheldon-debbie/$stamp"
workflow="$repo_dir/workflow.md"

backup() {
  dest=$1
  mkdir -p "$backup_dir"
  backup_name="$(basename "$(dirname "$dest")")-$(basename "$dest")"
  cp "$dest" "$backup_dir/$backup_name"
  printf 'backed up %s\n' "$dest"
}

install_rendered() {
  src=$1
  dest=$2
  rendered=$(mktemp)
  sed "s#__WORKFLOW_PATH__#$workflow#g" "$src" > "$rendered"
  if [ -e "$dest" ] && ! cmp -s "$rendered" "$dest"; then backup "$dest"; fi
  mkdir -p "$(dirname "$dest")"
  cp "$rendered" "$dest"
  rm -f "$rendered"
  chmod 600 "$dest"
  printf 'installed %s\n' "$dest"
}

install_copy() {
  src=$1
  dest=$2
  if [ -e "$dest" ] && ! cmp -s "$src" "$dest"; then backup "$dest"; fi
  mkdir -p "$(dirname "$dest")"
  cp "$src" "$dest"
  chmod 600 "$dest"
  printf 'installed %s\n' "$dest"
}

retire_file() {
  dest=$1
  if [ -e "$dest" ]; then
    backup "$dest"
    rm "$dest"
    printf 'retired %s\n' "$dest"
  fi
}

install_rendered "$repo_dir/claude/commands/consult.md" "$claude_home/commands/consult.md"
install_rendered "$repo_dir/codex/skills/consult/SKILL.md" "$codex_home/skills/consult/SKILL.md"
install_copy "$repo_dir/codex/skills/consult/agents/openai.yaml" "$codex_home/skills/consult/agents/openai.yaml"
install_copy "$repo_dir/codex/skills/consult/assets/icon.svg" "$codex_home/skills/consult/assets/icon.svg"
install_copy "$repo_dir/codex/agents/debbie.toml" "$codex_home/agents/debbie.toml"
install_copy "$repo_dir/codex/agents/sheldon.toml" "$codex_home/agents/sheldon.toml"
install_copy "$repo_dir/claude/agents/debbie.md" "$claude_home/agents/debbie.md"
install_copy "$repo_dir/claude/agents/sheldon.md" "$claude_home/agents/sheldon.md"
install_copy "$repo_dir/codex/agents/shareview-debbie.toml" "$codex_home/agents/shareview-debbie.toml"
install_copy "$repo_dir/codex/agents/shareview-sheldon.toml" "$codex_home/agents/shareview-sheldon.toml"
install_copy "$repo_dir/claude/agents/shareview-debbie.md" "$claude_home/agents/shareview-debbie.md"
install_copy "$repo_dir/claude/agents/shareview-sheldon.md" "$claude_home/agents/shareview-sheldon.md"
retire_file "$claude_home/commands/debbie.md"
retire_file "$claude_home/commands/sheldon.md"
retire_file "$claude_home/consult-protocol.md"
printf '\nsheldon-debbie installed globally from %s.\n' "$repo_dir"
