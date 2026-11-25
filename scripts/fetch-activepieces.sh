#!/usr/bin/env bash
# Fetches the Activepieces framework sources the piece is bundled against.
# Activepieces does not publish @activepieces/* libraries to npm; its own bundler
# inlines them into each piece, so we do the same from a pinned commit.
set -euo pipefail
SHA="63daa273255ec247375f16f70230322173acf159"
DIR="$(cd "$(dirname "$0")/.." && pwd)/.activepieces"
if [ -f "$DIR/.sha" ] && [ "$(cat "$DIR/.sha")" = "$SHA" ]; then echo "already at $SHA"; exit 0; fi
rm -rf "$DIR"; mkdir -p "$DIR"; cd "$DIR"
git init -q
git remote add origin https://github.com/activepieces/activepieces.git
git sparse-checkout init --cone
git sparse-checkout set packages/core packages/pieces/framework packages/pieces/common
git fetch -q --depth 1 --filter=blob:none origin "$SHA"
git checkout -q FETCH_HEAD
echo "$SHA" > .sha
echo "fetched $SHA"
