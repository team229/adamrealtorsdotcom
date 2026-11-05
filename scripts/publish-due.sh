#!/usr/bin/env bash
#
# Dispatcher run by the adam-blog-publish systemd timer.
# Looks up today's date and publishes the post staged for it, if any.
set -euo pipefail

SITE="/home/ec2-user/Clickboostmedia/websites/adamrealtorsdotcom"
TODAY="$(date +%F)"

case "$TODAY" in
  2026-11-12) SLUG="california-seller-disclosures-what-to-disclose" ;;
  2026-11-19) SLUG="first-year-homeowner-costs-orange-county" ;;
  2026-11-26) SLUG="moving-to-orange-county-from-out-of-state" ;;
  2026-11-30) SLUG="best-time-to-sell-house-orange-county" ;;
  *) echo "$(date -Is) no post scheduled for $TODAY"; exit 0 ;;
esac

if [[ ! -f "$SITE/scheduled/$SLUG.md" ]]; then
  echo "$(date -Is) SKIP: $SLUG already published or missing"
  exit 0
fi

echo "$(date -Is) publishing $SLUG for $TODAY"
exec bash "$SITE/scripts/publish-scheduled.sh" "$SLUG"
