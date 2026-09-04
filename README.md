# Educate Ohio

Marketing site for **Ohioans United for Public Education** — a citizen-led movement
for the public schools 90% of Ohio students attend.

Static site: plain HTML, CSS, and vanilla JS. No build step, no framework.

## Structure

```
educate-ohio/
├─ index.html            # Home — scroll-narrative story (hero → stakes → values → money → champions → voice → action)
├─ candidates.html       # Champions — interactive, filterable roster driven by data/candidates.json
├─ data/
│  └─ candidates.json    # The 43 champions (name, district, photo) — the site's data "database"
├─ assets/
│  ├─ css/style.css      # All styles (light + dark themes)
│  ├─ js/main.js         # Reveal-on-scroll, 90% count-up, sticky nav, parallax
│  ├─ js/candidates.js   # Loads candidates.json, renders cards, live search + district filter
│  └─ img/
│     ├─ photos/         # Home-page photography (blue-duotone via CSS)
│     └─ candidates/     # One optimized headshot per champion
└─ netlify.toml          # Deploy config (publish root, no build)
```

## Run locally

`candidates.html` uses `fetch()` to load `data/candidates.json`, so it needs to be
served over HTTP (opening the file directly will block the fetch). Any static server works:

```bash
npx serve .
# or
python3 -m http.server 8000
```

Then open http://localhost:8000 (or the port your server prints).

## Deploy — Netlify continuous deployment

The site auto-deploys on every push once connected. One-time setup:

1. Push this folder to a Git repo (GitHub/GitLab/Bitbucket).
2. In Netlify: **Add new site → Import an existing project**, pick the repo.
3. Build command: *(leave empty)* · Publish directory: `.`
   (`netlify.toml` already sets these.)
4. Deploy. From then on, every `git push` to the connected branch triggers a new deploy.

## Editing the champions list

Edit `data/candidates.json` — add/remove entries or fix a district, drop a matching
photo into `assets/img/candidates/`, and push. No code changes needed.

## Notes / TODO

- The **88 counties** figure and the Ohio map pin positions are illustrative placeholders — swap for verified data.
- The email sign-up uses **Netlify Forms** (`data-netlify="true"`, submissions appear in the Netlify dashboard under Forms → "signup"; JS shows an inline success). No extra setup needed once deployed to Netlify; to route elsewhere (Mailchimp, etc.) swap the form `action`/handler.
- Photography is licensed from Unsplash; the org logo is not yet placed in the header.
