#!/bin/sh
set -eu
repo_dir=$(CDPATH= cd -- "$(dirname -- "$0")/.." && pwd)
tmp=$(mktemp -d)
trap 'rm -rf "$tmp"' EXIT HUP INT TERM

git -C "$tmp" init base >/dev/null
git -C "$tmp/base" config user.name Test
git -C "$tmp/base" config user.email test@example.invalid
printf 'x\n' > "$tmp/base/file"
git -C "$tmp/base" add file
git -C "$tmp/base" commit -m init >/dev/null
git -C "$tmp/base" remote add origin https://github.com/ShareViewLLC/ShareView.git
git -C "$tmp/base" worktree add "$tmp/shareview-worktree" -b test-worktree >/dev/null

test "$("$repo_dir/scripts/select-profile.sh" "$tmp/base")" = "$repo_dir/profiles/shareview.md"
test "$("$repo_dir/scripts/select-profile.sh" "$tmp/shareview-worktree")" = "$repo_dir/profiles/shareview.md"

git -C "$tmp/base" remote set-url origin git@github.com:ShareViewLLC/ShareView.git
test "$("$repo_dir/scripts/select-profile.sh" "$tmp/shareview-worktree")" = "$repo_dir/profiles/shareview.md"

git -C "$tmp/base" remote set-url origin https://github.com/ShareViewLLC/ShareView-archive.git
test "$("$repo_dir/scripts/select-profile.sh" "$tmp/base")" = "$repo_dir/profiles/general.md"

git -C "$tmp" init unrelated >/dev/null
git -C "$tmp/unrelated" remote add origin https://github.com/example/sheldon-debbie.git
test "$("$repo_dir/scripts/select-profile.sh" "$tmp/unrelated")" = "$repo_dir/profiles/general.md"
test "$("$repo_dir/scripts/select-profile.sh" "$tmp")" = "$repo_dir/profiles/general.md"
printf 'sheldon-debbie: profile selection passed\n'
