#!/usr/bin/env bash
set -euo pipefail

codex mcp add mobbin --url https://api.mobbin.com/mcp
codex mcp login mobbin
codex mcp list
