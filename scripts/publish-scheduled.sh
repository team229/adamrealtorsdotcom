#!/usr/bin/env bash
#
# Publish one staged blog post from scheduled/<slug>.md.
#
#   ./scripts/publish-scheduled.sh <slug>            # publish now
#   ./scripts/publish-scheduled.sh <slug> --dry-run  # build-only check, no commit, no deploy
#
# Used by cron on 12, 19, 26 and 30 November 2026. Logs to scheduled/publish.log.
set -euo pipefail

SLUG="${1:?usage: publish-scheduled.sh <slug> [--dry-run]}"
DRY_RUN=0
[[ "${2:-}" == "--dry-run" ]] && DRY_RUN=1

ROOT="/home/ec2-user/Clickboostmedia"
SITE="$ROOT/websites/adamrealtorsdotcom"
SRC_FILE="$SITE/src/content/pages/blog/$SLUG.md"
STAGED="$SITE/scheduled/$SLUG.md"
LOG="$SITE/scheduled/publish.log"

exec >>"$LOG" 2>&1
echo "=== $(date -Is) publish '$SLUG' dry_run=$DRY_RUN ==="

if [[ ! -f "$STAGED" ]]; then
  echo "ERROR: no staged file at $STAGED"
  exit 1
fi

# Credentials and build runtime are not inherited by cron.
set -a
. "$ROOT/websites/.env"
set +a
if [[ -f "$SITE/.env" ]]; then
  set -a
  . "$SITE/.env"
  set +a
fi
export NVM_DIR="$HOME/.nvm"
# shellcheck disable=SC1091
. "$NVM_DIR/nvm.sh"
nvm use 22 >/dev/null

cd "$SITE"

echo "-- pull"
git pull --ff-only origin main

echo "-- stage into content collection"
cp "$STAGED" "$SRC_FILE"

echo "-- build gate"
if ! PUBLIC_SITE_URL=https://www.adamtherealtor.com npm run build; then
  echo "ERROR: build failed, reverting staged file"
  rm -f "$SRC_FILE"
  exit 1
fi
if [[ ! -f "dist/blog/$SLUG/index.html" ]]; then
  echo "ERROR: build did not emit dist/blog/$SLUG/index.html"
  rm -f "$SRC_FILE"
  exit 1
fi

if [[ "$DRY_RUN" == "1" ]]; then
  echo "-- dry run: reverting and rebuilding clean"
  rm -f "$SRC_FILE"
  PUBLIC_SITE_URL=https://www.adamtherealtor.com npm run build >/dev/null
  echo "DRY RUN OK"
  exit 0
fi

echo "-- commit and push source"
git add -A
git commit -m "feat: publish $SLUG [scheduled]" || echo "nothing to commit"
git push origin main

echo "-- deploy"
bash "$ROOT/websites/scripts/bunny/deploy.sh" adamrealtorsdotcom --purge

echo "-- clear the scheduled slot"
rm -f "$STAGED"
git add -A
git commit -m "chore: clear scheduled slot for $SLUG [scheduled]" || echo "nothing to commit"
git push origin main

echo "-- verify"
CODE=$(curl -s -o /dev/null -w '%{http_code}' "https://www.adamtherealtor.com/blog/$SLUG/")
echo "live status: $CODE"
if [[ "$CODE" != "200" ]]; then
  echo "ERROR: live check returned $CODE"
  exit 1
fi
echo "PUBLISHED $SLUG"
