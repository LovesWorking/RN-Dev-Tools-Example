Codex CLI MCP Configuration

This folder contains a project-scoped MCP server configuration for Codex CLI.

What it adds

- Registers a `peekaboo` MCP server that connects to the iOS Simulator screenshot tool.
- Uses stdio transport with the command `/usr/local/bin/peekaboo --stdio`.

Files

- `.codex/config.json` — Codex CLI config adding the `peekaboo` MCP server.

Usage

1. Ensure Peekaboo is installed and accessible at `/usr/local/bin/peekaboo`.
   - If installed elsewhere, update the `command` path in `.codex/config.json`.
2. Launch Codex CLI pointing at this config:
   - `codex-cli --config ./.codex/config.json`
   - or equivalent flag for your Codex CLI build.
3. Grant Screen Recording permission to the terminal app running Peekaboo (macOS System Settings → Privacy & Security → Screen Recording).
4. Boot an iOS Simulator and verify tools are available (ask Codex to list MCP tools or to take a screenshot).

Environment

- `PEEKABOO_SIM=booted` is set by default to target the currently booted simulator. Change to a specific UDID if needed.
