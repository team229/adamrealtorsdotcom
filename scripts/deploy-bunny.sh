#!/usr/bin/env bash
#
# Deploy the built site to a Bunny.net Storage Zone.
#
#   ./scripts/deploy-bunny.sh [dist-dir]
#
# Required environment variables:
#   BUNNY_ACCESS_KEY   Storage zone password (the "AccessKey" header value)
#   BUNNY_STORAGE_ZONE Storage zone name
#   BUNNY_ENDPOINT     Optional. Defaults to storage.bunnycdn.com
#
set -euo pipefail

BUNNY_ACCESS_KEY="${BUNNY_ACCESS_KEY:?BUNNY_ACCESS_KEY is required}"
BUNNY_STORAGE_ZONE="${BUNNY_STORAGE_ZONE:?BUNNY_STORAGE_ZONE is required}"
BUNNY_ENDPOINT="${BUNNY_ENDPOINT:-storage.bunnycdn.com}"

DIST_DIR="${1:-dist}"
BASE="https://${BUNNY_ENDPOINT}/${BUNNY_STORAGE_ZONE}"

if [[ ! -d "$DIST_DIR" ]]; then
  echo "error: '$DIST_DIR' not found — run 'npm run build' first." >&2
  exit 1
fi

# Map extensions to content types. Bunny falls back to its own detection when
# no type is supplied, but being explicit avoids .svg/.js being mis-typed.
content_type() {
  case "$1" in
    *.html) echo "text/html; charset=utf-8" ;;
    *.css)  echo "text/css; charset=utf-8" ;;
    *.js)   echo "application/javascript; charset=utf-8" ;;
    *.mjs)  echo "application/javascript; charset=utf-8" ;;
    *.json) echo "application/json; charset=utf-8" ;;
    *.svg)  echo "image/svg+xml" ;;
    *.png)  echo "image/png" ;;
    *.jpg|*.jpeg) echo "image/jpeg" ;;
    *.webp) echo "image/webp" ;;
    *.ico)  echo "image/x-icon" ;;
    *.woff2) echo "font/woff2" ;;
    *.woff)  echo "font/woff" ;;
    *.txt)  echo "text/plain; charset=utf-8" ;;
    *.xml)  echo "application/xml" ;;
    *.webmanifest) echo "application/manifest+json" ;;
    *)      echo "application/octet-stream" ;;
  esac
}

echo "→ Deploying '$DIST_DIR' to $BUNNY_STORAGE_ZONE ($BUNNY_ENDPOINT)"

cd "$DIST_DIR"

# 1. Create every directory first so empty folders are preserved.
#    The zone is listed up front so re-runs are idempotent — a PUT against an
#    existing directory returns 400.
existing=$(curl -s -H "AccessKey: ${BUNNY_ACCESS_KEY}" "${BASE}/" | node -e '
let raw = "";
process.stdin.on("data", (d) => (raw += d)).on("end", () => {
  try {
    JSON.parse(raw)
      .filter((f) => f.IsDirectory)
      .forEach((f) => console.log(f.ObjectName));
  } catch (e) {
    /* empty or non-JSON response — treat as "nothing exists yet" */
  }
});
')

while read -r dir; do
  [[ -n "$dir" ]] || continue
  if grep -qx "$dir" <<< "$existing"; then
    echo "  = ${dir}/ (exists)"
    continue
  fi
  code=$(curl -s -o /dev/null -w '%{http_code}' -X PUT \
    -H "AccessKey: ${BUNNY_ACCESS_KEY}" \
    "${BASE}/${dir}/")
  if [[ "$code" != 2* && "$code" != "405" ]]; then
    echo "  ✗ mkdir ${dir}/ (HTTP ${code})" >&2
    exit 1
  fi
  echo "  + ${dir}/"
done < <(find . -type d -not -path '.' | sed 's|^\./||' | sort)

# 2. Upload every file.
while read -r file; do
  [[ -n "$file" ]] || continue
  code=$(curl -s -o /tmp/bunny-put.out -w '%{http_code}' -X PUT \
    -H "AccessKey: ${BUNNY_ACCESS_KEY}" \
    -H "Content-Type: $(content_type "$file")" \
    --data-binary "@${file}" \
    "${BASE}/${file}")

  if [[ "$code" == 2* ]]; then
    size=$(wc -c < "$file" | tr -d ' ')
    printf '  ✓ %-46s %9s bytes\n' "$file" "$size"
  else
    printf '  ✗ %-46s HTTP %s\n' "$file" "$code" >&2
    cat /tmp/bunny-put.out >&2
    exit 1
  fi
done < <(find . -type f | sed 's|^\./||' | sort)

echo "→ Verifying"
curl -s -H "AccessKey: ${BUNNY_ACCESS_KEY}" "${BASE}/" | head -c 4000
echo
echo "✓ Deploy complete"
