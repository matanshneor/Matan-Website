# Matan Shneor — Portfolio & Personal Site

Bilingual (English / Hebrew) portfolio and personal-brand site for Matan Shneor: MBA (Big Data & Analytics, Finance & Banking), Data & Business Analyst, and builder of AI-powered tools for small businesses.

**Live site:** https://matanshneor.github.io/Matan-Website/ (GitHub Pages, served from `main`)
Hebrew version: add `?lang=he` to any page URL, or use the EN / עב switch in the header.

## What's on the site

- **Home (`index.html`)** — hero with an annotated career-trajectory chart, key numbers, a filterable project grid, services for businesses, about, experience, education & skills, contact, and a floating WhatsApp button.
- **Case studies (`projects/`)** — one page per project: challenge, what was built, screenshots, outcome, stack.
  - `remax-office.html` — RE/MAX Office Systems (CRM + ad generator)
  - `smartfin.html` — SmartFin household finance app
  - `mitogal.html` — MitoGal event-branding website
  - `agent-website.html` — real-estate agent website

## Stack

Plain static HTML / CSS / JS — no build step, no dependencies. Fonts from Google Fonts (Playfair Display, Inter, JetBrains Mono; Frank Ruhl Libre and Heebo for Hebrew).

## Structure

- `index.html`, `projects/*.html` — pages
- `assets/css/main.css` — all styles (design tokens at the top)
- `assets/js/main.js` — language switch, navigation, scroll reveals, counters, project filters, WhatsApp links
- `images/profile.*` — profile photo
- `images/projects/<slug>/` — project screenshots (WebP). CRM screenshots use demo data in place of real client names, phones and addresses.
- `images/og-image.jpg`, `images/og/` — social-share preview images
- `sitemap.xml`, `robots.txt` — SEO
- `google087909bf77012d01.html` — Google Search Console verification file

## Editing text

Every piece of text appears twice, once per language:

```html
<span data-lang="en">English text</span><span data-lang="he" lang="he">טקסט בעברית</span>
```

Update both. The CSS shows only the active language.

## Deployment

Any push to `main` updates the live site automatically via GitHub Pages.

## Running locally

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```
