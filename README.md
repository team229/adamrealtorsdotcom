# Adam the Realtor — Website

Astro 7 site for [adamtherealtor.com](https://www.adamtherealtor.com): homepage,
about, buyer and seller guides, nine Orange County city guides, and the contact
experience. Built with **React islands** and **Tailwind CSS 3**.

## Stack

| Layer     | Choice                                              |
| --------- | --------------------------------------------------- |
| Framework | Astro 7 (static output)                             |
| UI        | React 19 islands (`@astrojs/react`)                 |
| Styling   | Tailwind CSS 3 via PostCSS                          |
| Animation | Motion (`motion/react`) for interactive transitions  |
| Icons     | `lucide-react` + local brand glyphs                 |

## Why this split

Astro renders the page shell, hero, agent card, contact details, promise card and
footer as **zero-JS HTML**. Only the pieces that genuinely need client-side state
ship JavaScript:

| Island             | Why it is hydrated                                |
| ------------------ | ------------------------------------------------- |
| `Header.tsx`       | Dropdown menus, mobile drawer, scroll-aware state |
| `ContactForm.tsx`  | Validation, multi-select, submit + success states |
| `Faq.tsx`          | Animated accordion (height transitions)            |

Scroll reveals are handled by a **single IntersectionObserver** in `BaseLayout.astro`
driven by `data-reveal` attributes — no per-section island, no layout thrash, and
the content stays visible with JavaScript disabled, in print, and to crawlers.

## Getting started

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # static output in dist/
npm run preview  # preview the production build
npm run check    # astro + typescript diagnostics
```

## Project structure

```
src/
├── components/
│   ├── AgentCard.astro      # portrait, bio, rating, socials
│   ├── ContactForm.tsx      # React island — the enquiry form
│   ├── ContactHero.astro    # headline + social-proof stats
│   ├── ContactMethods.astro # call / email / office rows
│   ├── ContactSection.astro # two-column layout
│   ├── Faq.tsx              # React island — animated accordion
│   ├── FaqSection.astro
│   ├── Footer.astro
│   ├── Header.tsx           # React island — nav + mobile drawer
│   ├── PromiseCard.astro    # response-time promise + facts
│   ├── ToolsSection.astro   # "not ready yet" resource cards
│   └── icons/SocialIcons.tsx
├── data/site.ts             # single source of truth for all content
├── layouts/BaseLayout.astro # <head>, fonts, reveal observer
├── pages/
│   ├── contact.astro        # the contact page
│   └── index.astro          # redirects to /contact
└── styles/global.css        # Tailwind layers + reveal system
```

## Content

All copy, navigation, FAQ entries, contact details and social links live in
`src/data/site.ts`. Editing that one file updates the page — no component changes
required.

## Form handling

`ContactForm.tsx` posts JSON to `PUBLIC_CONTACT_ENDPOINT` when that variable is
set:

```bash
PUBLIC_CONTACT_ENDPOINT=https://api.example.com/leads npm run build
```

Payload shape:

```json
{
  "first_name": "Jane",
  "last_name": "Doe",
  "phone": "+1 555 000 0000",
  "email": "jane@example.com",
  "message": "Looking for a 3 bed in Anaheim Hills.",
  "inquiry_types": ["I want to buy a home"],
  "source": "adamtherealtor.com/contact"
}
```

With no endpoint configured the form falls back to a pre-filled `mailto:` so no
lead is ever silently dropped.

## Design tokens

Colours, fonts and radii are CSS custom properties on `:root`
(`src/styles/global.css`) and are exposed to Tailwind through
`tailwind.config.mjs`.

- Primary — `hsl(217 60% 26%)` deep navy
- Accent — `hsl(39 46% 61%)` muted gold
- Headings — Playfair Display
- Body — Inter

## Deployment — BunnyCDN

The site is served from a Bunny **Storage Zone** (region: Frankfurt, DE) behind a
**Pull Zone**.

### Auth

Bunny's Storage API authenticates with the `AccessKey` header carrying the
**storage zone password** — *not* the account API key, and not HTTP Basic auth.

```
AccessKey: <storage zone password>
```

### Manual deploy

```bash
npm run build

export BUNNY_ACCESS_KEY="<storage zone password>"
export BUNNY_STORAGE_ZONE="adamrealtorsdotcom"
export BUNNY_ENDPOINT="storage.bunnycdn.com"   # Frankfurt, DE

./scripts/deploy-bunny.sh dist
```

The script creates directories, uploads every file with an explicit
`Content-Type`, and prints a manifest. To verify byte-for-byte:

```bash
cd dist
find . -type f | sed 's|^\./||' | while read -r f; do
  a=$(shasum -a 256 "$f" | cut -d' ' -f1)
  b=$(curl -s -H "AccessKey: $BUNNY_ACCESS_KEY" \
        "https://storage.bunnycdn.com/$BUNNY_STORAGE_ZONE/$f" | shasum -a 256 | cut -d' ' -f1)
  [ "$a" = "$b" ] && echo "✓ $f" || echo "✗ $f"
done
```

### Pull zone setup (one-time, in the Bunny dashboard)

A Storage Zone is **not publicly reachable on its own** — it needs a Pull Zone
in front of it.

1. **CDN → Add Pull Zone**
2. **Origin Type** → `Storage Zone`, then select `adamrealtorsdotcom`
3. Add the hostname (e.g. `adamrealtorsdotcom.com`) and point a CNAME at the
   generated `<pullzone>.b-cdn.net` hostname
4. Enable SSL (free Let's Encrypt) once DNS resolves
5. In the Storage Zone → **Error handling**, set the 404 file path to
   `/index.html` and enable *Rewrite 404 to 200* if you want extensionless
   routes to resolve

### Automated deploys

`.github/workflows/deploy-bunny.yml` builds and uploads on every push to
`main`. Add these repository secrets/variables:

| Name                    | Type     | Value                                    |
| ----------------------- | -------- | ---------------------------------------- |
| `BUNNY_ACCESS_KEY`      | secret   | Storage zone password                    |
| `BUNNY_STORAGE_ZONE`    | secret   | `adamrealtorsdotcom`                     |
| `BUNNY_ENDPOINT`        | variable | `storage.bunnycdn.com`                   |
| `PUBLIC_SITE_URL`       | variable | Canonical origin, e.g. `https://adamrealtorsdotcom.com` |
| `BUNNY_PULL_ZONE_ID`    | variable | Numeric pull zone id (cache purge)       |
| `BUNNY_ACCOUNT_API_KEY` | secret   | Account API key (optional, cache purge)  |

`PUBLIC_SITE_URL` drives the canonical URL, Open Graph tags and JSON-LD, so set
it to the live domain before the first production build.


## Content model

Long-form copy lives in `src/content/pages/*.md` and is validated by
`src/content.config.ts`. Each file owns one route:

| File | Route |
| --- | --- |
| `home.md` | `/` |
| `about.md` | `/about/` |
| `buyers.md` | `/buyers/` |
| `sellers.md` | `/sellers/` |
| `{city}-ca-home-for-sale.md` | `/{city}-ca-home-for-sale/` |

Frontmatter holds the SEO fields (`title`, `description`, `h1`, `eyebrow`,
`route`, `lede`, `city`, `faqs`). `PageLayout.astro` renders the hero, prose,
FAQ accordion, city cross-links and CTA band, and emits the matching schema
(`RealEstateAgent`, `WebPage`/`CollectionPage`, `BreadcrumbList`, `FAQPage`).

City links, navigation and footer areas come from `src/data/site.ts`, so adding
a city means adding one Markdown file plus one entry in `cityPages`.

## Technical SEO

- Canonicals, OG/Twitter tags and absolute URLs derive from `PUBLIC_SITE_URL`
  (defaults to `https://www.adamtherealtor.com`).
- `/sitemap.xml` and `/robots.txt` are generated at build time from the content
  collection and `site.url`.
- Trailing-slash URLs everywhere (`trailingSlash: 'always'`), matching the
  directory output served by Bunny CDN.
- `404.html` is `noindex, follow` and links to every main section.
