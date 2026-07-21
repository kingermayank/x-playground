#!/usr/bin/env bash
set -euo pipefail

if [[ -z "${API_KEY_21ST:-}" ]]; then
  echo "API_KEY_21ST is not set."
  echo "Set it in your shell first, then rerun this script."
  exit 1
fi

codex mcp add 21st --url https://21st.dev/api/mcp --bearer-token-env-var API_KEY_21ST
codex mcp list
