#!/usr/bin/env bash
set -euo pipefail

skill_root="${CODEX_HOME:-$HOME/.codex}/skills/daily-experiment-workflow"
mkdir -p "$skill_root"
cp "/Users/mayankkinger/Desktop/Codex Playground/skill-updates/daily-experiment-workflow/SKILL.md" "$skill_root/SKILL.md"
echo "Installed daily-experiment-workflow to $skill_root"
