#!/usr/bin/env bash
set -euo pipefail

# scripts/gpt5-zip-repo.sh
# Create a lightweight zip of the repo suitable for LLM review.
# - Includes tracked + untracked files that are NOT ignored by .gitignore
# - Excludes common heavy/unnecessary files (env files, lockfiles, images, caches)
#
# Usage:
#   bash scripts/gpt5-zip-repo.sh [output.zip]
# Examples:
#   bash scripts/gpt5-zip-repo.sh
#   bash scripts/gpt5-zip-repo.sh ./gpt5-repo.zip

ROOT_DIR="$(pwd)"
TIMESTAMP="$(date +%Y%m%d-%H%M%S)"
DEFAULT_OUT="${ROOT_DIR}/gpt5-repo-${TIMESTAMP}.zip"
OUT_PATH="${1:-$DEFAULT_OUT}"

have_cmd() { command -v "$1" >/dev/null 2>&1; }

if ! have_cmd git; then
  echo "git not found; please install git." >&2
  exit 1
fi
if ! have_cmd zip; then
  echo "zip not found; please install zip (e.g., 'brew install zip')." >&2
  exit 1
fi

# Basic sanity check: run from repo root (has package.json)
if [ ! -f "package.json" ]; then
  echo "package.json not found in current directory. Run from the repo root." >&2
  exit 1
fi

TMP_LIST="$(mktemp)"

# Decide if a path should be excluded beyond .gitignore rules.
should_exclude() {
  local f="$1"

  # Always exclude the output zip if it's under the repo dir
  # Normalize relative path of OUT_PATH if possible
  if [[ "$OUT_PATH" == "$f" ]]; then return 0; fi

  # Additional directories/files to exclude (beyond .gitignore)
  case "$f" in
    # Build artifacts not already ignored in this repo
    build/*|build) return 0 ;;

    # Local screenshots or captures
    screenshots/*|screenshots) return 0 ;;

    # Env files (avoid secrets)
    *.env|.env|.env.*|*/.env|*/.env.*) return 0 ;;

    # Package manager lockfiles (noise for review)
    pnpm-lock.yaml|yarn.lock|package-lock.json) return 0 ;;

    # Logs and OS cruft
    *.log|*.LOG|*.Log|.DS_Store) return 0 ;;

    # Jest snapshots (noisy for review)
    */__snapshots__/*) return 0 ;;

    # Large/binary assets (keep code light). Allow SVG (text) through.
    *.png|*.PNG|*.jpg|*.JPG|*.jpeg|*.JPEG|*.gif|*.GIF|*.webp|*.WEBP|*.bmp|*.BMP|*.tiff|*.TIFF|*.psd|*.ai|*.mp4|*.MP4|*.mov|*.MOV) return 0 ;;

    # Fonts
    *.ttf|*.TTF|*.otf|*.OTF|*.woff|*.WOFF|*.woff2|*.WOFF2|*.eot|*.EOT) return 0 ;;

    # Archives
    *.zip|*.ZIP|*.tar|*.tar.gz|*.tgz) return 0 ;;
  esac

  return 1
}

# Build candidate list from git (tracked + untracked, excluding ignored by .gitignore)
# -c: cached (tracked), -o: others (untracked), --exclude-standard: respect .gitignore, .git/info/exclude, core.excludesFile
while IFS= read -r -d '' path; do
  # Filter additional excludes
  if should_exclude "$path"; then
    continue
  fi
  printf '%s\n' "$path" >> "$TMP_LIST"
done < <(git ls-files -co --exclude-standard -z)

# Count files and abort if empty
FILE_COUNT=$(wc -l < "$TMP_LIST" | tr -d ' ')
if [ "$FILE_COUNT" = "0" ]; then
  echo "No files to archive after filtering. Nothing to do." >&2
  rm -f "$TMP_LIST"
  exit 1
fi

echo "Preparing review zip with $FILE_COUNT files..."
echo "Output: $OUT_PATH"

# Ensure output directory exists
OUT_DIR="$(dirname "$OUT_PATH")"
mkdir -p "$OUT_DIR"

# Create the zip from the file list; -X to strip extra file attributes for smaller, cleaner zips
if ! zip -q -X "$OUT_PATH" -@ < "$TMP_LIST"; then
  echo "zip command failed." >&2
  rm -f "$TMP_LIST"
  exit 1
fi

rm -f "$TMP_LIST"

# Report size
if have_cmd du; then
  echo -n "Zip size: "
  du -h "$OUT_PATH" | awk '{print $1}'
fi

echo "Done."

