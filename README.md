# Sheldon and Debbie

<img src="assets/sheldon-debbie.svg" alt="Sheldon and Debbie" width="720">

Consult Debbie and Sheldon together on whether work is worthwhile, true, and well engineered.

## Install

```sh
./scripts/install.sh
```

The backup-aware installer writes the Claude command `/consult`, the Codex skill `$consult`, and the custom agent definitions. Existing differing files are preserved under `~/.local/state/personal-tools/backups/sheldon-debbie/<timestamp>/`.

## Use

- Claude: `/consult <natural-language request>`
- Codex: mention the request naturally or invoke `$consult`

The paired workflow always sends both advisors the same evidence and relays both answers verbatim.

## Documentation

- [Configuration](docs/configuration.md)
- [Permissions](docs/permissions.md)
- [Troubleshooting](docs/troubleshooting.md)
- [Examples](examples/README.md)

## Development

```sh
sh tests/install.sh
```

## Release history

See [CHANGELOG.md](CHANGELOG.md).

## License

MIT. See [LICENSE](LICENSE).
