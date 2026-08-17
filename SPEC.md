# SPEC.md — Personal Website (palakraisinghani.github.io)

This document is the source of truth for how this site is built and how it
should be extended. It describes intended behavior, not just current code —
when the code and this spec disagree, that's a bug in one of the two, and it
should be resolved deliberately rather than silently.

## 1. Overview

- **What it is:** Palak Raisinghani's personal website — about/bio, research,
  experience, projects, and a blog.
- **Hosting:** GitHub Pages, served directly from the `main` branch root of
  `github.com/palakraisinghani/palakraisinghani.github.io` (a GitHub user
  site). There is no CI build step — whatever is committed to `main` is what
  gets served, as-is.
- **Stack:** Static HTML + CSS + vanilla JS only. No framework, no bundler,
  no package.json, no build step, no server-side code. This is a deliberate
  constraint, not a gap — new features should keep working with this
  constraint unless there's an explicit decision to change it.
- **Rendering model:** Pages are plain HTML files. Shared chrome (header/nav/
  footer) and two dynamic subsystems (blog, projects) are filled in at
  runtime by small vanilla-JS scripts after `DOMContentLoaded`. There is no
  server-side templating and no static site generator.

## 2. Directory structure

```
/index.html              About / bio page (site root)
/research.html            Research interests + ongoing research
/experience.html          Timeline of roles/programs
/projects.html            Tabbed project listing (shell only, content is fetched)
/blog.html                Blog listing (shell only, content is rendered from data)
/blog/*.html               Individual blog posts
/blog/TEMPLATE.html        Copy-this-file template for a new post
/projects/*.html            Per-tab project fragments, fetched by projects.js
/creative_corner/           Standalone experimental microsite, NOT linked from
                             the main nav (see §8)
/css/                      One stylesheet per page + global.css
/js/                       Vanilla JS, no modules (plain <script> tags, load
                             order matters — see below)
/assets/                   Images, CV PDF, logos
```

## 3. Shared page chrome (`js/components.js`)

Every real page includes:
```html
<div id="global-header"></div>
...
<div id="global-footer"></div>
<script src="js/components.js"></script>
```
`components.js` injects the `<header>` (site name, nav links, CV/LinkedIn/
GitHub links) and `<footer>` into those two placeholder divs on
`DOMContentLoaded`.

**Invariant:** nav links and social links live in exactly one place —
`js/components.js`. No page should hand-write a `<header>` or `<nav>`. If a
new top-level page is added, add its link to the `headerHTML` template in
`components.js`, not to individual pages.

**Path resolution rule:** `components.js` detects whether the current page is
inside `/blog/` (i.e. one directory deep) and prefixes links with `../`
accordingly:
```js
const inSubdir = window.location.pathname.includes('/blog/')
                  && !window.location.pathname.endsWith('/blog.html');
const basePath = inSubdir ? '../' : '';
```
Any new script that needs to link back to root-level pages/assets from a
subdirectory must reuse this same `inSubdir`/`basePath` pattern (see
`js/blog.js`) rather than inventing a new one — it must handle the same set
of page depths consistently across the whole site.

## 4. Blog subsystem

**The rule it enforces: a blog post's order, title, date, and tags
are declared in exactly one place. Nothing about navigation or listing is
hand-linked between post files.**

### 4.1 Single source of truth — `js/blog-data.js`

```js
const BLOG_POSTS = [
  {
    id: "life-of-lots-of-pie",          // must match a post's data-blog-id
    title: "Life of Lots of Pie",
    url: "blog/Life_of_lots_of_pie.html", // site-root-relative; for external
                                           // posts, a full https:// URL
    date: "May 26, 2026",
    tags: ["Reflections"],
    desc: "...",                         // shown only on the listing page
    external: false                      // true => opens in new tab, gets
                                           // the external-link icon, and
                                           // resolveUrl() does NOT prefix it
  },
  // ...newest first
];
```
- **Order = newest first.** Position in this array is the only thing that
  determines a post's place in the blog listing *and* its
  Previous/Next neighbors.
- Posts do not have to be local HTML files — `external: true` entries (e.g.
  the Indian Express reprint) participate in the same ordering, listing, and
  prev/next chain as local posts.
- To reorder, add, or remove a post: **edit this file only.**

### 4.2 Rendering engine — `js/blog.js`

On `DOMContentLoaded`, if `BLOG_POSTS` is defined:
1. **Listing page** (`#blog-list` present, i.e. `blog.html`): renders one
   `<article class="blog-sect" data-tags="...">` per entry, in array order.
   Tag filtering (`js/main.js`) reads `data-tags` off these generated nodes,
   so `blog.js` must run and finish before `main.js`'s
   `DOMContentLoaded` handler — see load order below.
2. **Post page** (`.blog-post-header[data-blog-id]` present): looks up that
   `data-blog-id` in `BLOG_POSTS`, fills the header
   (`<h2>title</h2>` + date + tags), and — if an `#blog-end` element exists —
   fills it with a Previous/Next nav built from `BLOG_POSTS[index+1]` (older)
   and `BLOG_POSTS[index-1]` (newer). Missing neighbor ⇒ that side is left
   empty (first/last post in the chain).

**Script load order requirement**, on every page that uses this system:
```html
<script src="js/components.js"></script>
<script src="js/blog-data.js"></script>
<script src="js/blog.js"></script>
<script src="js/main.js"></script>
```
`blog-data.js` before `blog.js` (needs the array to exist), `blog.js` before
`main.js` (needs the DOM it generates to exist before tag-filtering wires up).
From `blog/`, all four paths get a `../` prefix.

### 4.3 Adding a new post

1. Copy `blog/TEMPLATE.html` to `blog/your-post.html`.
2. Add one entry to `BLOG_POSTS` in `js/blog-data.js` at the position that
   matches its publish date (newest first).
3. Set `data-blog-id` on the post's `.blog-post-header` div to match the
   `id` you used in step 2.
4. Write content inside `<main>`, between the header div and `#blog-end`.

No other file needs to change. Specifically: never hand-write a
Previous/Next link, and never hand-write a listing card in `blog.html`.

### 4.4 Invariant checklist for any blog post file

- Has exactly one `<div class="blog-post-header" data-blog-id="...">` and
  that id exists in `BLOG_POSTS`.
- Has exactly one `<div id="blog-end"></div>` and nothing else provides
  prev/next nav.
- Loads `components.js`, `blog-data.js`, `blog.js`, `main.js` in that order.
- `<title>` in `<head>` is set by hand (it's needed pre-JS/for SEO) and
  should read the same as the `title` field in `blog-data.js`.

## 5. Projects subsystem

- `projects.html` is a shell: three tab buttons
  (`data-target="course-projects.html"` etc.) and an empty
  `#project-content`.
- `js/projects.js` fetches `projects/<target>.html` (a bare HTML fragment,
  no `<html>`/`<head>`) and injects it into `#project-content` on tab click,
  and for the `active` tab on load.
- **Consequence:** this subsystem uses `fetch()` against relative paths, so
  it does **not** work when the site is opened via `file://` — it requires
  an actual HTTP server (`python3 -m http.server`, VS Code Live Server per
  `.vscode/settings.json`, etc.), same as GitHub Pages serves it. Keep this
  in mind when testing locally — a blank/error project pane on `file://` is
  expected, not a bug.
- To add a project: add a `<div class="project-box">` block to the relevant
  `projects/*.html` fragment. No JS changes needed.
- **`.project-box` fields**, in display order: `.project-header` (title +
  period, required), `.project-group` (optional — "Research Group", see
  below), `.project-domain` (required), `.project-description` (required).
- **`.project-group` (optional field):** the research group / lab a project
  was done under. Omit the `<div class="project-group">` entirely for
  projects that don't have one (course/programming projects never do;
  research projects usually do). When present:
  ```html
  <div class="project-group"><span class="project-group-label">Research Group</span><a href="https://example.org/" target="_blank" rel="noopener noreferrer">Lab Name, Institute</a></div>
  ```
  The label is optional text, not a link, wrapped in `.project-group-label`;
  the value may be a plain string or a link (use `target="_blank"` +
  `rel="noopener noreferrer"` for external lab sites, matching the
  convention used for external links elsewhere on the site, e.g.
  `experience.html`).

## 6. Pages inventory — what content lives where

| Page | Purpose | Notable behavior |
|---|---|---|
| `index.html` | About/bio, awards & achievements | Static content only |
| `research.html` | Research interests, ongoing research, publications | Static content only |
| `experience.html` | Timeline of roles (industry/research/academia) | Static content only |
| `projects.html` | Tabbed project listing | Dynamic, see §5 |
| `blog.html` | Blog post listing with tag filter | Dynamic, see §4 |
| `blog/*.html` | Individual posts | Dynamic header + nav, see §4 |

Content detail, so it's clear which page is the right place to add or edit a
given fact:

### `index.html` — About
- Portrait photo (`assets/about/...`), name in Devanagari + Bengali script,
  degree line (B.Tech Mathematics and Computing) and institute (IISc
  Bangalore), each linking out to the program/institute pages.
- **Brief Bio**: current year of study, prior schooling location (Pune, 19
  years).
- **Ongoing Undergraduation studies at IISc**: current interests — system
  architecture, system security, high-performance computing / algorithm
  optimization on different hardware; TCS topics of interest (cryptography,
  automata/computability, DSA); openness to research opportunities in
  industry and academia globally.
- A commented-out "Work Summary" `<h3>` — see §8, intentionally left in as a
  draft placeholder, not live content.
- **Awards and Achievements**, split into:
  - *Academic*: Kotak Mahindra UG Scholarship (2024–2028), JEE Advanced AIR
    1461 / JEE Mains CRL 3242 (2024), Dr. Homi Bhabha Balvaidnyanik
    Competition state-level silver (2018), Vidya Valley School Best
    All-Rounder (2017).
  - *Extra curricular*: Kathak dance (Bal Gandharva Tilak exams, Jaipur &
    Benaras Gharana, 3 stages listed); sports (2 ICSE State Athletic Meet
    bronze medals, 4 years on the school basketball team); art exams
    (Intermediate/Elementary — entries currently blank, not yet filled in).

### `research.html` — Research
- **Current Research Interest**: system architecture; system security and
  cryptography.
- **Ongoing Research**: two active lines —
  1. Hardware security vulnerabilities in heterogeneous systems, supervised
     by Prof. Biswabandan Panda (IIT Bombay), from May 2026.
  2. Applied cryptography in distributed systems security, supervised by
     Prof. Vinod Ganapathy (IISc Bangalore), from Aug 2025.
- **Publications**: none yet ("Nothing Yet!!"); a commented-out `<ul>`
  template shows the intended future format (title / conference+year /
  authors).

### `experience.html` — Experience
A reverse-chronological `.timeline` of programs/roles, each with an org
name+logo, a date range, a role title, and a description. Current entries:
1. ACM Summer School on Foundations of Hardware Security, IIT Bombay Trust
   Lab (17–21 June 2026) — Attendee; covered post-quantum lattice-based
   cryptography and Verilog.
2. IIT Bombay Trust Lab (May 2026–Present) — Summer Research Intern under
   Prof. Biswabandan Panda; hardware security vulnerabilities in
   heterogeneous systems.
3. Computer Systems Security Laboratory, IISc (Aug 2025–Present) — Research
   Student under Prof. Vinod Ganapathy; distributed systems security.
4. Summer School in Mathematics and Statistics, ICTS Bangalore (June 2025)
   — Attendee; linear algebra, probability, statistics, cross-field talks
   (evolution, game theory, fractals).
5. Databased – IISc Computer Science Crew (Dec 2024–Present) — Core Member;
   a bulleted list of specific talks/events organized or co-presented
   (Spring 2026 "The Nearly Whole Truth" lecture series, probability talk,
   GPU talk series, Hack-n-Seek, Databased Annual Festival 2025).

### `projects.html` — Projects
Shell page with three tabs; each tab's content is a separate fragment file
under `projects/` (see §5) and is the actual place to edit that tab's
entries:
- **Course Projects** (`projects/course-projects.html`, default/active
  tab): e.g. "Over Parameterized Models" (Autumn 2026, AIML — UMC 203) —
  generalization/implicit bias in deep learning.
- **Research Projects** (`projects/research-projects.html`): "Decentralized
  Information Flow Control in Distributed Systems" (Autumn 2025–Present,
  System Security/Cryptography, Research Group: Computer Systems Security
  Laboratory, IISc — description currently `tbd`) and "Hardware Security in
  Heterogeneous systems" (Summer 2026, Hardware Security/Compilers/Bit Flip
  Attacks/Rowhammer Attacks, Research Group: IIT Bombay Trust Lab —
  Rowhammer-based bit-flip attack on a real-world application).
- **Programming Projects** (`projects/programming-projects.html`): "Deemak"
  (Summer 2025) — a terminal game built in Rust.

### `blog.html` / `blog/*.html` — Blog
- `blog.html` itself carries no post content — it only has the tag-filter
  buttons (Research/Reflections/Philosophy/Travel) and the `#blog-list`
  mount point; all post titles/dates/tags/descriptions come from
  `js/blog-data.js` (§4.1).
- Current posts, newest first (see `js/blog-data.js` for the live list):
  1. **Life of Lots of Pie** (`blog/Life_of_lots_of_pie.html`) — JEE
     preparation journey and advice for aspirants.
  2. **The Tale that tells Taste** (`blog/the_tale_that_tells_taste.html`)
     — reflection on expectations vs. enjoyment, prompted by a conversation
     with a friend.
  3. **Numbers, Logic & Garden of Ideas** — external Indian Express article
     about JEE and the path to IISc Bangalore (`external: true`, opens in a
     new tab).
  4. **The Red Sun in the White Sky** (`blog/japan.html`) — travel account
     of a May 2025 trip to Japan, including two short poems and reflections
     on Japanese lifestyle, discipline, and cuisine.

## 7. Styling conventions

- `css/global.css` — shared: body font (`Lora`), link color (`#003366`),
  header/footer, `main` container (max-width 900px, centered), `.page-title`
  (`Fraunces`), heading styles, `hr`.
- One additional stylesheet per page (`css/index.css`, `css/research.css`,
  `css/experience.css`, `css/projects.css`, `css/blog.css`), loaded after
  `global.css`. Page-specific rules go in the page's own file, not into
  `global.css`.
- Accent navy `#003366` is the site's one accent color — used for links,
  active tag buttons, tab underlines, and nav labels. Reuse it for new
  interactive/accent elements rather than introducing a new color.

## 8. Known gaps / explicitly out of scope right now

- `creative_corner/` (`soul.html`, `main.html`) is a standalone, unfinished,
  **unlinked** microsite — it has its own CSS/fonts and is not reachable
  from the main site nav. `creative_corner/main.html` is currently empty.
  Treat it as a sandbox, not a shipped page, unless asked to wire it in.
- `index.html` has a commented-out "Work Summary" section — left as a draft
  placeholder, not dead code to clean up unprompted.
- No `.nojekyll` file and no GitHub Actions workflow exist — the site relies
  on GitHub Pages' default Jekyll-adjacent static serving of a user-site
  repo. If a directory or file that Jekyll treats specially (e.g. anything
  starting with `_`) is ever added, this will need revisiting.

## 9. Local development

```bash
python3 -m http.server 8000   # from repo root
# or use the VS Code Live Server extension (port 5501, see .vscode/settings.json)
```
Do not open files directly via `file://` — the projects tab-loading (§5) and
the blog rendering (§4, `fetch`-free but still relies on relative script
paths behaving like a normal site) both assume HTTP serving.

## 10. Conventions for future changes

- No hardcoded cross-links between individual pages/posts where a shared
  data source could generate them instead (this is why §4 exists).
- No build tooling, no npm dependencies, no frameworks — if a feature seems
  to need one, treat that as a decision to raise explicitly, not something
  to introduce quietly.
- Keep new dynamic behavior in the same style as `components.js`/`blog.js`/
  `projects.js`: a single `DOMContentLoaded` listener, feature-detects the
  elements it needs (`if (el) {...}`), and does nothing on pages that don't
  have them.
