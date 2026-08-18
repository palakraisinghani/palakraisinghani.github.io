# Design Theme — "Marginalia"

Status: **live, site-wide**. This is the design system for the whole site —
`css/global.css` and `js/components.js` carry the shared chrome (topbar,
footer, palette, type tokens, entrance animation) on every page; each page's
own CSS file (`css/index.css`, `css/research.css`, `css/experience.css`,
`css/blog.css`, `css/projects.css`) carries what's specific to that page.
`index-design.html` / `css/design.css` / `js/design-reveal.js` were the
standalone prototype this was built from and are kept around as a reference
snapshot — the real pages no longer depend on them.

## Core idea

A calm, editorial personal site: a light neutral background, a green
gradient for text and structure, a serif for headings, a clean sans for
prose, monospace reserved for small structural labels (nav index, dates,
tags, footer). The visual language is meant to read as someone who thinks
in both systems (clean structure, consistent rules, restrained motion) and
humanities (serif display type, an italic pull-quote voice) — now expressed
through a natural, growth-toned green palette rather than the original
warm cream/mauve pairing.

The name "Marginalia" — the handwritten notes scholars leave in the margins
of a book — is the bridge: literary content, but organized with a
technical/spec-like structure and rhythm.

## Color

Palette source: a user-supplied four-swatch green gradient
(`#063B00` → `#266210` → `#90B800` → `#E1E100`, dark to bright). The two
darkest greens became the text tones (dark greens read as near-black at
paragraph size, so contrast against a light background is unaffected); the
two brightest became the panel/accent tones. The base background is a
derived near-white tint in the same hue family — using the palette's
brightest swatches at full strength behind body text would be too intense,
so "similar shades" fills that gap.

| Token | Value | Role |
|---|---|---|
| `--mg-cream` | `#f7f9e8` | base page background (derived pale tint, not a literal swatch) |
| `--mg-mauve` | `#90b800` | secondary background / borders / accents (chips, card borders, portrait mat) |
| `--mg-panel` | `#e1e100` | topbar background |
| `--mg-sidebar` | `#90b800` | About-page sidebar background |
| `--mg-slate` | `#266210` | body text, secondary links |
| `--mg-ink` | `#063b00` | headings, primary emphasis, active states |

Earlier iterations of this palette (a cream/mauve pairing, then a
teal/olive/plum trio of candidate header+sidebar pairs) are superseded by
this green theme — the naming (`--mg-cream`, `--mg-mauve`, `--mg-slate`,
`--mg-ink`, `--mg-panel`, `--mg-sidebar`) stayed stable across all of it, so
only the `:root` values in `css/global.css` needed to change; every page
that consumes these tokens re-themed automatically.

Everything else (`--mg-mauve-wash`, `--mg-line`, `--mg-shadow`, `--mg-card`,
`--mg-ink-faint`) is a derived tint of these five — rgba blends, not new
hues — defined once in `css/global.css` and reused by every page-specific
stylesheet. The one deliberate departure from the core cream/mauve pairing
is `--mg-panel`, a pale warm green used specifically for the topbar and the
About-page sidebar, so that persistent chrome reads as a distinct surface
from scrolling content.

## Typography

- **Fraunces** (serif) — all headings (`h2`, `h3`, `.page-title`), the
  About-page lede line and pull-quote. Reserved for things meant to be felt,
  not scanned.
- **Inter** (sans) — all body prose, site-wide. Chosen over the earlier Lora
  body font for cleaner legibility at paragraph length.
- **JetBrains Mono** — small structural labels only: topbar CV button,
  footer copyright, nav-adjacent metadata, blog date/tag/nav labels, project
  periods and group labels, timeline dates on the Experience page. Never
  body text.
- **Lavishly Yours** (cursive) — the wordmark only (`.mg-logo`, top-left of
  every page), bold and enlarged for presence.

## Shared chrome (every page)

- **`.mg-swatch-bar`** — a 5px four-tone gradient strip at the very top of
  every page, injected by `js/components.js` alongside the header.
- **`header.mg-topbar`** — cursive wordmark (left) on a `--mg-panel`
  background, nav links (center) with an animated underline that grows in
  on hover/active, CV + LinkedIn + GitHub as filled pill buttons (right)
  that invert to solid ink on hover. Fades/slides in on page load
  (`mg-fade-down`).
- **`footer.mg-footer`** — small mono copyright line, top hairline border.
- Both are generated once in `js/components.js` and injected into
  `#global-header` / `#global-footer` on every page, exactly like the site's
  original header/footer mechanism — only the markup and classes changed.
  Active-page highlighting is computed from `window.location.pathname`
  (blog post pages under `/blog/` highlight "Blog").

## Page-specific layouts

- **About (`index.html` / `css/index.css`)** — the only page with the
  sidebar: rectangular color-framed portrait, name in Devanagari/Bengali,
  role, a status line, and a "Motto for Life" block, all on a `--mg-panel`
  background, staggered fade-up on load. Main content is long-form
  sections with a soft left rule, scroll-triggered reveal
  (`js/design-reveal.js`, `IntersectionObserver`), tag-style interest
  chips, and a color-blocked pull-quote. A cursor glow (`js/design-reveal.js`)
  follows the pointer — pure color gradient, disabled for touch input and
  `prefers-reduced-motion`.
- **Research, Experience, Projects, Blog** — kept their existing structure
  (`<main><h1 class="page-title">…` and page-specific content), which
  already inherited most of the new look for free once `global.css` and
  their own CSS file adopted the palette/type tokens. Specific touches:
  - Experience: timeline rail and node dots recolored to ink/mauve; dates
    moved to mono.
  - Projects: tab buttons became mono pill buttons; project cards get a
    hover lift; group/period labels moved to mono.
  - Blog: tag filter buttons, active-tag state, and prev/next post nav
    recolored; blog date/label metadata moved to mono.
  - Research currently needs no page-specific overrides — it inherits
    global heading/link/`hr` styling directly.

## Motion

- **Entrance**: topbar fades down (`mg-fade-down`, global); About-page
  sidebar content and lede fade up in a staggered sequence
  (`mg-fade-up`, `index.css`).
- **Hover**: logo gets a slight tilt + scale; topnav links get a
  grow-in underline; portrait scales slightly; interest chips and project
  cards lift; CV/social pills invert to solid ink.
- **Scroll**: About-page sections fade + rise into view once via
  `IntersectionObserver`; everywhere else content is static (no
  scroll-reveal wiring on Research/Experience/Projects/Blog — see Known
  gaps).
- All animation is guarded by `prefers-reduced-motion: reduce`.

## Independence / what's still prototype-only

`index-design.html`, `css/design.css`, and `js/design-reveal.js` remain in
the repo as the standalone prototype this system was designed in. They are
no longer linked from anywhere live and can be deleted once you're confident
the rollout is final — nothing on the real site depends on them.
`js/design-reveal.js` **is** still used by `index.html` itself (cursor glow
+ scroll reveal), so don't delete that one.

## Known gaps / possible next steps

- Research/Experience/Projects/Blog don't have the scroll-reveal or
  entrance-stagger treatment the About page has — they render fully static
  aside from the shared topbar/footer motion and hover states. Extending
  `data-reveal` + `design-reveal.js` to their content sections would bring
  full parity if wanted.
- `creative_corner/` (`soul.html`, `main.html`) is unlinked from navigation
  and still on the old styling — out of scope for this pass since it isn't
  part of the linked site.
- `css/cv.css` is empty and not linked from any page — dead file, harmless.
