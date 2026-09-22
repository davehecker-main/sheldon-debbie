# Debbie and Sheldon profile selection

Use exactly one profile; never combine their instructions.

Resolve the directory containing this file, then run its `scripts/select-profile.sh` with the current repository or worktree path. Read the profile path it prints completely and follow that profile. A current repository whose exact `origin` is `ShareViewLLC/ShareView` selects `profiles/shareview.md`; every other repository and a directory outside Git select `profiles/general.md`.

This selection applies before any generic instruction that conflicts with the ShareView profile.
