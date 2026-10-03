#!/usr/bin/env python3
"""
Builds the Interlake ICSC website into ../citizenship-website/.

Every page shares one header (with the CivicPreps bar), one footer and the
same CivicPreps blocks, so edit them here once and re-run:

    python3 tools/build_site.py

Each page is written to <slug>/index.html, which GitHub Pages serves at a
clean URL (e.g. /signup/index.html  ->  interlakecitizenship.xyz/signup).
"""
import html
import pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent / "citizenship-website"
SITE = "https://interlakecitizenship.xyz"
CIVICPREPS = "https://civicpreps.com/"
EMAIL = "interlakecitizenshipclub@gmail.com"
V = "12"  # cache-buster for styles/scripts

QR_SVG = (pathlib.Path(__file__).resolve().parent / "qr.svg.html").read_text().strip()


# ---------------------------------------------------------------- icons ----
def icon(name, cls="icon"):
    paths = {
        "civics":   '<path d="M3 21h18M5 21v-9M9.5 21v-9M14.5 21v-9M19 21v-9M2.5 9.5 12 4l9.5 5.5z"/>',
        "reading":  '<path d="M2.5 5.5c3.2-1.2 6.4-1 9.5 1v13c-3.1-2-6.3-2.2-9.5-1zM21.5 5.5c-3.2-1.2-6.4-1-9.5 1v13c3.1-2 6.3-2.2 9.5-1z"/>',
        "writing":  '<path d="M4 20l1-4.5L16 4.5l3.5 3.5L8.5 19zM14 7l3 3"/>',
        "speaking": '<path d="M4 5.5h16v10.5H10l-5 4v-4H4z"/><path d="M8 10h8M8 13h5"/>',
        "check":    '<path d="M5 12.5l4.5 4.5L19 7.5"/>',
        "arrow":    '<path d="M5 12h14M13 6l6 6-6 6"/>',
        "external": '<path d="M14 4h6v6M20 4l-9 9M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
        "mail":     '<path d="M3.5 6h17v12h-17z"/><path d="M4 7l8 6 8-6"/>',
        "link":     '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
        "clock":    '<circle cx="12" cy="12" r="8.5"/><path d="M12 7.5V12l3 2"/>',
        "users":    '<circle cx="9" cy="8.5" r="3.5"/><path d="M2.5 20c.8-3.5 3.3-5.5 6.5-5.5s5.7 2 6.5 5.5"/><path d="M16 5.5a3.5 3.5 0 0 1 0 6.5M18 14.8c1.8.8 3 2.5 3.5 5.2"/>',
        "gift":     '<path d="M4 11h16v9H4zM3 7.5h18V11H3zM12 7.5V20"/><path d="M12 7.5C10.5 4 7 4 7 6s2.5 1.5 5 1.5zM12 7.5C13.5 4 17 4 17 6s-2.5 1.5-5 1.5z"/>',
        "video":    '<path d="M3.5 6.5h12v11h-12zM15.5 10.5l5-3v9l-5-3"/>',
        "repeat":   '<path d="M4 10a8 8 0 0 1 14-4l2 2M20 4v4h-4M20 14a8 8 0 0 1-14 4l-2-2M4 20v-4h4"/>',
        "mic":      '<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5.5 11a6.5 6.5 0 0 0 13 0M12 17.5V21"/>',
        "globe":    '<circle cx="12" cy="12" r="8.5"/><path d="M3.5 12h17M12 3.5c2.5 2.6 3.5 5.4 3.5 8.5s-1 5.9-3.5 8.5c-2.5-2.6-3.5-5.4-3.5-8.5s1-5.9 3.5-8.5z"/>',
        "clipboard":'<path d="M8 4.5h8v3H8z"/><path d="M8 6H5.5v14.5h13V6H16"/><path d="M8.5 12.5l2.5 2.5 4.5-4.5"/>',
        "chat":     '<path d="M4 5h16v11h-9l-5 4v-4H4z"/><path d="M9 9.5c.4-1.2 1.6-1.8 3-1.5 1.5.3 2 2 .8 2.9-.7.5-1.3.8-1.3 1.6M11.5 14h.01"/>',
        "menu":     '<path d="M4 7h16M4 12h16M4 17h16"/>',
        "star":     '<path d="M12 3.5l2.6 5.5 6 .7-4.4 4.1 1.2 5.9L12 16.8l-5.4 2.9 1.2-5.9L3.4 9.7l6-.7z"/>',
    }
    return (f'<svg class="{cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" '
            f'stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">{paths[name]}</svg>')


def t(key, text, tag="span", cls=None, extra=""):
    """An element whose text is translated by script.js (data-i18n)."""
    c = f' class="{cls}"' if cls else ""
    return f'<{tag}{c} data-i18n="{key}"{extra}>{html.escape(text, quote=False)}</{tag}>'


# ----------------------------------------------------------- navigation ----
NAV = [
    ("home", "/", "nav.home", "Home"),
    ("about", "/about/", "nav.about", "About"),
    ("how", "/how-it-works/", "nav.how", "How It Works"),
    ("reviews", "/reviews/", "nav.reviews", "Reviews"),
    ("contact", "/contact/", "nav.contact", "Contact"),
]


def header(active):
    cur = ' aria-current="page"'
    links = "\n".join(
        f'          <a href="{href}"{cur if key == active else ""} data-i18n="{k}">{label}</a>'
        for key, href, k, label in NAV)
    practice_cur = ' aria-current="page"' if active == "practice" else ""
    signup_cur = ' aria-current="page"' if active == "signup" else ""
    return f'''  <a class="skip-link" href="#main">Skip to content</a>

  <a class="topbar" href="{CIVICPREPS}" target="_blank" rel="noopener">
    <span class="container topbar-inner">
      <img src="/assets/civicpreps-logo.png" alt="" width="26" height="26" />
      <span class="topbar-text" data-i18n="bar.text">Studying for the civics test? Practice all 128 questions free on CivicPreps.com</span>
      <span class="topbar-cta" data-i18n="bar.cta">Start practicing →</span>
    </span>
  </a>

  <header class="site-header">
    <div class="container header-inner">
      <a href="/" class="logo" aria-label="Interlake ICSC home">
        <span class="logo-mark" aria-hidden="true">★</span>
        <span class="logo-text">Interlake <b>ICSC</b></span>
      </a>
      <nav class="nav" id="site-nav" aria-label="Primary">
        <div class="nav-links">
{links}
        </div>
        <div class="nav-actions">
          <a href="/practice/" class="nav-practice"{practice_cur}>
            <img src="/assets/civicpreps-logo.png" alt="" width="22" height="22" />
            <span data-i18n="nav.practice">Practice Test</span>
          </a>
          <a href="/signup/" class="btn btn-primary nav-signup"{signup_cur} data-i18n="nav.signup">Sign Up</a>
        </div>
      </nav>
      <div class="header-tools">
        <div class="lang-switch" role="group" aria-label="Language">
          <button type="button" data-lang="en" class="active">EN</button>
          <button type="button" data-lang="es">ES</button>
          <button type="button" data-lang="zh">中文</button>
        </div>
        <button type="button" class="nav-toggle" aria-controls="site-nav" aria-expanded="false">
          {icon("menu")}<span class="sr-only" data-i18n="nav.menu">Menu</span>
        </button>
      </div>
    </div>
  </header>'''


def footer():
    links = "\n".join(f'            <li><a href="{href}" data-i18n="{k}">{label}</a></li>'
                      for _, href, k, label in NAV)
    return f'''  <footer class="site-footer">
    <div class="container footer-grid">
      <div class="footer-brand">
        <a href="/" class="logo logo-light"><span class="logo-mark" aria-hidden="true">★</span><span class="logo-text">Interlake <b>ICSC</b></span></a>
        {t("footer.tag", "A free, student-run tutoring program at Interlake High School.", "p")}
        <a href="/signup/" class="btn btn-gold" data-i18n="nav.signup">Sign Up</a>
      </div>
      <div>
        {t("footer.pages", "Pages", "h2")}
        <ul class="footer-links">
{links}
            <li><a href="/practice/" data-i18n="nav.practice">Practice Test</a></li>
            <li><a href="/signup/" data-i18n="nav.signup">Sign Up</a></li>
        </ul>
      </div>
      <div class="footer-cp">
        {t("footer.study", "Study on your own", "h2")}
        <a class="footer-cp-card" href="{CIVICPREPS}" target="_blank" rel="noopener">
          <img src="/assets/civicpreps-logo.png" alt="CivicPreps logo" width="44" height="44" />
          <span>
            <strong>CivicPreps.com</strong>
            {t("footer.study.body", "CivicPreps — free practice for all 128 civics questions, reading, writing and speaking, in 7 languages.")}
            {t("footer.study.cta", "Go to CivicPreps.com →", "em")}
          </span>
        </a>
      </div>
      <div>
        {t("footer.contact", "Contact", "h2")}
        <ul class="footer-links">
          <li><a href="mailto:{EMAIL}">{EMAIL.replace("@", "@<wbr>")}</a></li>
          <li><a href="https://linktr.ee/interlakecitizenshipclub" target="_blank" rel="noopener">linktr.ee/interlakecitizenshipclub</a></li>
        </ul>
      </div>
    </div>
    <div class="container footer-bottom">
      <p>© <span data-year>2026</span> Interlake Citizenship Services Club</p>
    </div>
  </footer>'''


def page(slug, title, desc, body, active=None, noindex=False, extra_head="", scripts=""):
    path = "/" if slug == "" else f"/{slug}/"
    canonical = SITE + path
    robots = "noindex, follow" if noindex else "index, follow"
    return f'''<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>{html.escape(title)}</title>
  <meta name="description" content="{html.escape(desc)}" />
  <meta name="robots" content="{robots}" />
  <link rel="canonical" href="{canonical}" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Interlake Citizenship Services Club" />
  <meta property="og:title" content="{html.escape(title)}" />
  <meta property="og:description" content="{html.escape(desc)}" />
  <meta property="og:url" content="{canonical}" />
  <meta name="twitter:card" content="summary" />
  <meta name="theme-color" content="#14306a" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,700;9..144,800&family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="/styles.css?v={V}" />
{extra_head}</head>
<body>
{header(active)}

  <main id="main">
{body}
  </main>

{footer()}

  <script src="/script.js?v={V}" defer></script>
{scripts}</body>
</html>
'''


# ------------------------------------------------------ shared blocks ----
def page_hero(title_key, title, sub_key, sub):
    return f'''    <section class="page-hero">
      <div class="container">
        {t(title_key, title, "h1")}
        {t(sub_key, sub, "p", "page-hero-sub")}
      </div>
    </section>'''


def cp_feature(heading_tag="h2"):
    feats = [("repeat", "cp.f1", "All 128 official civics questions — missed ones come back until you know them"),
             ("mic", "cp.f2", "Speak your answers out loud and get pronunciation feedback"),
             ("globe", "cp.f3", "Short lessons in 7 languages that explain the answers"),
             ("clipboard", "cp.f4", "A full mock interview: speaking, reading and writing")]
    items = "\n".join(f'            <li>{icon(i)}{t(k, v)}</li>' for i, k, v in feats)
    return f'''        <div class="cp-feature">
          <div class="cp-feature-main">
            <p class="cp-badge">{icon("star")}{t("cp.badge", "Free practice website")}</p>
            {t("cp.title", "Practice anytime with CivicPreps", heading_tag)}
            {t("cp.lead", "Between tutoring sessions, study on your own at CivicPreps.com — a free practice website for the U.S. citizenship interview.", "p", "cp-lead")}
            <ul class="cp-list">
{items}
            </ul>
            <div class="cp-actions">
              <a class="btn btn-civic btn-large" href="{CIVICPREPS}" target="_blank" rel="noopener">{t("cp.cta", "Practice free on CivicPreps.com")}{icon("external")}</a>
              {t("cp.note", "Free · opens in a new tab", "span", "cp-note")}
            </div>
          </div>
          <a class="cp-feature-art" href="{CIVICPREPS}" target="_blank" rel="noopener" aria-label="Open CivicPreps.com">
            <img src="/assets/civicpreps-logo.png" alt="CivicPreps logo" width="160" height="160" />
            <span class="cp-url">civicpreps.com</span>
            <span class="cp-chips"><span>128</span><span>7 🌐</span><span>🎙️</span></span>
          </a>
        </div>'''


def cp_mini(title_key, title, body_key, body):
    return f'''          <div class="cp-mini">
            <img src="/assets/civicpreps-logo.png" alt="" width="48" height="48" />
            {t(title_key, title, "h2")}
            {t(body_key, body, "p")}
            <a class="btn btn-civic" href="{CIVICPREPS}" target="_blank" rel="noopener">{t("cp.cta", "Practice free on CivicPreps.com")}{icon("external")}</a>
          </div>'''


COVER = [("civics", "cover.civics", "Civics", "Practice the official USCIS questions on U.S. history and government."),
         ("reading", "cover.reading", "Reading", "Read sentences with the official USCIS vocabulary, clearly and confidently."),
         ("writing", "cover.writing", "Writing", "Master sentence dictation from the USCIS writing word list."),
         ("speaking", "cover.speaking", "Speaking", "Get comfortable answering interview questions out loud with a real person.")]


def cover_cards():
    return "\n".join(f'''          <article class="card">
            <span class="icon-badge">{icon(i)}</span>
            {t(k + ".t", ti, "h3")}
            {t(k + ".b", b, "p")}
          </article>''' for i, k, ti, b in COVER)


STEPS = [("how.s1", "Sign up", "Fill out a short form with your email and the times that work for you."),
         ("how.s2", "Get matched", "We pair you with 1 or 2 high school tutors who fit your schedule."),
         ("how.s3", "Meet on Zoom", "Join a friendly 30-minute Zoom session each week."),
         ("how.s4", "Pass the test", "Walk into your USCIS interview ready and confident.")]


def steps():
    return "\n".join(f'''          <li class="step">
            <span class="step-num">{n}</span>
            {t(k + ".t", ti, "h3")}
            {t(k + ".b", b, "p")}
          </li>''' for n, (k, ti, b) in enumerate(STEPS, 1))


REVIEWS = [("rev.r1", "“I am very grateful to these guys for their great help and willingness.”"),
           ("rev.r2", "“This program and tutor support is a must for anyone doing the citizenship test. The three tutors met with me for months to help me prepare for the English and civics test. Every time they made me memorize but also gave me the theory behind the questions.”")]


def reviews():
    return "\n".join(f'''          <figure class="review">
            <span class="review-stars" aria-hidden="true">★★★★★</span>
            {t(k, q, "blockquote")}
            <figcaption>— {t("rev.who", "ICSC student")}</figcaption>
          </figure>''' for k, q in REVIEWS)


def cta_band():
    return f'''    <section class="cta-band">
      <div class="container cta-inner">
        <div>
          {t("cta.title", "Ready to start?", "h2")}
          {t("cta.body", "Sign up in about 2 minutes. A tutor coordinator will reach out within a few days to set up your first Zoom session.", "p")}
        </div>
        <a href="/signup/" class="btn btn-gold btn-large" data-i18n="cta.btn">Sign Up — It's Free</a>
      </div>
    </section>'''


# --------------------------------------------------------------- pages ----
def home():
    org = '''  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "EducationalOrganization",
    "name": "Interlake Citizenship Services Club",
    "alternateName": "ICSC",
    "description": "Free, student-run tutoring program for the US Naturalization test. Covers civics, reading, writing, and speaking.",
    "url": "https://interlakecitizenship.xyz/",
    "email": "interlakecitizenshipclub@gmail.com",
    "areaServed": "United States",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD",
      "description": "Free 30-minute weekly Zoom tutoring sessions for the US citizenship test."
    }
  }
  </script>
'''
    bullets = "\n".join(f'            <li>{icon(i)}{t(k, v)}</li>' for i, k, v in
                        [("gift", "home.b1", "Always free"), ("users", "home.b2", "1 or 2 tutors per student"),
                         ("video", "home.b3", "30 minutes a week on Zoom")])
    parts = "\n".join(f'            <li><span class="icon-badge">{icon(i)}</span>{t(k + ".t", ti)}</li>' for i, k, ti, _ in COVER)
    body = f'''    <section class="home-hero">
      <div class="container home-hero-inner">
        <div class="home-hero-copy">
          {t("home.eyebrow", "Interlake Citizenship Services Club", "p", "eyebrow")}
          {t("home.title", "Free tutoring for the U.S. citizenship test", "h1")}
          {t("home.lede", "Interlake High School students help you prepare for your naturalization interview — civics, reading, writing and speaking — in friendly 1-on-1 Zoom sessions.", "p", "lede")}
          <div class="hero-actions">
            <a href="/signup/" class="btn btn-primary btn-large" data-i18n="home.cta1">Sign Up — It's Free</a>
            <a href="/how-it-works/" class="btn btn-outline btn-large" data-i18n="home.cta2">How It Works</a>
          </div>
          <ul class="hero-points">
{bullets}
          </ul>
        </div>
        <div class="hero-panel">
          {t("home.card.title", "We help with every part of the test", "h2")}
          <ul class="hero-parts">
{parts}
          </ul>
          <a class="hero-panel-cp" href="{CIVICPREPS}" target="_blank" rel="noopener">
            <img src="/assets/civicpreps-logo.png" alt="" width="36" height="36" />
            <span>{t("bar.text", "Studying for the civics test? Practice all 128 questions free on CivicPreps.com")}</span>
            {icon("arrow")}
          </a>
        </div>
      </div>
    </section>

    <section class="section section-cp" aria-label="CivicPreps">
      <div class="container">
{cp_feature()}
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head">
          {t("home.cover.title", "What we cover", "h2")}
          {t("home.cover.lead", "Your tutors prepare you for all four parts of the naturalization test.", "p")}
        </div>
        <div class="grid-4">
{cover_cards()}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-head section-head-row">
          {t("home.how.title", "How it works", "h2")}
          <a href="/how-it-works/" class="text-link" data-i18n="home.how.more">See the full process →</a>
        </div>
        <ol class="steps">
{steps()}
        </ol>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-head section-head-row">
          {t("home.rev.title", "What students say", "h2")}
          <a href="/reviews/" class="text-link" data-i18n="home.rev.more">Read all reviews →</a>
        </div>
        <div class="grid-2">
{reviews()}
        </div>
      </div>
    </section>

{cta_band()}'''
    return page("", "Interlake Citizenship Services Club (ICSC) — Free US Citizenship Test Tutoring",
                "Free 1-on-1 Zoom tutoring for the US naturalization (citizenship) test from Interlake High School students — civics, reading, writing and speaking. Plus free practice on CivicPreps.com.",
                body, "home", extra_head=org)


def about():
    stats = [("1–2", "about.stats.a", "tutors per student"), ("30", "about.stats.b", "minutes per weekly session"),
             ("100%", "about.stats.c", "free — no cost, ever")]
    st = "\n".join(f'''          <div class="stat"><span class="stat-num">{n}</span>{t(k, l, "span", "stat-label")}</div>''' for n, k, l in stats)
    body = f'''{page_hero("about.title", "About the Club", "about.sub", "A student-run program at Interlake High School")}

    <section class="section">
      <div class="container about-grid">
        <div class="prose">
          {t("about.body", "Interlake Citizenship Services Club (ICSC) is a student-run program that pairs aspiring U.S. citizens with trained high school tutors. We provide friendly, patient support in the English language skills essential for passing the citizenship interview — completely free of charge.", "p", "lede")}
          {t("about.who.t", "Who we are", "h2")}
          {t("about.who.b", "Our tutors are trained Interlake High School students. Each student is matched with 1 or 2 tutors, who meet with them on Zoom every week until their interview.", "p")}
        </div>
        <div class="stats">
{st}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          {t("home.cover.title", "What we cover", "h2")}
          {t("home.cover.lead", "Your tutors prepare you for all four parts of the naturalization test.", "p")}
        </div>
        <div class="grid-4">
{cover_cards()}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
{cp_feature()}
      </div>
    </section>

{cta_band()}'''
    return page("about", "About the Club — Interlake Citizenship Services Club",
                "Interlake Citizenship Services Club (ICSC) is a student-run program at Interlake High School that pairs aspiring US citizens with trained tutors — free.",
                body, "about")


def how_it_works():
    faqs = [("faq.q1", "Does it cost anything?", "faq.a1", "No. ICSC tutoring is completely free."),
            ("faq.q2", "Who are the tutors?", "faq.a2", "Trained Interlake High School students. You'll be matched with 1 or 2 tutors."),
            ("faq.q3", "How do sessions work?", "faq.a3", "You meet your tutor on Zoom for 30 minutes each week, at a time you choose."),
            ("faq.q4", "What do I need to sign up?", "faq.a4", "Only an email address. Everything else on the form is optional."),
            ("faq.q5", "Where can I practice on my own?", "faq.a5", "On CivicPreps.com — free practice for all 128 civics questions, plus reading, writing and speaking.")]
    fq = "\n".join(f'''          <details class="faq">
            <summary>{t(q, qt)}</summary>
            {t(a, at, "p")}
          </details>''' for q, qt, a, at in faqs)
    body = f'''{page_hero("howp.title", "How It Works", "howp.sub", "From sign-up to your interview in four simple steps")}

    <section class="section">
      <div class="container">
        <ol class="steps steps-lg">
{steps()}
        </ol>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container two-col">
        <div class="card times-card">
          <span class="icon-badge">{icon("clock")}</span>
          {t("howp.times.t", "When we meet", "h2")}
          {t("howp.times.b", "Sessions are 30 minutes on Zoom. You choose the times that work for you (Pacific Time):", "p")}
          <ul class="times">
            <li>{t("howp.times.wk", "Monday – Friday")}<strong>4:00 PM – 10:00 PM</strong></li>
            <li>{t("howp.times.we", "Saturday – Sunday")}<strong>9:00 AM – 10:00 PM</strong></li>
          </ul>
        </div>
        <div>
          {t("howp.faq.t", "Questions", "h2", "faq-title")}
{fq}
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container">
{cp_feature()}
      </div>
    </section>

{cta_band()}'''
    return page("how-it-works", "How It Works — Interlake Citizenship Services Club",
                "Sign up, get matched with 1–2 high school tutors, meet on Zoom for 30 minutes a week, and pass your US citizenship interview. Free.",
                body, "how")


def reviews_page():
    body = f'''{page_hero("revp.title", "Reviews", "revp.sub", "What students say about ICSC tutoring")}

    <section class="section">
      <div class="container">
        <div class="grid-2">
{reviews()}
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
{cp_feature()}
      </div>
    </section>

{cta_band()}'''
    return page("reviews", "Reviews — Interlake Citizenship Services Club",
                "Read what students say about free 1-on-1 citizenship test tutoring from the Interlake Citizenship Services Club.",
                body, "reviews")


def practice():
    tips = [("repeat", "prac.tip1", "Practice what you missed", "CivicPreps brings back the questions you get wrong until you know them."),
            ("chat", "prac.tip2", "Bring questions to Zoom", "Anything confusing? Ask your ICSC tutor about it in your next session."),
            ("clipboard", "prac.tip3", "Try the mock interview", "Before your USCIS appointment, run the full speaking, reading and writing practice.")]
    tp = "\n".join(f'''          <article class="card">
            <span class="icon-badge icon-badge-civic">{icon(i)}</span>
            {t(k + ".t", ti, "h3")}
            {t(k + ".b", b, "p")}
          </article>''' for i, k, ti, b in tips)
    body = f'''{page_hero("prac.title", "Practice with CivicPreps", "prac.sub", "Free online practice for the U.S. citizenship test — anytime, at your own pace")}

    <section class="section">
      <div class="container">
{cp_feature()}
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
        <div class="section-head">
          {t("prac.tips.t", "How to use it with your tutor", "h2")}
        </div>
        <div class="grid-3">
{tp}
        </div>
      </div>
    </section>

    <section class="cta-band">
      <div class="container cta-inner">
        <div>
          {t("prac.tutor.t", "Want a real person to practice with?", "h2")}
          {t("prac.tutor.b", "ICSC tutors meet with you 1-on-1 on Zoom every week — for free.", "p")}
        </div>
        <a href="/signup/" class="btn btn-gold btn-large" data-i18n="cta.btn">Sign Up — It's Free</a>
      </div>
    </section>'''
    return page("practice", "Practice Test — CivicPreps | Interlake Citizenship Services Club",
                "Practice all 128 US citizenship civics questions, plus reading, writing and speaking, free on CivicPreps.com — in 7 languages.",
                body, "practice")


def contact():
    body = f'''{page_hero("contact.title", "Contact Us", "contact.sub", "Questions before signing up? We'd love to hear from you.")}

    <section class="section">
      <div class="container contact-grid">
        <a class="card contact-card" href="mailto:{EMAIL}">
          <span class="icon-badge">{icon("mail")}</span>
          {t("contact.email.t", "Email", "h2")}
          <p class="contact-value">{EMAIL.replace("@", "@<wbr>")}</p>
        </a>
        <a class="card contact-card" href="https://linktr.ee/interlakecitizenshipclub" target="_blank" rel="noopener">
          <span class="icon-badge">{icon("link")}</span>
          {t("contact.links.t", "All our links", "h2")}
          <p class="contact-value">linktr.ee/interlakecitizenshipclub</p>
        </a>
        <div class="card qr-card">
          <a href="{SITE}/" class="qr-link" aria-label="Visit interlakecitizenship.xyz">{QR_SVG}</a>
          {t("contact.qr", "Scan to visit our website", "p")}
          <p class="qr-url">interlakecitizenship.xyz</p>
        </div>
      </div>
    </section>

    <section class="section section-alt">
      <div class="container">
{cp_feature()}
      </div>
    </section>

{cta_band()}'''
    return page("contact", "Contact Us — Interlake Citizenship Services Club",
                f"Questions about free citizenship test tutoring? Email {EMAIL} or visit our links.",
                body, "contact")


def signup():
    wk = ["4:00 PM", "5:00 PM", "6:00 PM", "7:00 PM", "8:00 PM", "9:00 PM"]
    we = ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM", "1:00 PM", "2:00 PM", "3:00 PM"] + wk
    days = [("monday", "Monday", "mon", wk, "4:00 PM – 10:00 PM"), ("tuesday", "Tuesday", "tue", wk, "4:00 PM – 10:00 PM"),
            ("wednesday", "Wednesday", "wed", wk, "4:00 PM – 10:00 PM"), ("thursday", "Thursday", "thu", wk, "4:00 PM – 10:00 PM"),
            ("friday", "Friday", "fri", wk, "4:00 PM – 10:00 PM"), ("saturday", "Saturday", "sat", we, "9:00 AM – 10:00 PM"),
            ("sunday", "Sunday", "sun", we, "9:00 AM – 10:00 PM")]

    def day_row(slug, name, key, times, hours):
        chips = "\n".join(f'                        <label class="chip"><input type="checkbox" name="{name}" value="{tm}" /><span>{tm}</span></label>'
                          for tm in times)
        return f'''                  <div class="su-day" data-day="{slug}">
                    <label class="su-day-head">
                      <input type="checkbox" class="day-toggle" />
                      <span class="su-day-box" aria-hidden="true"></span>
                      <span class="su-day-name" data-i18n="form.day.{key}">{name}</span>
                      <span class="su-day-count" aria-hidden="true"></span>
                      <span class="su-day-hours">{hours}</span>
                    </label>
                    <div class="su-times">
{chips}
                    </div>
                  </div>'''

    def na(target, key="form.na", text="N/A — prefer not to say"):
        return (f'<label class="su-na"><input type="checkbox" data-na-for="{target}" />'
                f'<span class="su-switch" aria-hidden="true"></span><span data-i18n="{key}">{text}</span></label>')

    langs = "".join(f'<option value="{l}"></option>' for l in
                    ["Spanish", "Mandarin", "Cantonese", "Vietnamese", "Korean", "Tagalog", "Russian", "Arabic",
                     "Hindi", "Ukrainian", "Portuguese", "Amharic"])
    step_names = [("su.s1", "Contact"), ("su.s2", "About you"), ("su.s3", "Schedule"), ("su.s4", "Review")]
    stepper = "\n".join(
        f'                <li class="su-step{" is-active" if i == 0 else ""}"><button type="button"><span class="su-dot">{i + 1}</span>{t(k, n, "span", "su-step-name")}</button></li>'
        for i, (k, n) in enumerate(step_names))
    next_steps = "\n".join(f'              <li><span class="step-num">{n}</span>{t(k, v)}</li>' for n, (k, v) in enumerate(
        [("signup.next.1", "We receive your signup by email."),
         ("signup.next.2", "A tutor coordinator reaches out within a few days."),
         ("signup.next.3", "You meet your tutor on Zoom.")], 1))

    body = f'''{page_hero("signup.title", "Sign Up for Free Tutoring", "signup.lead", "Four quick steps — about 2 minutes. Only your email is required; skip anything you'd rather not answer.")}

    <section class="section section-tight">
      <div class="container signup-layout">
        <div class="form-card">
          <form id="signup-form" class="su-form" action="https://formsubmit.co/{EMAIL}" method="POST">
            <input type="hidden" name="_subject" value="New ICSC Signup" />
            <input type="hidden" name="_template" value="table" />
            <input type="hidden" name="_captcha" value="true" />
            <input type="hidden" name="_next" value="{SITE}/thanks/" />
            <input type="text" name="_honey" style="display:none" tabindex="-1" autocomplete="off" />

            <ol class="su-steps">
{stepper}
            </ol>
            <div class="su-progress" aria-hidden="true"><span></span></div>

            <fieldset class="su-panel is-active" data-step="0">
              <legend class="su-panel-title" data-i18n="su.p1">How can we reach you?</legend>
              <div class="su-field">
                <label for="email" data-i18n="form.email">Email address *</label>
                <input type="email" id="email" name="email" placeholder="you@example.com" autocomplete="email" required aria-describedby="email-err" />
                <p class="su-err" id="email-err" data-i18n="su.err.email" hidden>Please enter a valid email address.</p>
              </div>
              <div class="su-field">
                <label for="phone" data-i18n="form.phone">Phone number</label>
                <input type="tel" id="phone" name="phone" placeholder="(555) 123-4567" autocomplete="tel" />
                {na("phone")}
              </div>
            </fieldset>

            <fieldset class="su-panel" data-step="1">
              <legend class="su-panel-title" data-i18n="su.p2">Tell us a little about you</legend>
              <div class="su-field">
                <label for="native_language" data-i18n="form.lang">Native language</label>
                <input type="text" id="native_language" name="native_language" placeholder="e.g. Spanish, Mandarin, Vietnamese" list="lang-list" />
                <datalist id="lang-list">{langs}</datalist>
                {na("native_language")}
              </div>
              <div class="su-field">
                <label for="test_date" data-i18n="form.testdate">Citizenship test date</label>
                <input type="date" id="test_date" name="test_date" />
                {na("test_date", "form.na.date", "N/A — not scheduled yet")}
              </div>
            </fieldset>

            <fieldset class="su-panel" data-step="2">
              <legend class="su-panel-title" data-i18n="su.p3">When can you meet?</legend>
              <p class="su-hint"><strong data-i18n="form.sched.title">Preferred meeting times (Pacific Time)</strong> <span data-i18n="form.sched.hint">Pick each day that works, then choose your times for that day. Sessions are 30 minutes.</span></p>
              <div class="su-sched-bar">
                <label class="su-na su-skip"><input type="checkbox" id="skip_schedule" name="skip_schedule" value="Yes" /><span class="su-switch" aria-hidden="true"></span><span data-i18n="form.sched.skip">Skip — I haven't decided yet</span></label>
                <span class="su-slot-total" aria-live="polite"></span>
              </div>
              <div class="su-days" id="day_list">
{chr(10).join(day_row(*d) for d in days)}
              </div>
            </fieldset>

            <fieldset class="su-panel" data-step="3">
              <legend class="su-panel-title" data-i18n="su.p4">Almost done — check your details</legend>
              <dl class="su-review" id="su-review"></dl>
              <div class="su-field">
                <label for="notes" data-i18n="form.notes">Anything else we should know? (optional)</label>
                <textarea id="notes" name="notes" rows="3"></textarea>
              </div>
              <button type="submit" class="btn btn-primary btn-large su-submit">
                <span class="su-submit-text" data-i18n="form.submit">Submit Signup</span>
                <span class="su-spinner" aria-hidden="true"></span>
              </button>
              <p class="form-foot" data-i18n="form.foot">By submitting, you consent to be contacted at the email or phone number provided.</p>
            </fieldset>

            <div class="su-nav">
              <button type="button" class="btn btn-outline su-prev" data-i18n="su.back">← Back</button>
              <span class="su-stepof" aria-live="polite"></span>
              <button type="button" class="btn btn-primary su-next" data-i18n="su.next">Next →</button>
            </div>
          </form>
        </div>

        <aside class="signup-aside">
          <div class="card next-card">
            {t("signup.next.t", "What happens next", "h2")}
            <ol class="next-list">
{next_steps}
            </ol>
          </div>
{cp_mini("signup.cp.t", "Start practicing today", "signup.cp.b", "You don't have to wait for your first session — practice the civics questions now on CivicPreps.com.")}
        </aside>
      </div>
    </section>'''
    return page("signup", "Sign Up for Free Tutoring — Interlake Citizenship Services Club",
                "Sign up for free 1-on-1 US citizenship test tutoring on Zoom. About 2 minutes — only your email is required.",
                body, "signup", scripts=f'  <script src="/signup.js?v={V}" defer></script>\n')


def thanks():
    body = f'''    <section class="section thanks">
      <div class="container thanks-inner">
        <div class="card thanks-card">
          <span class="thanks-check" aria-hidden="true">{icon("check")}</span>
          {t("thanks.title", "Thank you!", "h1")}
          {t("thanks.body", "We received your signup. An ICSC tutor coordinator will reach out within a few days to confirm your match and your first Zoom session.", "p", "lede")}
          <div class="notice">
            {t("thanks.spam.t", "Don't see our email?", "strong")}
            {t("thanks.spam.b", "Please check your Spam or Junk folder. Emails from interlakecitizenshipclub@gmail.com sometimes land there — mark it as “Not spam” so future messages reach your inbox.", "p")}
          </div>
          <a href="/" class="text-link" data-i18n="thanks.home">← Back to homepage</a>
        </div>
{cp_mini("thanks.cp.t", "While you wait, start practicing", "thanks.cp.b", "Get a head start on CivicPreps.com — free practice for all 128 civics questions, reading, writing and speaking.")}
      </div>
    </section>'''
    return page("thanks", "Thank You — Interlake Citizenship Services Club",
                "Thanks for signing up for free citizenship test tutoring.", body, None, noindex=True)


def not_found():
    links = "\n".join(f'          <li><a href="{h}" data-i18n="{k}">{l}</a></li>' for _, h, k, l in NAV)
    body = f'''    <section class="section thanks">
      <div class="container thanks-inner">
        <div class="card thanks-card">
          {t("nf.title", "Page not found", "h1")}
          {t("nf.body", "Sorry — that page doesn't exist. Try one of these:", "p", "lede")}
          <ul class="nf-links">
{links}
          <li><a href="/practice/" data-i18n="nav.practice">Practice Test</a></li>
          <li><a href="/signup/" data-i18n="nav.signup">Sign Up</a></li>
          </ul>
        </div>
      </div>
    </section>'''
    return page("404", "Page not found — Interlake Citizenship Services Club", "Page not found.", body, None, noindex=True)


# ---------------------------------------------------------------- write ----
def write(rel, text):
    p = ROOT / rel
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(text)
    print("wrote", p.relative_to(ROOT.parent))


def main():
    write("index.html", home())
    write("about/index.html", about())
    write("how-it-works/index.html", how_it_works())
    write("reviews/index.html", reviews_page())
    write("practice/index.html", practice())
    write("contact/index.html", contact())
    write("signup/index.html", signup())
    write("thanks/index.html", thanks())
    write("404.html", not_found())
    # old confirmation URL (cached forms / bookmarks) forwards to the new one
    write("thanks.html", f'''<!DOCTYPE html>
<html lang="en"><head><meta charset="UTF-8" />
<meta http-equiv="refresh" content="0; url=/thanks/" />
<link rel="canonical" href="{SITE}/thanks/" /><meta name="robots" content="noindex" />
<title>Thank You — Interlake Citizenship Services Club</title></head>
<body><p><a href="/thanks/">Continue</a></p></body></html>
''')
    urls = [("", "1.0"), ("signup/", "0.9"), ("practice/", "0.9"), ("how-it-works/", "0.8"),
            ("about/", "0.7"), ("reviews/", "0.6"), ("contact/", "0.6")]
    sm = "\n".join(f"  <url>\n    <loc>{SITE}/{u}</loc>\n    <changefreq>monthly</changefreq>\n    <priority>{pr}</priority>\n  </url>"
                   for u, pr in urls)
    write("sitemap.xml", f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n{sm}\n</urlset>\n')


if __name__ == "__main__":
    main()
