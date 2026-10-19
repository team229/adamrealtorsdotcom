# Adam the Realtor — Contact Experience

A rebuild of [adamtherealtor.com/contact](https://adamtherealtor.com/contact) using
**Astro 7** with **React islands** and **Tailwind CSS 3**.

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
