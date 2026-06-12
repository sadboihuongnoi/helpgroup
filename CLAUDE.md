# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

A bilingual (Vietnamese/English) research-lab website built with Hugo + Decap CMS, deployed on Netlify at https://helpgroup.netlify.app. The theme is hand-written in `layouts/` — there is no theme submodule and no JS build step or package.json.

## Commands

```bash
hugo server -D          # local dev server at http://localhost:1313 (includes drafts)
hugo --gc --minify      # production build (what Netlify runs; output in public/)
```

There are no tests or linters. Netlify pins `HUGO_VERSION = "0.161.0"` in `netlify.toml`; keep local Hugo reasonably close to that.

## Architecture

**Single-page homepage.** `layouts/index.html` composes the homepage from `layouts/partials/sections/*.html` (hero, stats, members, publications, projects, news, contact). Nav menus in `hugo.toml` are anchor links (`/#members`, `/en/#projects`) into these sections. Each section also has its own list/single layouts under `layouts/{members,publications,projects,news}/`.

**i18n via file suffixes.** Default language is `vi` (no URL prefix), English lives under `/en/`. Every content file exists as a pair: `slug.vi.md` / `slug.en.md`. Data files are split per locale: `data/vi/*.yml` and `data/en/*.yml` (hero, stats, contact — these drive the homepage sections, not content files). UI strings come from `i18n/vi.toml` and `i18n/en.toml`. When adding content or fields, always update both locales.

**Decap CMS is the schema source of truth.** `static/admin/config.yml` defines every collection and field. Content front-matter must stay in sync with the field `name`s there — if you add/rename a front-matter field in templates or content, mirror it in `config.yml` (and vice versa). The CMS commits directly to `main`, which triggers a Netlify rebuild.

**CMS auth is a self-hosted GitHub OAuth proxy**, not Netlify Identity/Git Gateway (the README's Identity instructions are outdated). The backend in `config.yml` is `github` (repo `sadboihuongnoi/helpgroup`) with `auth_endpoint: .netlify/functions/auth`. The two-step flow lives in `netlify/functions/auth.js` (redirect to GitHub) and `netlify/functions/callback.js` (exchange code for token, postMessage back to the CMS popup). It requires `OAUTH_GITHUB_CLIENT_ID` / `OAUTH_GITHUB_CLIENT_SECRET` env vars on Netlify. `/admin` login cannot work on `hugo server` locally.

**Cross-references by slug.** Publications and projects carry a `members: ["le-van-c", ...]` front-matter list. Member pages (`layouts/members/single.html`) find their publications/projects by intersecting that list with the member file's `ContentBaseName`. Member file slugs are therefore load-bearing — renaming a member file breaks these links silently.

## Conventions

- Content file naming: members/projects use `{{slug}}`, publications use `{{year}}-{{slug}}`, news uses `{{YYYY}}-{{MM}}-{{DD}}-{{slug}}` (defined in `config.yml`).
- Images uploaded via CMS land in `static/images/uploads/` and are referenced as `/images/uploads/...`. Placeholder SVGs there are used as fallbacks in templates.
- Styling is a single file, `static/css/main.css`; JS is `static/js/main.js`.
