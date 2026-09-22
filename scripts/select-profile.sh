#!/bin/sh
set -eu
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
target=${1:-"$PWD"}
top=$(git -C "$target" rev-parse --show-toplevel 2>/dev/null || true)
remote=""
if [ -n "$top" ]; then remote=$(git -C "$top" remote get-url origin 2>/dev/null || true); fi
case "$remote" in
  https://github.com/ShareViewLLC/ShareView|https://github.com/ShareViewLLC/ShareView.git|git@github.com:ShareViewLLC/ShareView|git@github.com:ShareViewLLC/ShareView.git)
    printf '%s\n' "$repo_dir/profiles/shareview.md"
    ;;
  *)
    printf '%s\n' "$repo_dir/profiles/general.md"
    ;;
esac
