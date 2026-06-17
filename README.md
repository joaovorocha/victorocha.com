# victorocha.com

Personal site for Joao V. Rocha — engineer, hardware builder, van dweller.
Built with [Astro](https://astro.build), markdown content, no JS framework.

## Run it

```sh
npm install      # once
npm run dev      # http://localhost:4321
npm run build    # static output to ./dist
npm run preview  # serve the built site locally
```

## Structure

```
src/
├── content/
│   ├── projects/        # one .md per project (frontmatter + body)
│   └── writing/         # one .md per blog post
├── content.config.ts    # collection schemas (status, tags, etc.)
├── layouts/
│   └── BaseLayout.astro
├── components/
│   ├── Header.astro
│   └── Footer.astro
├── pages/
│   ├── index.astro              # home (hero + featured + latest)
│   ├── about.astro
│   ├── projects/
│   │   ├── index.astro          # all projects
│   │   └── [slug].astro         # one project (rendered from content/projects/<slug>.md)
│   └── writing/
│       ├── index.astro
│       └── [slug].astro
└── styles/global.css    # design tokens + base styles (light/dark via prefers-color-scheme)
```

## Add a project

Create `src/content/projects/<slug>.md`:

```md
---
title: "Project name"
summary: "One-sentence pitch."
status: active            # active | shipped | paused | archive
featured: true            # show on home page
order: 3                  # lower = earlier
tags: ["hardware", "x"]
repo: https://github.com/joaovorocha/x   # optional
link: https://example.com                 # optional
---

Body in markdown.
```

The page auto-builds at `/projects/<slug>`.

## Add a blog post

Create `src/content/writing/<slug>.md`:

```md
---
title: "Post title"
summary: "One-sentence hook."
publishedAt: 2026-06-16
draft: false              # true = hide from index
tags: ["meta"]
---

Body in markdown.
```

The post auto-builds at `/writing/<slug>` and shows up on the index, newest first.

## Design notes

- **Fonts**: system serif (Iowan / Palatino / Georgia) for body, system mono (SF Mono / Menlo) for headings and UI labels. No web fonts — fast, no FOUC.
- **Colors**: warm paper background, burnt-amber accent. Dark mode auto-switches via `prefers-color-scheme`. Tokens live at the top of `src/styles/global.css`.
- **No JS** — every page is static HTML. Plenty of room to add interactivity later (Astro islands), nothing required now.

## Deploy

Hosted on **Cloudflare Pages** — free, unlimited bandwidth, no usage billing.

1. Push this repo to GitHub.
2. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git → pick the repo.
3. Build settings:
   - Framework preset: **Astro**
   - Build command: `npm run build`
   - Build output directory: `dist`
4. After the first deploy, Custom domains → Set up a custom domain → `victorocha.com`. Cloudflare will print the exact DNS records to add at Squarespace (or it will offer to move DNS to Cloudflare, which is free and faster).

DNS records to add on the registrar side (Cloudflare will show the actual values):

| Type  | Host | Value                          |
|-------|------|--------------------------------|
| CNAME | `@`  | `victorocha-com.pages.dev.`    |
| CNAME | `www`| `victorocha-com.pages.dev.`    |

(If Squarespace doesn't accept CNAME on the root, Cloudflare can flatten or you can transfer DNS to them.)
