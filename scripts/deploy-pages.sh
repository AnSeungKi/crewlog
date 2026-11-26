#!/usr/bin/env bash
# Publish the static export to GitHub Pages (https://anseungki.github.io/crewlog/).
#
# The repository token available to the assistant cannot push files under
# .github/workflows (missing "workflows" permission), so deployment is done by
# force-pushing the export to the `gh-pages` branch, which Pages serves as the
# site source. Run this after any change you want live:
#
#   ./scripts/deploy-pages.sh
#
set -euo pipefail

repo_dir="$(cd "$(dirname "$0")/.." && pwd)"
remote="$(git -C "$repo_dir" config --get remote.origin.url)"

cd "$repo_dir"

export NEXT_PUBLIC_BASE_PATH=/crewlog
npm run build
touch out/.nojekyll

tmp="$(mktemp -d)"
cp -a out/. "$tmp"/

cd "$tmp"
git init -q
git checkout -q -b gh-pages
git add -A
git -c user.name="crewlog deploy" -c user.email="deploy@crewlog.local" \
  commit -q -m "deploy: static export $(date -u +%Y-%m-%dT%H:%M:%SZ)"
git remote add origin "$remote"
git push -f origin gh-pages

cd "$repo_dir"
rm -rf "$tmp"
echo "pushed gh-pages · https://anseungki.github.io/crewlog/"
