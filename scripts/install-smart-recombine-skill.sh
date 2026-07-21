#!/usr/bin/env bash
set -euo pipefail

SOURCE="/Users/mayankkinger/Downloads/smart-recombine"
DEST="${CODEX_HOME:-$HOME/.codex}/skills/smart-recombine"

if [[ ! -f "$SOURCE/SKILL.md" ]]; then
  echo "Could not find $SOURCE/SKILL.md"
  exit 1
fi

if [[ -e "$DEST" ]]; then
  echo "Skill already exists at $DEST"
  echo "Remove it first if you want to reinstall."
  exit 1
fi

mkdir -p "$(dirname "$DEST")"
mkdir -p "$DEST"

cp "$SOURCE/SKILL.md" "$DEST/"

for folder in references examples templates assets scripts; do
  if [[ -d "$SOURCE/$folder" ]]; then
    cp -R "$SOURCE/$folder" "$DEST/"
  fi
done

echo "Installed smart-recombine to $DEST"
echo "Restart Codex to pick up the new skill."
