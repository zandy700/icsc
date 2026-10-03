# Interlake Citizenship Services Club — Website

Static, SEO-friendly multi-page site for the Interlake Citizenship Services Club (ICSC),
live at **https://interlakecitizenship.xyz**. Three-language UI (English / Spanish / 中文),
signup form that emails `interlakecitizenshipclub@gmail.com`, and CivicPreps.com
(free civics-test practice) featured on every page.

## Pages (clean URLs)

| URL | File |
|---|---|
| `/` | `index.html` — home |
| `/about` | `about/index.html` |
| `/how-it-works` | `how-it-works/index.html` (steps, meeting times, FAQ) |
| `/reviews` | `reviews/index.html` |
| `/practice` | `practice/index.html` — CivicPreps page |
| `/signup` | `signup/index.html` — 4-step signup form |
| `/contact` | `contact/index.html` |
| `/thanks` | `thanks/index.html` — after a signup is submitted |
| anything else | `404.html` |

GitHub Pages serves `folder/index.html` at `/folder`, which is what gives each page its own URL.
Old one-page links such as `interlakecitizenship.xyz/#signup` forward to the new pages, and the old
`thanks.html` forwards to `/thanks/`.

## Editing the site

The HTML pages are **generated** — edit the generator, then rebuild:

```bash
python3 tools/build_site.py
```

`tools/build_site.py` (repo root, not published) holds the shared header, footer, CivicPreps blocks
and every page's content. Edit it once and all pages stay consistent.

Other files in this folder:

- `styles.css` — the whole design system (colors, buttons, cards, header, signup form, footer)
- `script.js` — all EN/ES/中文 text (`I18N`), language switcher, mobile menu, old-link redirects
- `signup.js` — the signup wizard, N/A switches and schedule picker (signup page only)
- `assets/civicpreps-logo.png` — CivicPreps logo
- `sitemap.xml` (generated), `robots.txt`, `google…html` (Search Console verification)

To change wording, edit the English text in `tools/build_site.py` **and** the matching key in
`script.js` (all three languages), then rebuild.

## CivicPreps placement

CivicPreps.com shows up on every page so visitors can't miss it:
the teal bar at the very top, the **Practice Test** button in the header (and phone menu),
the large CivicPreps section on the home page and other pages, the `/practice` page,
the signup and thank-you pages, and the footer.

## Signup form

The form posts to **FormSubmit.co** (`signup/index.html`). Field names are unchanged:
`email`, `phone`, `native_language`, `test_date`, `skip_schedule`, `Monday`…`Sunday`, `notes`.
Any field marked **N/A** is sent as `N/A`. After submitting, people land on `/thanks/`.

If the destination email ever changes, update `EMAIL` at the top of `tools/build_site.py` and rebuild.

## Deploying

Pushing to the deploy branch runs `.github/workflows/pages.yml`, which publishes this folder to
GitHub Pages. The repository must stay **public** (or be on a paid plan) for GitHub Pages to work.
