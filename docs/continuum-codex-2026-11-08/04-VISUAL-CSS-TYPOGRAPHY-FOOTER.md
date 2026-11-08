# VNV Continuum Codex · 04 · Exact CSS, design tokens, typography, radius and footer

**Frozen 2026-11-08, after hero-spacing correction** in `vervenveda/vervenveda.github.io`.

This document preserves the **entire inline style chain** of `index.html` in source order, plus the complete global CSS and ecosystem-menu files. Later rules may intentionally override earlier rules: preserve cascade order. Do not combine every declaration into a new page without testing the cascade.

## Verve N Veda visual contract

- **Palette:** charcoal `#243038` (or near-charcoal `#28332f` for buttons), parchment `#f4f0e7`, light cream `#fff8e9`, gold `#b48b45`, near-white paper `#fffaf0`. Current source contains other legacy tokens; this contract is the intended visual target.
- **Typography:** Cinzel for titles/category eyebrows; Brandon Grotesque, Nunito or equivalent sans-serif for body/buttons. Existing gateway `--display` is an editorial serif and `--ceremonial` holds Cinzel. Weight not above 444 for normal visible text; avoid heavy bold.
- **Minimums:** ordinary body and button copy 16px or larger. Small decorative labels can be separately reviewed; the source still contains some legacy smaller sizes, so do not mark complete typography parity without an audit.
- **Radius:** 7px on cards, dialogs, buttons, panel shells and primary interactive elements.
- **Title hero:** category eyebrow, largest noun-like page title, descriptive sentence beneath; title not a sentence. Balanced center alignment. Full-width centered composition, no bulky buttons.
- **Six hero buttons:** 3 equal columns per row at desktop, matching row width up to 760px; `min-height:40px`, 16px cream text on charcoal, 7px radius, 7px horizontal gutter, **3px vertical inter-row spacing**. Parent `.hero-aside` has `row-gap:0!important` so it does not reintroduce 23–34px between rows. Preserve pseudo-divider margin and 48–60px description-to-first-row space.
- **Footer:** charcoal, centered and symmetrical; cream legible text and links, functional privacy/mission/directory/back-to-top links; do not alter their endpoints.
- **Chrome:** 333 ticker first, AutoPopulate ticker second, official header third, translator rail fourth; universal fixed toolbar at lower right; menu overlay closed by default.
- **Print and reduced motion:** preserve their styles and accessibility behaviors.
- **STOS:** public chrome is presentation only. Do not grant browser markup/scripts terminal commissioning, account-vault access, NOEMA authority, or trusted execution.

## All inline stylesheet blocks in exact page order

### Style 1 — id="vnv-gateway-bootstrap-layout" (line 36)

```html
<style id="vnv-gateway-bootstrap-layout">
    :root{--vnv-gateway-autoticker-reserve:33px;--vnv-gateway-language-reserve:54px}
    body > #vnvGatewayAutoTickerSlot{
      height:var(--vnv-gateway-autoticker-reserve);min-height:var(--vnv-gateway-autoticker-reserve);
      width:100%;background:#101b2b;box-sizing:border-box;overflow:hidden;
    }
    body > #vnv-language-rail{
      box-sizing:border-box;width:100%;min-height:var(--vnv-gateway-language-reserve);
      padding:7px 16px 8px;background:#243038;border-bottom:1px solid #b48b45;
    }
    body > .site-header{top:calc(var(--ticker-height,33px) + var(--vnv-gateway-autoticker-reserve))!important}
    @media print{#vnvGatewayAutoTickerSlot{display:none!important}}
  </style>
```

### Style 2 — main inline stylesheet (line 122)

```html
<style>
    :root{
      --paper:#f4f0e7;
      --paper-bright:#fbf9f4;
      --white:#ffffff;
      --ink:#080b0f;
      --ink-soft:#30413d;
      --forest:#243d33;
      --forest-deep:#15251f;
      --gold:#b48b45;
      --gold-pale:#e7d7b6;
      --navy:#10243b;
      --line:rgba(18,23,19,.14);
      --line-strong:rgba(18,23,19,.25);
      --shadow:0 22px 55px rgba(27,34,29,.09);
      --shadow-small:0 11px 33px rgba(27,34,29,.07);
      --max:1222px;
      --radius:7px;
      --radius-lg:7px;
      --muted:#66716c;
      --ticker-height:33px;
      --header-height:66px;
      --sticky-stack:calc(var(--ticker-height) + var(--header-height));
      --display:"Iowan Old Style","Palatino Linotype",Palatino,Baskerville,Georgia,serif;
      --ceremonial:Cinzel,Aboreto,"Iowan Old Style","Palatino Linotype",Palatino,Georgia,serif;
      --sans:"Brandon Grotesque","Avenir Next",Avenir,Montserrat,"Segoe UI",Arial,sans-serif;
    }

    *,*::before,*::after{box-sizing:border-box}
    html{
      scroll-behavior:smooth;
      scroll-padding-top:calc(var(--sticky-stack) + 18px);
    }
    body{
      margin:0;
      min-width:300px;
      overflow-x:hidden;
      color:var(--ink);
      background:var(--paper);
      font-family:var(--sans);
      font-size:18px;
      line-height:1.62;
      font-weight:400;
      text-align:center;
      -webkit-font-smoothing:antialiased;
      text-rendering:optimizeLegibility;
    }
    body.menu-open{overflow:hidden}
    a{color:inherit;text-decoration:none}
    button,input,select{font:inherit}
    button{cursor:pointer}
    img,svg,canvas,video{display:block;max-width:100%}
    p,h1,h2,h3,strong,small,span,a,button{overflow-wrap:anywhere}
    [hidden]{display:none!important}
    ::selection{background:var(--gold-pale);color:var(--ink)}
    :focus-visible{outline:3px solid var(--gold);outline-offset:3px}
    .shell{width:min(calc(100% - 48px),var(--max));margin-inline:auto}
    .visually-hidden{
      position:absolute!important;
      width:1px!important;height:1px!important;
      padding:0!important;margin:-1px!important;
      overflow:hidden!important;clip:rect(0,0,0,0)!important;
      white-space:nowrap!important;border:0!important;
    }

    .skip-link{
      position:fixed;top:9px;left:9px;z-index:4000;
      transform:translateY(-170%);
      padding:9px 14px;border-radius:var(--radius);
      color:#fff;background:var(--ink);
    }
    .skip-link:focus{transform:none}

    /* 333 NETWORK TICKER — one exact height, one exact rhythm */
    .network-ticker{
      position:sticky;top:0;z-index:1500;
      height:var(--ticker-height);
      display:grid;
      grid-template-columns:minmax(0,1fr) 40px;
      overflow:hidden;
      color:#f4ead1;
      background:linear-gradient(90deg,#07101d,#10243b 48%,#07101d);
      border-bottom:1px solid rgba(255,255,255,.13);
      box-shadow:0 4px 14px rgba(6,15,27,.15);
    }
    .network-ticker-viewport{
      min-width:0;
      overflow:hidden;
      -webkit-mask-image:linear-gradient(90deg,transparent 0,#000 27px,#000 calc(100% - 27px),transparent 100%);
      mask-image:linear-gradient(90deg,transparent 0,#000 27px,#000 calc(100% - 27px),transparent 100%);
    }
    .network-ticker-track{
      width:max-content;
      height:100%;
      display:flex;
      align-items:center;
      white-space:nowrap;
      animation:networkTickerMove 26s linear infinite;
      will-change:transform;
    }
    .network-ticker:hover .network-ticker-track,
    .network-ticker:focus-within .network-ticker-track,
    .network-ticker[data-paused="true"] .network-ticker-track{
      animation-play-state:paused;
    }
    .network-ticker-set{
      height:100%;
      display:flex;
      align-items:center;
      gap:24px;
      padding-inline:11px;
    }
    .network-ticker-label{
      flex:0 0 auto;
      color:var(--gold-pale);
      font-family:var(--ceremonial);
      font-size:11px;
      font-weight:444;
      letter-spacing:.25em;
      text-transform:uppercase;
    }
    .network-ticker-app,
    .network-ticker-call{
      min-height:24px;
      display:inline-flex;
      align-items:center;
      gap:7px;
      flex:0 0 auto;
      color:#eef3f7;
      font-size:11px;
      font-weight:444;
      letter-spacing:.1em;
      text-transform:uppercase;
      white-space:nowrap;
    }
    .network-ticker-app::before{
      content:"";
      width:3px;height:3px;
      border-radius:50%;
      background:var(--gold);
      box-shadow:0 0 0 2px rgba(180,139,69,.13);
    }
    .network-ticker-app:hover,
    .network-ticker-call:hover{
      color:#fff;
      text-decoration:underline;
      text-underline-offset:3px;
    }
    .network-ticker-call{
      padding:4px 11px;
      border:1px solid rgba(231,215,182,.3);
      border-radius:7px;
      background:rgba(255,255,255,.05);
    }
    .ticker-control{
      width:44px;height:var(--ticker-height);
      display:grid;place-items:center;
      border:0;border-left:1px solid rgba(255,255,255,.13);
      color:#f4ead1;background:rgba(0,0,0,.14);
      font-size:11px;
    }
    .ticker-control:hover{background:rgba(255,255,255,.09)}
    @keyframes networkTickerMove{
      from{transform:translateX(0)}
      to{transform:translateX(-50%)}
    }


    /* ADMIN GATE — local creative front gate; server auth remains separate */
    .admin-entry{
      position:absolute;
      left:12px;
      top:50%;
      z-index:6;
      transform:translateY(-50%);
      width:22px;
      height:22px;
      display:inline-grid;
      place-items:center;
      padding:0;
      border:1px solid #7f1717;
      border-radius:50%;
      color:transparent;
      background:radial-gradient(circle at 35% 35%,#e55b5b 0%,#c93434 45%,#951c1c 100%);
      box-shadow:0 6px 18px rgba(126,25,25,.24);
      font-size:0;
      line-height:0;
    }
    .admin-entry:hover,.admin-entry:focus-visible{
      background:linear-gradient(180deg,#dc4545,#a92323);
      box-shadow:0 9px 24px rgba(126,25,25,.3);
    }
    .site-header{position:sticky}
    .header-inner{padding-left:33px}
    .header-actions{
      justify-self:end;
      display:flex;
      align-items:center;
      gap:9px;
    }
    .header-support{
      min-height:33px;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      padding:7px 11px;
      border:1px solid rgba(36,61,51,.28);
      border-radius:7px;
      color:var(--forest-deep);
      background:rgba(255,255,255,.72);
      font-size:10px;
      font-weight:444;
      letter-spacing:.08em;
      line-height:1;
      text-transform:uppercase;
      white-space:nowrap;
      transition:background .16s ease,border-color .16s ease,transform .16s ease;
    }
    .header-support:hover,
    .header-support:focus-visible{
      background:#fff;
      border-color:var(--forest);
      transform:translateY(-1px);
    }
    @media(max-width:940px){
      .header-support{font-size:9px;padding-inline:9px}
    }
    @media(max-width:760px){
      .header-support span{display:none}
      .header-support::after{content:"Support"}
    }

    .admin-gate-overlay{
      position:fixed;
      inset:0;
      z-index:5000;
      display:grid;
      place-items:center;
      padding:14px;
      visibility:hidden;
      opacity:0;
      background:rgba(5,10,9,.72);
      -webkit-backdrop-filter:blur(8px);
      backdrop-filter:blur(8px);
      transition:opacity .18s ease,visibility .18s ease;
    }
    .admin-gate-overlay.open{visibility:visible;opacity:1}
    .admin-gate-panel{
      width:min(100%,470px);
      max-height:min(760px,calc(100svh - 40px));
      overflow:auto;
      padding:30px;
      border:1px solid rgba(145,31,31,.28);
      border-top:4px solid #a92323;
      border-radius:7px;
      color:var(--ink);
      background:var(--paper-bright);
      box-shadow:0 30px 80px rgba(0,0,0,.28);
      text-align:left;
    }
    .admin-gate-top{display:flex;align-items:flex-start;justify-content:space-between;gap:18px}
    .admin-gate-kicker{
      color:#9d2626;
      font-family:var(--ceremonial);
      font-size:11px;
      font-weight:444;
      letter-spacing:.16em;
      text-transform:uppercase;
    }
    .admin-gate-panel h2{margin-top:7px;color:var(--forest-deep);font-size:38px;line-height:1}
    .admin-gate-panel p{color:var(--ink-soft);font-size:13px;line-height:1.65}
    .admin-gate-close{
      width:36px;height:36px;flex:0 0 36px;
      border:1px solid var(--line-strong);border-radius:7px;
      color:var(--ink);background:#fff;font-size:21px;
    }
    .admin-gate-form{display:grid;gap:13px;margin-top:22px}
    .admin-gate-form label{font-size:11px;font-weight:444;letter-spacing:.08em;text-transform:uppercase}
    .admin-code-row{display:grid;grid-template-columns:minmax(0,1fr) 78px;gap:9px}
    .admin-code-input{
      width:100%;min-height:49px;padding:0 14px;
      border:1px solid var(--line-strong);border-radius:var(--radius);
      color:var(--ink);background:#fff;
      font:600 18px/1 var(--sans);letter-spacing:.16em;
    }
    .admin-code-toggle{
      border:1px solid var(--line-strong);border-radius:var(--radius);
      color:var(--ink);background:#fff;font-size:11px;font-weight:700;
    }
    .admin-gate-submit,.admin-gate-secondary{
      min-height:46px;border-radius:var(--radius);font-size:11px;font-weight:800;letter-spacing:.08em;text-transform:uppercase;
    }
    .admin-gate-submit{border:1px solid #7f1717;color:#fff;background:#a92323}
    .admin-gate-submit:hover{background:#8b1919}
    .admin-gate-secondary{border:1px solid var(--line-strong);color:var(--ink);background:#fff}
    .admin-gate-status{min-height:22px;margin:0!important;font-weight:650}
    .admin-gate-status.error{color:#9d2626}
    .admin-gate-status.ok{color:#26633d}
    .admin-unlocked-actions{display:grid;gap:10px;margin-top:16px}
    .admin-change-panel{margin-top:18px;padding-top:18px;border-top:1px solid var(--line)}
    .admin-gate-note{
      margin:20px 0 0!important;padding:12px 13px;border-left:2px solid var(--gold);
      background:#fff;color:#66716c!important;font-size:11px!important;
    }

    @media(max-width:560px){
      .admin-entry{left:6px;min-width:54px;height:34px;padding:0 8px;font-size:8px}
      .header-inner{padding-left:52px}
      .admin-gate-panel{padding:24px 18px}
      .admin-code-row{grid-template-columns:1fr}
      .admin-code-toggle{min-height:42px}
    }

    /* HEADER — 72px desktop, aligned to ticker through shared variables */
    .site-header{
      position:sticky;
      top:var(--ticker-height);
      z-index:1400;
      height:var(--header-height);
      border-bottom:1px solid var(--line);
      background:rgba(244,240,231,.96);
      -webkit-backdrop-filter:blur(18px);
      backdrop-filter:blur(18px);
    }
    .header-inner{
      height:100%;
      display:grid;
      grid-template-columns:minmax(220px,1fr) auto minmax(48px,1fr);
      align-items:center;
      column-gap:24px;
    }
    .brand{
      justify-self:start;
      min-width:0;
      max-width:360px;
      display:inline-flex;
      align-items:center;
      gap:12px;
      color:var(--ink);
      text-align:left;
    }
    .brand-mark{
      width:44px;height:36px;
      flex:0 0 44px;
      display:grid;place-items:center;
      overflow:hidden;
      border:1px solid var(--ink);
      border-radius:var(--radius);
      color:#fff;background:var(--ink);
      font-family:var(--ceremonial);
      font-size:14px;
      font-weight:444;
      line-height:1;
      letter-spacing:.07em;
      white-space:nowrap;
    }
    .brand-copy{
      min-width:0;
      display:grid;
      gap:3px;
      line-height:1.05;
    }
    .brand-name{
      display:block;
      max-width:100%;
      overflow:hidden;
      color:var(--ink);
      font-family:var(--ceremonial);
      font-size:14px;
      font-weight:444;
      letter-spacing:.09em;
      text-overflow:ellipsis;
      text-transform:uppercase;
      white-space:nowrap;
    }
    .brand-sub{
      display:block;
      max-width:100%;
      overflow:hidden;
      color:var(--ink-soft);
      font-size:7px;
      font-weight:333;
      letter-spacing:.12em;
      text-overflow:ellipsis;
      text-transform:uppercase;
      white-space:nowrap;
    }
    .header-links{
      min-width:0;
      display:flex;
      align-items:center;
      justify-content:center;
      gap:5px;
      white-space:nowrap;
    }
    .header-links a{
      min-height:40px;
      display:inline-flex;
      align-items:center;
      padding:7px 11px;
      border-radius:7px;
      color:var(--ink-soft);
      font-size:9px;
      font-weight:333;
      letter-spacing:.075em;
      text-transform:uppercase;
      white-space:nowrap;
    }
    .header-links a:hover{color:var(--ink);background:var(--white)}
    .menu-button{
      justify-self:end;
      width:44px;height:44px;
      display:grid;place-items:center;
      border:1px solid var(--line-strong);
      border-radius:7px;
      color:var(--ink);background:transparent;
    }
    .menu-lines,
    .menu-lines::before,
    .menu-lines::after{
      content:"";
      display:block;
      width:14px;height:1.5px;
      border-radius:7px;
      background:var(--ink);
      transition:.18s;
    }
    .menu-lines{position:relative}
    .menu-lines::before,.menu-lines::after{position:absolute;left:0}
    .menu-lines::before{top:-6px}
    .menu-lines::after{top:6px}
    .menu-button[aria-expanded="true"] .menu-lines{background:transparent}
    .menu-button[aria-expanded="true"] .menu-lines::before{transform:translateY(6px) rotate(45deg)}
    .menu-button[aria-expanded="true"] .menu-lines::after{transform:translateY(-6px) rotate(-45deg)}

    /* HERO — exact remaining viewport beneath ticker + header */
    .hero{
      min-height:calc(100svh - var(--sticky-stack));
      display:grid;
      align-items:stretch;
      overflow:hidden;
      border-bottom:1px solid var(--line);
      background:
        radial-gradient(circle at 50% 4%,rgba(180,139,69,.1),transparent 31rem),
        linear-gradient(180deg,var(--paper-bright),#f8f5ee);
    }
    .hero-inner{
      min-height:inherit;
      padding:clamp(58px,8vh,94px) 0 24px;
      display:grid;
      grid-template-rows:1fr auto;
      align-items:stretch;
      gap:24px;
    }
    .hero-stage{
      align-self:center;
      display:grid;
      justify-items:center;
      gap:clamp(27px,4vh,40px);
    }
    .hero-copy{max-width:1050px}
    .eyebrow,.kicker{
      margin:0;
      color:var(--gold);
      font-family:var(--ceremonial);
      font-size:clamp(14px,.88vw,14px);
      font-weight:444;
      line-height:1.5;
      letter-spacing:.19em;
      text-transform:uppercase;
    }
    h1,h2,h3{
      margin:0;
      font-family:var(--display);
      font-weight:444;
      letter-spacing:.01em;
      text-wrap:balance;
    }
    h1{
      margin-top:24px;
      max-width:1111px;
      color:var(--forest-deep);
      font-size:clamp(77px,9vw,133px);
      line-height:.99;
      letter-spacing:.014em;
    }
    .hero-aside{
      width:min(100%,760px);
      display:grid;
      justify-items:center;
      gap:24px;
    }
    .hero-aside::before{
      content:"";
      width:88px;height:1px;
      background:var(--line-strong);
    }
    .hero-lead{
      max-width:720px;
      margin:0 auto;
      color:var(--ink-soft);
      font-family:var(--display);
      font-size:clamp(18px,1.65vw,22px);
      line-height:1.58;
    }
    .hero-actions,.actions{
      display:flex;
      justify-content:center;
      flex-wrap:wrap;
      gap:14px;
      margin-top:0;
    }
    .button{
      min-height:46px;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      padding:11px 14px;
      border:1px solid transparent;
      border-radius:7px;
      font-size:11px;
      font-weight:444;
      letter-spacing:.08em;
      text-transform:uppercase;
      transition:transform .17s,background .17s,border-color .17s,box-shadow .17s;
    }
    .button:hover{transform:translateY(-2px)}
    .button-primary{color:#fff;background:var(--ink);box-shadow:var(--shadow-small)}
    .button-primary:hover{background:var(--forest)}
    .button-secondary{color:var(--ink);background:transparent;border-color:var(--line-strong)}
    .button-secondary:hover{background:var(--white);border-color:var(--ink)}
    .hero-actions .button{min-width:205px}
    .scroll-cue{
      align-self:end;
      display:inline-grid;
      justify-items:center;
      gap:7px;
      margin-inline:auto;
      color:var(--ink-soft);
      font-family:var(--ceremonial);
      font-size:9px;
      letter-spacing:.16em;
      text-transform:uppercase;
    }
    .scroll-cue::after{
      content:"";
      width:1px;height:27px;
      background:linear-gradient(var(--gold),transparent);
    }
    .scroll-cue:hover{color:var(--ink)}

    /* CONTENT */
    .section{padding:clamp(92px,9vw,124px) 20px}
    .section-alt{background:var(--paper-bright);border-block:1px solid var(--line)}
    .section-dark{color:#fff;background:var(--forest-deep)}
    .section-inner{width:min(100%,var(--max));margin:auto}
    .section-heading{max-width:900px;margin:0 auto 54px}
    .section h2{
      max-width:900px;
      margin:11px auto 0;
      color:var(--forest-deep);
      font-size:clamp(42px,4.8vw,77px);
      line-height:1.02;
    }
    .section-intro{
      max-width:720px;
      margin:24px auto 0;
      color:var(--ink-soft);
      font-size:15px;
      line-height:1.72;
    }
    .section-dark h2{color:#fff}
    .section-dark .section-intro{color:rgba(255,255,255,.72)}

    .pillar-grid{
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:18px;
      align-items:stretch;
    }
    .pillar-card{
      width:100%;
      min-height:270px;
      height:100%;
      display:flex;
      flex-direction:column;
      align-items:stretch;
      padding:0!important;
      overflow:hidden;
      border:1px solid var(--line);
      border-top:3px solid var(--accent);
      border-radius:var(--radius);
      color:var(--ink);
      background:#fff;
      box-shadow:0 10px 30px rgba(27,34,29,.055);
      transition:transform .18s ease,border-color .18s ease,box-shadow .18s ease;
      text-align:center;
    }
    .pillar-card:hover,
    .pillar-card:focus-within{
      transform:translateY(-4px);
      border-color:var(--accent);
      box-shadow:var(--shadow);
    }
    .pillar-main-link{
      min-width:0;
      flex:1 1 auto;
      display:flex;
      flex-direction:column;
      align-items:center;
      padding:clamp(23px,2.7vw,30px) clamp(20px,2.4vw,26px) 20px;
      color:inherit;
      background:#fff;
      text-decoration:none;
    }
    .pillar-main-link:hover,
    .pillar-main-link:focus-visible{
      background:linear-gradient(180deg,#fff,rgba(180,139,69,.045));
    }
    .pillar-number{
      color:var(--accent);
      font-family:var(--ceremonial);
      font-size:10px;
      font-weight:500;
      letter-spacing:.18em;
    }
    .pillar-copy{
      width:100%;
    }
    .pillar-card h3{
      margin-top:26px;
      font-size:clamp(24px,2.1vw,34px);
      line-height:1.08;
    }
    .pillar-card p{
      color:var(--ink-soft);
      font-size:13px;
      line-height:1.65;
    }
    .pillar-primary{
      width:100%;
      margin-top:auto;
      padding-top:18px;
      border-top:1px solid var(--line);
      color:var(--accent);
      font-size:clamp(9px,.7vw,11px);
      font-weight:600;
      letter-spacing:.07em;
      text-transform:uppercase;
      white-space:nowrap;
    }
    .pillar-browse{
      width:100%;
      min-height:46px;
      display:flex;
      align-items:center;
      justify-content:center;
      padding:10px 12px;
      border:0;
      border-top:1px solid var(--line);
      color:var(--ink-soft);
      background:#f8f5ee;
      font-size:clamp(9px,.68vw,11px);
      font-weight:600;
      letter-spacing:.055em;
      line-height:1.15;
      text-transform:uppercase;
      white-space:nowrap;
      transition:background .16s ease,color .16s ease;
    }
    .pillar-browse:hover,
    .pillar-browse:focus-visible{
      color:#fff;
      background:var(--accent);
    }

    /* NAIB — intelligence and navigation layer */
    .intelligence-section{
      color:#fff;
      background:
        radial-gradient(circle at 18% 12%,rgba(180,139,69,.18),transparent 28rem),
        radial-gradient(circle at 86% 76%,rgba(255,255,255,.07),transparent 30rem),
        linear-gradient(135deg,#0b1828,var(--navy) 52%,#15251f);
      border-block:1px solid rgba(255,255,255,.1);
    }
    .intelligence-bridge{
      max-width:1120px;
      margin:auto;
      display:grid;
      grid-template-columns:minmax(0,1.08fr) minmax(340px,.92fr);
      gap:48px;
      align-items:center;
      text-align:left;
    }
    .intelligence-copy .kicker{color:var(--gold-pale)}
    .intelligence-copy h2{
      margin-top:12px;
      color:#fff;
      font-size:clamp(42px,5.5vw,76px);
      line-height:.98;
    }
    .intelligence-copy p{
      margin:20px 0 0;
      color:rgba(255,255,255,.76);
      font-size:15px;
      line-height:1.78;
    }
    .intelligence-copy strong{color:#fff;font-weight:600}
    .intelligence-actions{
      display:flex;
      flex-wrap:wrap;
      gap:11px;
      margin-top:28px;
    }
    .intelligence-actions .button-primary{
      color:var(--navy);
      background:var(--gold-pale);
      box-shadow:none;
    }
    .intelligence-actions .button-primary:hover{background:#fff}
    .intelligence-actions .button-secondary{
      color:#fff;
      border-color:rgba(255,255,255,.28);
    }
    .intelligence-actions .button-secondary:hover{
      color:var(--navy);
      background:#fff;
      border-color:#fff;
    }
    .intelligence-map{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:12px;
    }
    .intelligence-node{
      min-height:132px;
      display:flex;
      flex-direction:column;
      justify-content:center;
      padding:20px;
      border:1px solid rgba(255,255,255,.14);
      border-radius:var(--radius);
      background:rgba(255,255,255,.055);
      box-shadow:inset 0 1px 0 rgba(255,255,255,.05);
    }
    .intelligence-node span{
      color:var(--gold-pale);
      font-family:var(--ceremonial);
      font-size:9px;
      font-weight:500;
      letter-spacing:.16em;
      text-transform:uppercase;
    }
    .intelligence-node strong{
      margin-top:8px;
      color:#fff;
      font-family:var(--display);
      font-size:22px;
      font-weight:500;
      line-height:1.08;
    }
    .intelligence-node small{
      margin-top:7px;
      color:rgba(255,255,255,.62);
      font-size:11px;
      line-height:1.5;
    }
    .intelligence-node-link{
      position:relative;
      color:inherit;
      text-decoration:none;
      cursor:pointer;
      overflow:hidden;
      transition:
        transform .17s ease,
        border-color .17s ease,
        background .17s ease,
        box-shadow .17s ease;
    }
    .intelligence-node-link::after{
      content:"";
      position:absolute;
      inset:7px;
      pointer-events:none;
      border:1px solid rgba(231,215,182,0);
      border-radius:4px;
      transition:border-color .17s ease;
    }
    .intelligence-node-link:hover,
    .intelligence-node-link:focus-visible{
      transform:translateY(-3px);
      border-color:rgba(231,215,182,.38);
      background:rgba(255,255,255,.085);
      box-shadow:0 14px 30px rgba(0,0,0,.15);
    }
    .intelligence-node-link:hover::after,
    .intelligence-node-link:focus-visible::after{
      border-color:rgba(231,215,182,.16);
    }
    .intelligence-node-link:active{
      transform:translateY(-1px) scale(.995);
    }
    .intelligence-node-link strong{
      transition:color .17s ease,transform .17s ease;
    }
    .intelligence-node-link:hover strong,
    .intelligence-node-link:focus-visible strong{
      color:#f4ead1;
      transform:translateY(-1px);
    }
    .intelligence-path{
      position:relative;
      z-index:1;
      display:block;
      margin-top:12px;
      color:var(--gold-pale);
      font-family:var(--sans);
      font-size:clamp(9px,.68vw,11px);
      font-weight:600;
      letter-spacing:.07em;
      line-height:1.25;
      text-transform:uppercase;
    }
    .intelligence-note{
      grid-column:1 / -1;
      margin:2px 0 0;
      padding:13px 15px;
      border-left:2px solid var(--gold);
      color:rgba(255,255,255,.62);
      background:rgba(0,0,0,.12);
      font-size:11px;
      line-height:1.6;
    }

    .featured-grid{
      display:grid;
      grid-template-columns:repeat(4,minmax(0,1fr));
      gap:18px;
      align-items:stretch;
    }
    .feature-card{
      min-height:305px;
      height:100%;
      display:flex;
      flex-direction:column;
      align-items:center;
      padding:28px 24px;
      border:1px solid var(--line);
      border-radius:var(--radius);
      background:#fff;
      box-shadow:0 10px 30px rgba(27,34,29,.055);
      transition:.18s;
    }
    .feature-card:hover{transform:translateY(-3px);box-shadow:var(--shadow)}
    .feature-card-doorway{
      cursor:pointer;
      outline:none;
    }
    .feature-card-doorway:hover,
    .feature-card-doorway:focus-visible{
      transform:translateY(-4px);
      border-color:var(--gold);
      box-shadow:var(--shadow);
    }
    .feature-card-doorway:focus-visible{
      outline:3px solid var(--gold);
      outline-offset:4px;
    }
    .feature-card-doorway:active{
      transform:translateY(-2px) scale(.995);
    }
    .feature-card-doorway .feature-icon,
    .feature-card-doorway h3,
    .feature-card-doorway .feature-card-cta{
      transition:transform .17s ease,color .17s ease,background .17s ease,border-color .17s ease;
    }
    .feature-card-doorway:hover .feature-icon,
    .feature-card-doorway:focus-visible .feature-icon{
      transform:translateY(-2px) scale(1.035);
    }
    .feature-card-doorway:hover h3,
    .feature-card-doorway:focus-visible h3{
      color:var(--forest);
    }
    .feature-card-cta{
      pointer-events:none;
      user-select:none;
    }
    .feature-icon{
      width:55px;height:44px;
      display:grid;place-items:center;
      border-radius:var(--radius);
      color:#fff;background:var(--forest);
      font-family:var(--ceremonial);
      font-size:12px;
      font-weight:500;
    }
    .feature-card h3{
      margin-top:18px;
      font-size:25px;
      line-height:1.08;
    }
    .feature-card p{
      color:var(--ink-soft);
      font-size:13px;
      line-height:1.65;
    }
    .feature-card .button{width:100%;margin-top:auto}

    /* SUPPORT / CONTRIBUTIONS */
    .support-bridge{
      display:grid;
      grid-template-columns:minmax(0,1.25fr) minmax(280px,.75fr);
      gap:32px;
      align-items:center;
      padding:36px;
      border:1px solid var(--line);
      border-radius:var(--radius-lg);
      background:linear-gradient(135deg,rgba(255,255,255,.95),rgba(248,244,233,.92));
      box-shadow:var(--shadow);
    }
    .support-copy{text-align:left}
    .support-copy h2{margin:.25rem 0 .7rem;color:var(--forest-deep)}
    .support-copy p{margin:.45rem 0;color:var(--ink-soft)}
    .support-points{display:flex;flex-wrap:wrap;gap:8px;margin-top:16px}
    .support-points span{
      display:inline-flex;align-items:center;min-height:30px;padding:6px 9px;
      border:1px solid var(--line);border-radius:999px;background:#fff;color:var(--ink-soft);
      font-size:11px;font-weight:650;
    }
    .support-payment{
      display:grid;place-items:center;min-height:190px;padding:22px;
      border:1px solid rgba(35,79,54,.14);border-radius:var(--radius);
      background:#fff;text-align:center;
    }
    .support-payment small{display:block;margin-top:12px;color:var(--muted);line-height:1.5}

    .campaign-bridge{
      max-width:1080px;
      margin:auto;
      display:grid;
      grid-template-columns:minmax(0,1.15fr) minmax(290px,.85fr);
      gap:42px;
      align-items:center;
      padding:42px;
      border:1px solid var(--line);
      border-top:3px solid #8e2424;
      border-radius:var(--radius);
      background:#fff;
      box-shadow:0 12px 34px rgba(27,34,29,.06);
    }
    .campaign-copy{text-align:left}
    .campaign-copy h2{
      margin:9px 0 0;
      font-size:clamp(38px,4vw,61px);
      line-height:1.02;
    }
    .campaign-copy p{
      margin:20px 0 0;
      color:var(--ink-soft);
      font-size:15px;
      line-height:1.7;
    }
    .campaign-actions{display:grid;gap:12px}

    .network-counts{
      max-width:1080px;
      margin:54px auto 0;
      display:grid;
      grid-template-columns:repeat(3,1fr);
      gap:14px;
    }
    .network-count{
      min-height:112px;
      display:grid;
      place-items:center;
      padding:20px;
      border:1px solid var(--line);
      border-radius:var(--radius);
      color:inherit;
      background:rgba(255,255,255,.62);
      text-decoration:none;
    }
    .network-count strong{
      display:block;
      color:var(--forest-deep);
      font-family:var(--display);
      font-size:30px;
      font-weight:500;
    }
    .network-count span{
      display:block;
      margin-top:4px;
      color:var(--ink-soft);
      font-size:10px;
      letter-spacing:.12em;
      text-transform:uppercase;
    }
    .network-count small{
      display:block;
      margin-top:10px;
      color:#876d3d;
      font-size:clamp(9px,.65vw,10.5px);
      font-weight:600;
      letter-spacing:.045em;
      line-height:1.3;
      text-transform:uppercase;
    }
    .network-count-action{
      width:100%;
      appearance:none;
      -webkit-appearance:none;
      cursor:pointer;
      font:inherit;
      transition:
        transform .17s ease,
        border-color .17s ease,
        box-shadow .17s ease,
        background .17s ease;
    }
    .network-count-action:hover,
    .network-count-action:focus-visible{
      transform:translateY(-3px);
      border-color:rgba(180,139,69,.62);
      background:linear-gradient(180deg,#fff,#fbf7ee);
      box-shadow:0 14px 30px rgba(27,34,29,.09);
    }
    .network-count-action:active{
      transform:translateY(-1px) scale(.995);
    }

    .directory-controls{
      max-width:980px;
      margin:0 auto 28px;
      display:grid;
      grid-template-columns:minmax(250px,1fr) 230px auto auto;
      gap:12px;
    }
    .field{
      width:100%;
      min-height:46px;
      padding:0 13px;
      border:1px solid var(--line-strong);
      border-radius:var(--radius);
      color:var(--ink);
      background:#fff;
    }
    .control-button{
      min-height:46px;
      padding:0 14px;
      border:1px solid var(--line-strong);
      border-radius:var(--radius);
      color:var(--ink);
      background:#fff;
      font-size:12px;
      font-weight:600;
      white-space:nowrap;
    }
    .control-button:hover{border-color:var(--ink);background:var(--gold-pale)}
    .directory-status{margin:0 0 28px;color:var(--ink-soft);font-size:12px}
    .directory-grid{
      display:flex;
      flex-wrap:wrap;
      justify-content:center;
      align-items:stretch;
      gap:18px;
    }
    .site-card{
      flex:1 1 260px;
      max-width:302px;
      min-width:230px;
      min-height:252px;
      display:flex;
      flex-direction:column;
      align-items:center;
      padding:25px 22px;
      border:1px solid var(--line);
      border-radius:var(--radius);
      background:#fff;
      box-shadow:0 10px 30px rgba(27,34,29,.055);
      transition:.18s;
    }
    .site-card:hover{
      transform:translateY(-3px);
      border-color:var(--gold);
      box-shadow:var(--shadow);
    }
    .site-icon{
      width:48px;height:40px;
      display:grid;place-items:center;
      border-radius:var(--radius);
      color:#fff;background:var(--forest);
      font-family:var(--ceremonial);
      font-size:11px;
      font-weight:500;
    }
    .site-group{
      margin-top:16px;
      color:var(--gold);
      font-size:10px;
      font-weight:600;
      letter-spacing:.1em;
      text-transform:uppercase;
    }
    .site-card h3{margin-top:8px;font-size:22px;line-height:1.08}
    .site-card p{color:var(--ink-soft);font-size:13px;line-height:1.62}
    .site-card small{margin-top:auto;color:var(--forest);font-size:11px;font-weight:600}

    .network-statement{
      max-width:1056px;
      margin:auto;
      display:grid;
      grid-template-columns:1fr 1fr;
      gap:48px;
      align-items:center;
    }
    .statement-copy{text-align:center}
    .statement-copy p{color:rgba(255,255,255,.72);line-height:1.75}
    .statement-values{
      display:grid;
      grid-template-columns:repeat(2,1fr);
      gap:16px;
    }
    .value{
      min-height:145px;
      display:grid;
      place-items:center;
      padding:18px;
      border:1px solid rgba(255,255,255,.14);
      border-radius:var(--radius);
      background:rgba(255,255,255,.04);
    }
    .value strong{font-family:var(--display);font-size:21px;font-weight:500}

    .final{background:var(--gold-pale)}
    .final p{max-width:700px;margin:22px auto 0;color:var(--ink-soft);line-height:1.75}
    .final .actions{margin-top:30px}

    .privacy-note{
      max-width:960px;
      margin:auto;
      padding:28px;
      border:1px solid var(--line);
      border-radius:var(--radius);
      background:#fff;
      color:var(--ink-soft);
      font-size:13px;
      line-height:1.72;
    }
    .privacy-note strong{
      display:block;
      margin-bottom:8px;
      color:var(--forest-deep);
      font-family:var(--display);
      font-size:25px;
      font-weight:500;
    }

    footer{
      padding:52px 20px;
      color:rgba(255,255,255,.68);
      background:#0a1511;
      font-size:12px;
    }
    .footer-inner{
      display:grid;
      grid-template-columns:1fr auto 1fr;
      align-items:center;
      gap:22px;
    }
    .footer-credit{justify-self:start;text-align:left}
    .footer-links{display:flex;justify-content:center;gap:15px;flex-wrap:wrap}
    .footer-meta{justify-self:end;display:flex;gap:15px;flex-wrap:wrap}
    footer a:hover{color:#fff;text-decoration:underline;text-underline-offset:3px}

    /* DRAWER */
    .menu-overlay{
      position:fixed;inset:0;z-index:3000;
      visibility:hidden;opacity:0;
      background:rgba(6,15,12,.72);
      transition:.2s;
    }
    .menu-overlay.open{visibility:visible;opacity:1}
    .drawer{
      position:absolute;right:0;top:0;
      width:min(94vw,500px);height:100%;
      overflow:auto;
      padding:22px;
      text-align:left;
      background:var(--paper-bright);
      transform:translateX(100%);
      transition:.22s;
    }
    .menu-overlay.open .drawer{transform:none}
    .drawer-top{display:flex;align-items:center;justify-content:space-between;gap:11px}
    .drawer h2{font-size:34px}
    .drawer p{color:var(--ink-soft);font-size:13px}
    .close-button{
      width:44px;height:44px;
      border:1px solid var(--line-strong);
      border-radius:var(--radius);
      background:#fff;
      font-size:24px;
    }
    .drawer-search{
      width:100%;min-height:46px;
      margin-top:18px;padding:0 13px;
      border:1px solid var(--line-strong);
      border-radius:var(--radius);
      background:#fff;
    }
    .menu-group{
      margin:22px 0 8px;
      color:var(--gold);
      font-size:10px;
      font-weight:600;
      letter-spacing:.1em;
      text-transform:uppercase;
    }
    .menu-list{display:grid;gap:7px}
    .menu-link{
      min-width:0;
      display:grid;
      grid-template-columns:auto minmax(0,1fr) auto;
      align-items:center;
      gap:11px;
      padding:11px;
      border:1px solid var(--line);
      border-radius:var(--radius);
      background:#fff;
    }
    .menu-link:hover{border-color:var(--gold)}
    .menu-link i{
      width:38px;height:33px;
      display:grid;place-items:center;
      border-radius:var(--radius);
      color:#fff;background:var(--forest);
      font-style:normal;
      font-size:10px;
    }
    .menu-link strong{display:block;font-size:13px;font-weight:600}
    .menu-link small{display:block;color:var(--ink-soft);font-size:10px;line-height:1.45}

    /* BRANCHED ECOSYSTEM MENU — compact first screen, canonical directory underneath */
    .menu-branch-home{
      display:grid;
      grid-template-columns:repeat(2,minmax(0,1fr));
      gap:9px;
      margin-top:20px;
    }
    .menu-branch-button{
      min-width:0;
      min-height:88px;
      display:grid;
      grid-template-columns:minmax(0,1fr) auto;
      align-items:center;
      gap:12px;
      padding:14px;
      border:1px solid var(--line);
      border-radius:7px;
      color:var(--ink);
      background:#fff;
      text-align:left;
    }
    .menu-branch-button:hover,
    .menu-branch-button:focus-visible{
      border-color:var(--gold);
      background:var(--paper);
    }
    .menu-branch-button strong{
      display:block;
      font-family:var(--ceremonial);
      font-size:14px;
      font-weight:444;
      line-height:1.25;
      letter-spacing:.025em;
    }
    .menu-branch-button small{
      display:block;
      margin-top:5px;
      color:var(--ink-soft);
      font-size:10px;
      line-height:1.45;
    }
    .menu-branch-arrow{
      color:var(--gold);
      font-size:18px;
      line-height:1;
    }
    .menu-branch-toolbar{
      display:flex;
      align-items:center;
      justify-content:space-between;
      gap:10px;
      margin:18px 0 8px;
      padding-bottom:10px;
      border-bottom:1px solid var(--line);
    }
    .menu-branch-back{
      min-height:34px;
      padding:7px 11px;
      border:1px solid var(--line-strong);
      border-radius:7px;
      color:var(--ink);
      background:#fff;
      font-size:10px;
      font-weight:444;
      letter-spacing:.04em;
    }
    .menu-branch-title{
      min-width:0;
      color:var(--forest-deep);
      font-family:var(--ceremonial);
      font-size:14px;
      font-weight:444;
      letter-spacing:.04em;
      text-align:right;
    }
    .menu-subgroup{
      margin-top:16px;
    }
    .menu-subgroup:first-of-type{margin-top:8px}
    .menu-subgroup-title{
      margin:0 0 7px;
      color:var(--gold);
      font-size:10px;
      font-weight:444;
      letter-spacing:.1em;
      text-transform:uppercase;
    }
    @media(max-width:560px){
      .menu-branch-home{grid-template-columns:1fr}
      .menu-branch-button{min-height:72px}
    }

    @media(max-width:1140px){
      .header-inner{grid-template-columns:minmax(0,1fr) auto}
      .header-links{display:none}
      .brand{max-width:min(360px,calc(100vw - 120px))}
      .pillar-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      .featured-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      .support-bridge,.campaign-bridge{grid-template-columns:1fr}
      .support-copy,.campaign-copy{text-align:center}
      .intelligence-bridge{grid-template-columns:1fr;text-align:center}
      .intelligence-actions{justify-content:center}
      .network-statement{grid-template-columns:1fr}
    }
    @media(max-width:760px){
      .shell{width:min(calc(100% - 26px),var(--max))}
      .hero-inner{padding:54px 0 20px;gap:22px}
      .hero-stage{gap:26px}
      h1{font-size:clamp(58px,16vw,88px);line-height:.91}
      .hero-lead{font-size:17px;line-height:1.65}
      .hero-actions{
        width:min(100%,340px);
        display:grid;
        grid-template-columns:1fr;
      }
      .hero-actions .button{width:100%;min-width:0}
      .section{padding:78px 14px}
      .section-heading{margin-bottom:40px}
      .directory-controls{grid-template-columns:1fr}
      .network-counts{grid-template-columns:1fr}
      .statement-values{grid-template-columns:1fr}
      .footer-inner{grid-template-columns:1fr;justify-items:center}
      .footer-credit,.footer-meta{justify-self:center;text-align:center}
      .footer-meta{justify-content:center}
    }
    @media(max-width:560px){
      :root{
        --ticker-height:32px;
        --header-height:64px;
      }
      .network-ticker{grid-template-columns:minmax(0,1fr) 36px}
      .network-ticker-track{animation-duration:24s}
      .network-ticker-set{gap:18px;padding-inline:9px}
      .network-ticker-label{font-size:9px}
      .network-ticker-app,.network-ticker-call{font-size:10px}
      .ticker-control{width:36px}
      .header-inner{column-gap:14px}
      .brand{gap:9px;max-width:calc(100vw - 92px)}
      .brand-mark{width:40px;height:32px;flex-basis:40px;font-size:9px}
      .brand-name{font-size:14px}
      .brand-sub{display:none}
      .menu-button{width:40px;height:40px}
      .hero-inner{padding-top:46px}
      .eyebrow{font-size:10px;letter-spacing:.16em}
      h1{font-size:clamp(52px,17vw,76px)}
      .pillar-grid,.featured-grid{grid-template-columns:1fr}
      .feature-card{padding:26px 22px}
      .pillar-main-link{padding:24px 20px 18px}
      .intelligence-map{grid-template-columns:1fr}
      .intelligence-note{grid-column:auto}
      .intelligence-actions{display:grid;width:100%}
      .site-card{max-width:100%;min-width:100%}
      .support-bridge,.campaign-bridge{padding:28px 20px}
      .button{width:100%}
    }
    @media(prefers-reduced-motion:reduce){
      *,*::before,*::after{
        scroll-behavior:auto!important;
        transition:none!important;
        animation:none!important;
      }
      .network-ticker-track{transform:none!important}
      .scroll-cue::after{height:20px}
    }


    /* =========================================================
       2026-08-10 REFINEMENT PASS
       - V badge is the administrator gate
       - collision-proof header
       - section eyebrow is the section title
       - supporting statement is intentionally smaller
       - equal dark information boxes
       - NAIB sits at the end of the public journey
       - centered, organized footer
       ========================================================= */

    /* Header: three deliberate zones with no absolute admin control. */
    .site-header{overflow:visible}
    .header-inner{
      padding-left:0!important;
      grid-template-columns:minmax(190px,235px) minmax(0,1fr) 44px;
      column-gap:16px;
    }
    .brand{
      width:100%;
      max-width:none;
      display:flex;
      align-items:center;
      gap:10px;
      justify-self:start;
    }
    .brand-home{
      min-width:0;
      display:flex;
      align-items:center;
      color:inherit;
    }
    .admin-brand-button{
      appearance:none;
      -webkit-appearance:none;
      padding:0;
      cursor:pointer;
      border:1px solid var(--ink);
      transition:background .17s ease,color .17s ease,transform .17s ease,box-shadow .17s ease;
    }
    .admin-brand-button:hover,
    .admin-brand-button:focus-visible{
      color:#fff;
      background:var(--forest);
      transform:translateY(-1px);
      box-shadow:0 7px 18px rgba(21,37,31,.16);
    }
    .header-links{
      width:100%;
      min-width:0;
      justify-content:center;
      gap:2px;
    }
    .header-links a{
      padding:7px 7px;
      font-size:9px;
      letter-spacing:.065em;
    }

    

    /* Down-page hierarchy: eyebrow = title; next line = supporting statement. */
    .section .kicker{
      display:block;
      margin:0 auto 10px;
      color:var(--gold);
      font-family:var(--ceremonial);
      font-size:clamp(20px,1.8vw,27px);
      font-weight:500;
      line-height:1.18;
      letter-spacing:.11em;
      text-transform:uppercase;
      text-wrap:balance;
    }
    .section .section-heading h2,
    .support-copy h2,
    .campaign-copy h2,
    .statement-copy h2,
    .final h2,
    .intelligence-copy h2{
      max-width:760px;
      margin:8px auto 0;
      font-family:var(--display);
      font-size:clamp(20px,2.15vw,31px)!important;
      font-weight:500;
      line-height:1.25!important;
      letter-spacing:.01em;
      text-wrap:balance;
    }
    .section-heading{
      max-width:840px;
      margin:0 auto 48px;
    }
    .section-intro{
      max-width:680px;
      margin:16px auto 0;
      font-size:13px;
      line-height:1.68;
    }

    /* Keep secondary sections centered after the hierarchy reversal. */
    .support-copy,
    .campaign-copy,
    .statement-copy,
    .intelligence-copy{
      text-align:center;
    }
    .support-copy h2,
    .campaign-copy h2,
    .statement-copy h2,
    .final h2,
    .intelligence-copy h2{
      color:var(--forest-deep);
    }
    .section-dark .kicker,
    .intelligence-section .kicker{color:var(--gold-pale)}
    .section-dark .statement-copy h2,
    .intelligence-copy h2{color:#fff}
    .support-copy p,
    .campaign-copy p,
    .statement-copy p,
    .intelligence-copy p{
      max-width:720px;
      margin:16px auto 0;
      font-size:13px;
      line-height:1.72;
    }
    .support-points,
    .intelligence-actions{
      justify-content:center;
    }

    /* The four NAIB role boxes are one balanced, centered module. */
    .intelligence-bridge{
      max-width:1040px;
      grid-template-columns:1fr;
      gap:38px;
      text-align:center;
    }
    .intelligence-copy{max-width:820px;margin-inline:auto}
    .intelligence-map{
      width:min(100%,650px);
      margin-inline:auto;
      grid-template-columns:repeat(2,minmax(0,1fr));
      grid-auto-rows:1fr;
      gap:14px;
    }
    .intelligence-node{
      min-height:156px;
      height:100%;
      align-items:center;
      text-align:center;
    }
    .intelligence-node small{max-width:220px}
    .intelligence-note{
      width:100%;
      min-height:72px;
      display:grid;
      place-items:center;
      padding:14px 18px;
      border-left:0;
      border-top:2px solid var(--gold);
      text-align:center;
    }

    /* Symmetry for the dark mission value boxes as well. */
    .network-statement{
      max-width:980px;
      grid-template-columns:1fr;
      gap:34px;
      text-align:center;
    }
    .statement-copy{max-width:780px;margin-inline:auto}
    .statement-values{
      width:min(100%,650px);
      margin-inline:auto;
      grid-template-columns:repeat(2,minmax(0,1fr));
      grid-auto-rows:1fr;
      gap:14px;
    }
    .value{
      min-height:132px;
      height:100%;
      text-align:center;
    }
    .value-link{
      position:relative;
      display:grid;
      place-items:center;
      align-content:center;
      gap:11px;
      color:#fff;
      text-decoration:none;
      cursor:pointer;
      transition:
        transform .17s ease,
        border-color .17s ease,
        background .17s ease,
        box-shadow .17s ease;
    }
    .value-link::after{
      content:"";
      position:absolute;
      inset:7px;
      pointer-events:none;
      border:1px solid rgba(231,215,182,0);
      border-radius:4px;
      transition:border-color .17s ease;
    }
    .value-link strong{
      position:relative;
      z-index:1;
    }
    .value-link small{
      position:relative;
      z-index:1;
      display:block;
      color:rgba(244,240,231,.68);
      font-size:clamp(9px,.68vw,11px);
      font-weight:500;
      letter-spacing:.065em;
      line-height:1.25;
      text-transform:uppercase;
    }
    .value-link:hover,
    .value-link:focus-visible{
      transform:translateY(-3px);
      border-color:rgba(231,215,182,.42);
      background:rgba(255,255,255,.075);
      box-shadow:0 14px 30px rgba(0,0,0,.14);
    }
    .value-link:hover::after,
    .value-link:focus-visible::after{
      border-color:rgba(231,215,182,.18);
    }
    .value-link:hover small,
    .value-link:focus-visible small{
      color:#f4ead1;
    }
    .value-link:active{
      transform:translateY(-1px) scale(.995);
    }

    /* Final welcome: title first, restrained statement second. */
    .final .section-inner{max-width:900px}
    .final p:not(.kicker){
      max-width:650px;
      margin:16px auto 0;
      font-size:13px;
    }

    /* Refined footer: one centered hierarchy, no competing columns. */
    footer{padding:42px 20px 46px}
    .footer-inner{
      max-width:1040px;
      display:flex;
      flex-direction:column;
      align-items:center;
      justify-content:center;
      gap:18px;
      text-align:center;
    }
    .footer-credit{
      justify-self:auto;
      text-align:center;
      color:#fff;
      font-family:var(--display);
      font-size:15px;
      line-height:1.4;
    }
    .footer-links{
      width:100%;
      justify-content:center;
      gap:8px 16px;
      padding:16px 0;
      border-block:1px solid rgba(255,255,255,.11);
    }
    .footer-links a,
    .footer-meta a{
      white-space:nowrap;
    }
    .footer-meta{
      justify-self:auto;
      display:flex;
      align-items:center;
      justify-content:center;
      gap:8px 14px;
      flex-wrap:wrap;
      color:rgba(255,255,255,.58);
    }
    .footer-meta span{
      color:var(--gold-pale);
      font-family:var(--ceremonial);
      font-size:9px;
      letter-spacing:.13em;
      text-transform:uppercase;
    }

    @media(max-width:1230px){
      .header-inner{grid-template-columns:minmax(0,1fr) 44px}
      .header-links{display:none}
      .brand{max-width:min(360px,calc(100vw - 110px))}
    }
    @media(max-width:760px){
      .section .kicker{font-size:clamp(18px,5vw,22px);letter-spacing:.095em}
      .section .section-heading h2,
      .support-copy h2,
      .campaign-copy h2,
      .statement-copy h2,
      .final h2,
      .intelligence-copy h2{font-size:clamp(18px,5.6vw,25px)!important}
      .intelligence-map,.statement-values{grid-template-columns:1fr}
      .intelligence-node,.value{min-height:122px}
    }
    @media(max-width:560px){
      .brand{gap:8px;max-width:calc(100vw - 84px)}
      .brand-mark{width:40px;height:34px;flex-basis:40px;font-size:15px}
      .footer-links{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}
      .footer-links a{white-space:normal}
    }


    .directory-intelligence-doorway{
      width:min(100%,1120px);margin:20px auto 28px;padding:18px 20px;
      display:grid;grid-template-columns:minmax(0,1fr) auto;gap:18px;align-items:center;
      border:1px solid rgba(23,26,25,.18);border-left:4px solid #9c7b42;border-radius:7px;
      background:rgba(255,255,255,.72);box-shadow:0 8px 22px rgba(16,20,18,.05);
    }
    .directory-intelligence-doorway h3{margin:4px 0 6px;font:500 22px/1.15 var(--serif);color:var(--ink)}
    .directory-intelligence-doorway p{margin:0;color:var(--ink-soft);font-size:12px;line-height:1.6;max-width:75ch}
    .directory-intelligence-actions{display:flex;gap:8px;flex-wrap:wrap;justify-content:flex-end}
    .directory-intelligence-actions a{display:inline-flex;align-items:center;min-height:40px;padding:8px 12px;border:1px solid var(--line);border-radius:7px;background:#fff;color:var(--ink);font-size:10px;font-weight:700;letter-spacing:.06em;text-transform:uppercase}
    .directory-intelligence-actions a:first-child{background:#2b302f;color:#f4f0e7;border-color:#2b302f}
    @media(max-width:760px){.directory-intelligence-doorway{grid-template-columns:1fr}.directory-intelligence-actions{justify-content:flex-start}}

    /* ECOSYSTEM DIRECTORY — elegant dropdown categories */
    .ecosystem-directory-section{
      background:linear-gradient(180deg,#f2eee5,#f7f4ed);
      border-block:1px solid var(--line);
    }
    .ecosystem-category-grid{
      width:min(100%,1120px);
      margin:0 auto;
      display:grid;
      grid-template-columns:repeat(5,minmax(0,1fr));
      gap:12px;
      align-items:stretch;
    }
    .ecosystem-category-doorway{
      position:relative;
      min-height:70px;
      width:100%;
      display:grid;
      grid-template-columns:minmax(0,1fr) 46px;
      overflow:hidden;
      border:1px solid #171a19;
      border-radius:4px;
      color:#f4f0e7;
      background:linear-gradient(180deg,#343837,#272b2a);
      box-shadow:
        inset 0 0 0 1px rgba(255,255,255,.11),
        inset 0 -1px 0 rgba(0,0,0,.45),
        0 8px 18px rgba(16,20,18,.08);
      transition:transform .16s ease,background .16s ease,border-color .16s ease,box-shadow .16s ease,color .16s ease;
    }
    .ecosystem-category-doorway:hover,
    .ecosystem-category-doorway:focus-within,
    .ecosystem-category-doorway[data-expanded="true"]{
      color:#fff;
      background:linear-gradient(180deg,#3d4240,#2b302e);
      border-color:#0f1110;
      box-shadow:
        inset 0 0 0 1px rgba(231,215,182,.24),
        inset 0 -1px 0 rgba(0,0,0,.55),
        0 11px 24px rgba(16,20,18,.12);
      transform:translateY(-1px);
    }
    .ecosystem-category-link{
      min-width:0;
      min-height:68px;
      display:flex;
      align-items:center;
      justify-content:center;
      gap:8px;
      padding:15px 12px 15px 18px;
      color:inherit;
      font-family:var(--ceremonial);
      font-size:7px;
      font-weight:333;
      letter-spacing:.11em;
      line-height:1.3;
      text-align:center;
    }
    .ecosystem-category-link::after{
      content:"↗";
      flex:0 0 auto;
      color:#d7c6a4;
      font-family:var(--sans);
      font-size:11px;
      line-height:1;
      opacity:.72;
      transform:translateY(-1px);
      transition:transform .16s ease,opacity .16s ease,color .16s ease;
    }
    .ecosystem-category-link:hover::after,
    .ecosystem-category-link:focus-visible::after{
      color:#fff;
      opacity:1;
      transform:translate(2px,-3px);
    }
    .ecosystem-category-toggle{
      min-width:46px;
      min-height:68px;
      display:grid;
      place-items:center;
      padding:0;
      border:0;
      border-left:1px solid rgba(231,215,182,.18);
      color:#d7c6a4;
      background:rgba(0,0,0,.08);
      font-family:var(--sans);
      font-size:15px;
      line-height:1;
      transition:background .16s ease,color .16s ease;
    }
    .ecosystem-category-toggle:hover,
    .ecosystem-category-toggle:focus-visible{
      color:#fff;
      background:rgba(255,255,255,.08);
    }
    .ecosystem-category-toggle span{
      display:block;
      transition:transform .16s ease;
    }
    .ecosystem-category-toggle[aria-expanded="true"] span{
      transform:rotate(180deg);
    }
    .ecosystem-dropdown-stage{
      width:min(100%,1120px);
      margin:0 auto;
    }
    .ecosystem-directory-panel{
      margin-top:16px;
      padding:30px;
      border:1px solid rgba(30,36,33,.16);
      border-radius:7px;
      background:rgba(251,249,244,.99);
      box-shadow:0 18px 45px rgba(27,34,29,.08);
      text-align:left;
    }
    .ecosystem-directory-panel[hidden]{display:none!important}
    .ecosystem-panel-head{
      display:grid;
      grid-template-columns:minmax(0,1fr) auto;
      align-items:start;
      gap:24px;
      padding-bottom:20px;
      border-bottom:1px solid var(--line);
    }
    .ecosystem-panel-heading{
      margin:0;
      color:var(--forest-deep);
      font-family:var(--ceremonial);
      font-size:clamp(20px,2.1vw,28px);
      font-weight:444;
      letter-spacing:.08em;
      line-height:1.1;
      text-transform:uppercase;
    }
    .ecosystem-panel-note{
      max-width:740px;
      margin:8px 0 0;
      color:var(--muted);
      font-size:12px;
      line-height:1.6;
    }
    .ecosystem-panel-close{
      width:38px;height:38px;
      display:grid;place-items:center;
      border:1px solid var(--line-strong);
      border-radius:4px;
      color:var(--ink);
      background:#fff;
      font-size:14px;
    }
    .ecosystem-panel-grid{
      display:grid;
      grid-template-columns:repeat(3,minmax(0,1fr));
      gap:26px 30px;
      margin-top:26px;
    }
    .ecosystem-subgroup{
      min-width:0;
    }
    .ecosystem-subgroup-title{
      margin:2px 0 10px;
      padding-bottom:9px;
      border-bottom:1px solid rgba(180,139,69,.45);
      color:#7e6332;
      font-family:var(--ceremonial);
      font-size:9px;
      font-weight:444;
      letter-spacing:.14em;
      line-height:1.4;
      text-transform:uppercase;
    }
    .ecosystem-link-list{
      display:grid;
      gap:2px;
    }
    .ecosystem-link{
      min-height:55px;
      display:grid;
      grid-template-columns:minmax(0,1fr) auto;
      align-items:center;
      gap:14px;
      padding:11px 7px 11px 0;
      border-bottom:1px solid rgba(18,23,19,.08);
      color:var(--ink);
      text-decoration:none;
    }
    .ecosystem-link:last-child{border-bottom:0}
    .ecosystem-link:hover{
      color:var(--forest);
      background:linear-gradient(90deg,rgba(180,139,69,.055),transparent);
    }
    .ecosystem-link-copy{min-width:0}
    .ecosystem-link strong{
      display:block;
      font-family:var(--display);
      font-size:11px;
      font-weight:444;
      line-height:1.2;
    }
    .ecosystem-link small{
      display:block;
      margin-top:4px;
      color:var(--muted);
      font-size:9px;
      line-height:1.48;
    }
    .ecosystem-link-arrow{
      color:#9b8150;
      font-size:11px;
    }
    @media(max-width:1040px){
      .ecosystem-category-grid{grid-template-columns:repeat(3,minmax(0,1fr))}
      .ecosystem-panel-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
    }
    @media(max-width:680px){
      .ecosystem-category-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
      .ecosystem-directory-panel{padding:24px 19px}
      .ecosystem-panel-grid{grid-template-columns:1fr}
    }
    @media(max-width:430px){
      .ecosystem-category-grid{grid-template-columns:1fr}
      .ecosystem-category-doorway{min-height:55}
      .ecosystem-category-link,.ecosystem-category-toggle{min-height:55px}
    }

  

    /* FEATURED ECOSYSTEM DISCOVERY — compact random slideshow */
    .ecosystem-feature-showcase{
      width:min(100%,1120px);
      margin:18px auto 0;
      position:relative;
    }
    .feature-showcase-shell{
      position:relative;
      min-height:224px;
      overflow:hidden;
      border:1px solid rgba(31,36,34,.16);
      border-radius:7px;
      background:
        radial-gradient(circle at 88% 18%,rgba(180,139,69,.10),transparent 19rem),
        linear-gradient(135deg,#fcfaf5,#f3eee3);
      box-shadow:0 13px 32px rgba(27,34,29,.06);
    }
    .feature-showcase-shell::before{
      content:"";
      position:absolute;
      inset:7px;
      z-index:0;
      pointer-events:none;
      border:1px solid rgba(26,31,29,.075);
      border-radius:4px;
    }
    .feature-slide{
      position:relative;
      z-index:1;
      min-height:224px;
      display:grid;
      grid-template-columns:230px minmax(0,1fr);
      gap:0;
      align-items:stretch;
      opacity:1;
      transform:translateX(0);
      transition:opacity .30s ease,transform .30s ease;
    }
    .feature-slide.is-leaving{opacity:0;transform:translateX(-34px)}
    .feature-slide.is-entering{opacity:0;transform:translateX(34px)}
    .feature-visual{
      position:relative;
      min-height:224px;
      overflow:hidden;
      display:grid;
      place-items:center;
      border-right:1px solid rgba(27,34,29,.12);
      background:
        linear-gradient(145deg,rgba(18,28,23,.94),rgba(42,48,45,.96)),
        #242a27;
    }
    .feature-visual::after{
      content:"";
      position:absolute;
      inset:12px;
      pointer-events:none;
      border:1px solid rgba(230,216,185,.25);
    }
    .feature-visual img{
      position:absolute;
      inset:0;
      width:100%;
      height:100%;
      object-fit:cover;
      display:none;
    }
    .feature-visual.has-image img{display:block}
    .feature-visual.has-image::before{
      content:"";
      position:absolute;
      inset:0;
      z-index:1;
      background:linear-gradient(180deg,transparent 52%,rgba(15,20,18,.56));
    }
    .feature-monogram{
      position:relative;
      z-index:2;
      display:grid;
      place-items:center;
      width:104px;
      height:84px;
      border:1px solid rgba(231,216,184,.48);
      color:#f0e7d4;
      font-family:var(--ceremonial);
      font-size:clamp(24px,3vw,38px);
      font-weight:500;
      letter-spacing:.08em;
      text-align:center;
      box-shadow:inset 0 0 0 5px rgba(255,255,255,.025);
    }
    .feature-visual-label{
      position:absolute;
      z-index:2;
      left:22px;
      right:22px;
      bottom:17px;
      color:rgba(246,240,227,.72);
      font-size:8.5px;
      letter-spacing:.16em;
      line-height:1.4;
      text-align:center;
      text-transform:uppercase;
    }
    .feature-copy{
      min-width:0;
      padding:28px 34px 26px;
      display:flex;
      flex-direction:column;
      justify-content:center;
      text-align:left;
    }
    .feature-kicker{
      margin:0;
      color:#896b35;
      font-family:var(--ceremonial);
      font-size:8.5px;
      font-weight:600;
      letter-spacing:.18em;
      text-transform:uppercase;
    }
    .feature-title{
      margin:8px 0 0;
      color:var(--forest-deep);
      font-family:var(--display);
      font-size:clamp(24px,3.2vw,38px);
      font-weight:500;
      line-height:1;
      letter-spacing:-.015em;
      text-wrap:balance;
    }
    .feature-description{
      max-width:700px;
      margin:10px 0 0;
      color:var(--muted);
      font-size:12px;
      line-height:1.65;
    }
    .feature-breadcrumbs{
      display:flex;
      flex-wrap:wrap;
      align-items:center;
      gap:6px;
      margin-top:12px;
      color:#796e5d;
      font-size:8.5px;
      letter-spacing:.065em;
      text-transform:uppercase;
    }
    .feature-breadcrumbs span[aria-hidden="true"]{color:#b59a67}
    .feature-actions{
      display:flex;
      align-items:center;
      gap:8px;
      flex-wrap:wrap;
      margin-top:16px;
    }
    .feature-open-button,
    .feature-pause-button{
      min-height:38px;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      padding:8px 13px;
      border-radius:4px;
      font-size:9px;
      font-weight:600;
      letter-spacing:.11em;
      line-height:1.2;
      text-transform:uppercase;
    }
    .feature-open-button{
      border:1px solid #222725;
      color:#f6f1e7;
      background:#2d3230;
      box-shadow:inset 0 0 0 1px rgba(255,255,255,.09);
    }
    .feature-open-button:hover{background:#1f2422}
    .feature-pause-button{
      border:1px solid var(--line-strong);
      color:#625843;
      background:rgba(255,255,255,.68);
    }
    .feature-counter{
      margin-left:auto;
      color:#817765;
      font-family:var(--ceremonial);
      font-size:8px;
      letter-spacing:.12em;
      text-transform:uppercase;
    }

    /* Internal ecosystem viewer */
    .ecosystem-viewer-overlay{
      position:fixed;
      inset:0;
      z-index:4800;
      display:none;
      align-items:center;
      justify-content:center;
      padding:26px;
      background:rgba(13,18,16,.62);
      backdrop-filter:blur(8px);
    }
    .ecosystem-viewer-overlay.open{display:flex}
    body.feature-viewer-open{overflow:hidden}
    .ecosystem-viewer{
      width:min(1180px,96vw);
      height:min(830px,92vh);
      display:grid;
      grid-template-rows:auto auto minmax(0,1fr) auto;
      overflow:hidden;
      border:1px solid rgba(231,216,184,.42);
      border-radius:7px;
      color:#17201c;
      background:#f7f4ed;
      box-shadow:0 30px 90px rgba(0,0,0,.35),inset 0 0 0 1px rgba(255,255,255,.64);
    }
    .ecosystem-viewer-toolbar{
      min-height:58px;
      display:grid;
      grid-template-columns:minmax(0,1fr) auto;
      align-items:center;
      gap:16px;
      padding:10px 12px 10px 18px;
      color:#f4efe4;
      background:#252a28;
      border-bottom:1px solid #111412;
    }
    .viewer-breadcrumbs{
      min-width:0;
      display:flex;
      flex-wrap:wrap;
      gap:6px;
      align-items:center;
      font-size:8.5px;
      letter-spacing:.085em;
      line-height:1.4;
      text-transform:uppercase;
    }
    .viewer-breadcrumbs strong{color:#e2cfaa;font-weight:600}
    .viewer-breadcrumbs span{color:rgba(255,255,255,.58)}
    .viewer-toolbar-actions{display:flex;align-items:center;gap:7px}
    .viewer-tool{
      min-height:36px;
      padding:7px 11px;
      border:1px solid rgba(255,255,255,.24);
      border-radius:4px;
      color:#f6f1e7;
      background:rgba(255,255,255,.045);
      font-size:8.5px;
      letter-spacing:.09em;
      text-transform:uppercase;
    }
    .viewer-tool:hover{background:rgba(255,255,255,.10)}
    .viewer-close{
      width:38px;height:38px;
      display:grid;place-items:center;
      padding:0;
      border:1px solid rgba(255,255,255,.30);
      border-radius:4px;
      color:#fff;
      background:rgba(255,255,255,.04);
      font-size:22px;
      line-height:1;
    }
    .viewer-summary{
      display:grid;
      grid-template-columns:minmax(0,1fr) auto;
      align-items:center;
      gap:18px;
      padding:13px 18px;
      border-bottom:1px solid var(--line);
      background:#fbf9f4;
    }
    .viewer-summary h3{
      margin:0;
      color:var(--forest-deep);
      font-family:var(--display);
      font-size:20px;
      font-weight:500;
      line-height:1.15;
    }
    .viewer-summary p{
      max-width:820px;
      margin:4px 0 0;
      color:var(--muted);
      font-size:10.5px;
      line-height:1.5;
    }
    .viewer-full-link{
      min-height:38px;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      padding:8px 12px;
      border:1px solid #252a28;
      border-radius:4px;
      color:#fff;
      background:#303633;
      font-size:8.5px;
      font-weight:600;
      letter-spacing:.09em;
      text-decoration:none;
      text-transform:uppercase;
      white-space:nowrap;
    }
    .viewer-frame-wrap{
      position:relative;
      min-height:0;
      background:#e9e5dc;
    }
    .viewer-frame{
      width:100%;
      height:100%;
      display:block;
      border:0;
      background:#fff;
    }
    .viewer-frame-note{
      padding:8px 14px;
      border-top:1px solid var(--line);
      color:#706756;
      background:#f7f4ed;
      font-size:9px;
      line-height:1.5;
      text-align:center;
    }
    @media(max-width:760px){
      .feature-slide{grid-template-columns:150px minmax(0,1fr)}
      .feature-copy{padding:24px 22px}
      .feature-title{font-size:clamp(20px,6vw,29px)}
      .feature-description{font-size:11px}
      .viewer-summary{grid-template-columns:1fr}
      .viewer-full-link{justify-self:start}
      .viewer-tool span{display:none}
    }
    @media(max-width:540px){
      .feature-showcase-shell,.feature-slide{min-height:304px}
      .feature-slide{grid-template-columns:1fr;grid-template-rows:108px 1fr}
      .feature-visual{min-height:108px;border-right:0;border-bottom:1px solid rgba(27,34,29,.12)}
      .feature-monogram{width:82px;height:54px;font-size:22px}
      .feature-visual-label{left:auto;right:20px;bottom:15px;text-align:right}
      .feature-copy{padding:20px 20px 22px}
      .feature-counter{width:100%;margin-left:0;margin-top:3px}
      .ecosystem-viewer-overlay{padding:8px}
      .ecosystem-viewer{width:100%;height:96vh}
      .ecosystem-viewer-toolbar{padding-left:12px}
      .viewer-breadcrumbs{font-size:7.6px}
    }
    @media(prefers-reduced-motion:reduce){
      .feature-slide{transition:none}
    }

    /* =========================================================
       2026-08-10 V8 ACCESSIBILITY + SECTION RHYTHM
       Jennifer Kay Pearl number system:
       3 · 7 · 11 · 14 · 24 · 33 · 44 · 55 · 66
       weights 333 · 444 · 555
       ========================================================= */
    body{
      min-width:333px;
      font-size:18px;
      font-weight:333;
    }

    /* 11px is the absolute fine-print/utility floor. */
    .network-ticker-label,
    .network-ticker-app,
    .network-ticker-call,
    .scroll-cue,
    .eyebrow,
    .brand-mark,
    .intelligence-node span,
    .network-count span,
    .menu-link i,
    .admin-gate-kicker,
    .admin-gate-form label,
    .admin-code-toggle,
    .admin-gate-submit,
    .admin-gate-secondary,
    .admin-gate-note,
    .brand-sub,
    .header-links a,
    .button,
    .pillar-number,
    .pillar-primary,
    .pillar-browse,
    .footer-meta span,
    .ecosystem-subgroup-title,
    .feature-visual-label,
    .feature-kicker,
    .feature-breadcrumbs,
    .feature-open-button,
    .feature-pause-button,
    .feature-counter,
    .viewer-breadcrumbs,
    .viewer-tool,
    .viewer-full-link,
    .viewer-frame-note,
    .viewer-blocked-kicker,
    .menu-link small,
    .site-card small{
      font-size:11px!important;
    }

    /* 14px is the smallest normal reading text. */
    .brand-name,
    .section-intro,
    .feature-icon,
    .control-button,
    .directory-status,
    .pillar-card p,
    .intelligence-copy p,
    .intelligence-node small,
    .intelligence-note,
    .feature-card p,
    .support-copy p,
    .support-points span,
    .campaign-copy p,
    .site-group,
    .site-card p,
    .statement-copy p,
    .final p,
    .privacy-note,
    footer,
    .drawer p,
    .menu-group,
    .menu-link strong,
    .ecosystem-category-link,
    .ecosystem-category-toggle,
    .ecosystem-panel-note,
    .ecosystem-link strong,
    .ecosystem-link small,
    .ecosystem-link-arrow,
    .feature-description,
    .viewer-summary p,
    .viewer-embed-blocked p,
    .ecosystem-category-link::after,
    .ecosystem-category-toggle{
      font-size:14px!important;
    }

    .admin-gate-panel h2,
    .drawer h2,
    .network-count strong{
      font-size:33px!important;
    }
    .admin-gate-panel p{font-size:14px!important}
    .admin-gate-close,
    .viewer-close,
    .privacy-note strong,
    .feature-card h3,
    .intelligence-node strong,
    .site-card h3,
    .value strong,
    .ecosystem-panel-heading,
    .viewer-summary h3,
    .viewer-embed-blocked h3{
      font-size:24px!important;
    }

    .section .kicker{
      font-size:24px!important;
      font-weight:555;
      letter-spacing:.11em;
    }
    .section .section-heading h2,
    .support-copy h2,
    .campaign-copy h2,
    .statement-copy h2,
    .final h2,
    .intelligence-copy h2{
      font-size:24px!important;
      line-height:1.24!important;
    }
    .section-intro{font-size:14px!important}

    /* Header section anchors: small, orderly, and visibly interactive. */
    .header-links{
      gap:7px;
    }
    .header-links a{
      min-height:33px;
      padding:7px 11px;
      border:1px solid rgba(18,23,19,.14);
      border-radius:7px;
      background:rgba(255,255,255,.44);
      font-weight:444;
      letter-spacing:.055em;
    }
    .header-links a:hover,
    .header-links a:focus-visible{
      border-color:rgba(180,139,69,.55);
      background:#fff;
    }

    /* The category panel now opens immediately beneath its button bank. */
    .ecosystem-dropdown-stage{margin-top:14px}
    .ecosystem-feature-showcase{margin-top:24px}
    .ecosystem-directory-panel{scroll-margin-top:calc(var(--sticky-stack) + 14px)}

    /* Protected iframe fallback. */
    .viewer-embed-blocked{
      position:absolute;
      inset:0;
      display:grid;
      place-items:center;
      padding:33px;
      color:var(--ink);
      background:
        radial-gradient(circle at 50% 0,rgba(180,139,69,.12),transparent 24rem),
        #f7f4ed;
      text-align:center;
    }
    .viewer-embed-blocked[hidden]{display:none!important}
    .viewer-embed-blocked > div{max-width:666px}
    .viewer-blocked-kicker{
      margin:0 0 11px;
      color:#896b35;
      font-family:var(--ceremonial);
      letter-spacing:.14em;
      text-transform:uppercase;
    }
    .viewer-embed-blocked h3{
      margin:0;
      color:var(--forest-deep);
      font-family:var(--display);
      font-weight:444;
    }
    .viewer-embed-blocked p{
      margin:14px auto 24px;
      color:var(--muted);
      line-height:1.7;
    }

    @media(max-width:560px){
      .network-ticker-label,
      .network-ticker-app,
      .network-ticker-call,
      .brand-sub,
      .header-links a,
      .feature-breadcrumbs,
      .viewer-breadcrumbs{
        font-size:11px!important;
      }
    }



    /* =========================================================
       2026-08-10 FLUID RESPONSIVE TYPOGRAPHY + LAYOUT PASS
       - section eyebrows grow with the screen
       - reading text scales smoothly
       - controls remain compact and single-line where practical
       - cards/grids/popup shells resize without hard jumps
       ========================================================= */

    :root{
      --fluid-utility:clamp(10px,calc(9px + .16vw),12px);
      --fluid-button:clamp(9.5px,calc(8.7px + .18vw),11.5px);
      --fluid-small:clamp(12px,calc(11px + .22vw),14px);
      --fluid-body:clamp(14px,calc(13px + .28vw),17px);
      --fluid-card-title:clamp(20px,calc(18px + .55vw),25px);
      --fluid-support-title:clamp(21px,calc(18px + 1vw),31px);
      --fluid-eyebrow:clamp(23px,calc(19px + 1.15vw),32px);
      --fluid-popup-title:clamp(27px,calc(22px + 1.45vw),38px);
      --fluid-count:clamp(28px,calc(24px + 1.5vw),38px);
      --fluid-section-pad:clamp(58px,7.2vw,104px);
      --fluid-inline-pad:clamp(13px,2.4vw,30px);
    }

    html{-webkit-text-size-adjust:100%;text-size-adjust:100%}
    body{
      min-width:0;
      font-size:var(--fluid-body)!important;
    }
    p{ text-wrap:pretty; }
    h1,h2,h3,.kicker,.eyebrow{ text-wrap:balance; }

    .shell{
      width:min(calc(100% - clamp(26px,5vw,56px)),var(--max));
    }

    .section{
      padding:var(--fluid-section-pad) var(--fluid-inline-pad)!important;
    }
    .section-inner,
    .support-bridge,
    .campaign-bridge,
    .network-statement,
    .intelligence-bridge,
    .privacy-note{
      width:min(100%,var(--max));
      min-width:0;
    }

    /* Bigger, fluid down-page eyebrows. */
    .section .kicker,
    .support-copy .kicker,
    .campaign-copy .kicker,
    .statement-copy .kicker,
    .final .kicker,
    .intelligence-copy .kicker{
      font-size:var(--fluid-eyebrow)!important;
      line-height:1.12!important;
      letter-spacing:clamp(.065em,.11vw,.11em)!important;
    }

    /* Supporting headline directly under the eyebrow remains subordinate. */
    .section .section-heading h2,
    .support-copy h2,
    .campaign-copy h2,
    .statement-copy h2,
    .final h2,
    .intelligence-copy h2{
      font-size:var(--fluid-support-title)!important;
      line-height:1.22!important;
    }

    /* Fluid normal reading text. */
    .section-intro,
    .pillar-card p,
    .feature-card p,
    .support-copy p,
    .campaign-copy p,
    .statement-copy p,
    .final p,
    .intelligence-copy p,
    .privacy-note,
    .drawer p,
    .admin-gate-panel p,
    .feature-description,
    .viewer-summary p,
    .viewer-embed-blocked p,
    .ecosystem-panel-note,
    .ecosystem-link small,
    .menu-link small{
      font-size:var(--fluid-body)!important;
    }

    /* Compact metadata stays legible but fluid. */
    .network-ticker-label,
    .network-ticker-app,
    .network-ticker-call,
    .scroll-cue,
    .eyebrow,
    .brand-sub,
    .header-links a,
    .pillar-number,
    .pillar-open,
    .footer-meta span,
    .ecosystem-subgroup-title,
    .feature-visual-label,
    .feature-kicker,
    .feature-breadcrumbs,
    .feature-counter,
    .viewer-breadcrumbs,
    .viewer-frame-note,
    .viewer-blocked-kicker,
    .menu-group,
    .menu-link i,
    .value-link small,
    .intelligence-path{
      font-size:var(--fluid-utility)!important;
    }

    /* Titles within cards and popup modules. */
    .feature-card h3,
    .intelligence-node strong,
    .site-card h3,
    .value strong,
    .ecosystem-panel-heading,
    .viewer-summary h3,
    .viewer-embed-blocked h3{
      font-size:var(--fluid-card-title)!important;
      line-height:1.16!important;
    }
    .admin-gate-panel h2,
    .drawer h2{
      font-size:var(--fluid-popup-title)!important;
      line-height:1.05!important;
    }
    .network-count strong{
      font-size:var(--fluid-count)!important;
    }

    /* Keep control labels compact so long labels do not jump to a second line. */
    .button,
    .header-links a,
    .admin-gate-submit,
    .admin-gate-secondary,
    .admin-code-toggle,
    .close-button,
    .ecosystem-panel-close,
    .feature-open-button,
    .feature-pause-button,
    .viewer-tool,
    .viewer-full-link,
    .viewer-close,
    .ticker-control{
      font-size:var(--fluid-button)!important;
      line-height:1.15!important;
    }
    .button,
    .admin-gate-submit,
    .admin-gate-secondary,
    .admin-code-toggle,
    .feature-open-button,
    .feature-pause-button,
    .viewer-tool,
    .viewer-full-link{
      max-width:100%;
      white-space:nowrap;
      overflow:hidden;
      text-overflow:ellipsis;
      letter-spacing:clamp(.035em,.08vw,.08em)!important;
    }

    /* The linked category words may be larger than utility buttons. */
    .ecosystem-category-link{
      font-size:clamp(12px,calc(10px + .4vw),15px)!important;
      letter-spacing:clamp(.075em,.12vw,.13em)!important;
      white-space:nowrap;
    }
    .ecosystem-category-toggle{
      font-size:clamp(13px,calc(11px + .35vw),16px)!important;
    }

    /* Fluid hero and brand without losing the established hierarchy. */
    .hero h1{
      font-size:44px!important;
    }
    .hero .eyebrow{
      font-size:clamp(11px,calc(9px + .45vw),14px)!important;
    }
    .hero-lead{
      font-size:24px!important;
    }
    .brand-name{
      font-size:clamp(13px,calc(11px + .45vw),17px)!important;
    }

    /* Auto-fit grids: cards choose the right column count for available width. */
    .pillar-grid{
      grid-template-columns:repeat(auto-fit,minmax(min(100%,235px),1fr))!important;
    }
    .featured-grid{
      grid-template-columns:repeat(auto-fit,minmax(min(100%,245px),1fr))!important;
    }
    .network-counts{
      grid-template-columns:repeat(auto-fit,minmax(min(100%,180px),1fr))!important;
    }
   .ecosystem-category-grid{
  width:min(100%,980px)!important;
  grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))!important;
}
    .ecosystem-panel-grid{
      grid-template-columns:repeat(auto-fit,minmax(min(100%,245px),1fr))!important;
    }
    .statement-values,
    .intelligence-map{
      grid-template-columns:repeat(auto-fit,minmax(min(100%,235px),1fr))!important;
    }

    .pillar-card,
    .feature-card,
    .network-count,
    .value,
    .intelligence-node,
    .ecosystem-category-doorway{
      min-width:0;
    }

    /* Fluid cards: no oversized fixed padding on smaller screens. */
    .pillar-card,
    .feature-card,
    .site-card{
      padding:clamp(21px,2.7vw,30px)!important;
    }
    .value,
    .intelligence-node{
      min-height:clamp(112px,12vw,156px)!important;
      padding:clamp(16px,2.4vw,24px)!important;
    }
    .network-count{
      min-height:clamp(100px,10vw,132px)!important;
      padding:clamp(15px,2.2vw,22px)!important;
    }

    /* Drawer scales to desktop, tablet and phone without becoming cramped. */
    .drawer{
      width:min(94vw,clamp(340px,46vw,520px))!important;
      padding:clamp(17px,2.8vw,26px)!important;
    }
    .drawer-search{
      min-height:clamp(44px,5.3vw,50px)!important;
      font-size:clamp(14px,calc(13px + .25vw),16px)!important;
    }
    .menu-link{
      grid-template-columns:auto minmax(0,1fr) auto;
      gap:clamp(8px,1.1vw,12px);
      padding:clamp(9px,1.2vw,13px)!important;
    }
    .menu-link strong{
      font-size:clamp(13px,calc(12px + .28vw),15px)!important;
    }

    /* Admin popup shell only — no change to admin logic. */
    .admin-gate-overlay{
      padding:clamp(10px,3vw,24px)!important;
    }
    .admin-gate-panel{
      width:min(94vw,500px)!important;
      max-height:min(90svh,780px)!important;
      padding:clamp(20px,4vw,32px)!important;
    }
    .admin-code-row{
      grid-template-columns:minmax(0,1fr) minmax(68px,82px);
      gap:clamp(7px,1.2vw,10px);
    }
    .admin-code-input{
      min-width:0;
      min-height:clamp(46px,5.4vw,52px)!important;
      font-size:clamp(15px,calc(14px + .45vw),18px)!important;
    }

    /* Ecosystem slideshow fluidizes before it reaches mobile breakpoint. */
    .feature-showcase-shell,
    .feature-slide{
      min-height:clamp(218px,24vw,280px)!important;
    }
    .feature-slide{
      grid-template-columns:minmax(150px,22%) minmax(0,1fr)!important;
    }
    .feature-visual{
      min-height:inherit!important;
    }
    .feature-copy{
      padding:clamp(21px,3vw,34px)!important;
    }
    .feature-title{
      font-size:clamp(22px,3vw,38px)!important;
    }

    /* Viewer/popup application shell follows viewport dimensions. */
    .ecosystem-viewer-overlay{
      padding:clamp(7px,2.2vw,26px)!important;
    }
    .ecosystem-viewer{
      width:min(96vw,1180px)!important;
      height:min(92svh,830px)!important;
      max-width:100%;
      max-height:100%;
    }
    .ecosystem-viewer-toolbar{
      min-height:clamp(50px,5vw,60px)!important;
      padding:clamp(8px,1.2vw,12px) clamp(10px,1.5vw,18px)!important;
    }
    .viewer-summary{
      grid-template-columns:minmax(0,1fr) auto;
      gap:clamp(10px,1.8vw,18px)!important;
      padding:clamp(11px,1.5vw,16px) clamp(12px,1.8vw,20px)!important;
    }
    .viewer-frame,
    iframe{
      max-width:100%;
    }
    .viewer-embed-blocked{
      padding:clamp(18px,4vw,38px)!important;
    }

    /* Bridges/panels breathe proportionally. */
    .support-bridge,
    .campaign-bridge{
      padding:clamp(24px,4vw,44px)!important;
      gap:clamp(24px,4vw,48px)!important;
    }
    .ecosystem-directory-panel{
      padding:clamp(20px,3.2vw,32px)!important;
    }

    /* Narrow screens: preserve readable controls without wrapping them. */
    @media(max-width:700px){
      .feature-slide{
        grid-template-columns:1fr!important;
        grid-template-rows:clamp(105px,24vw,145px) auto!important;
      }
      .feature-visual{
        min-height:0!important;
        border-right:0!important;
        border-bottom:1px solid rgba(27,34,29,.12);
      }
      .viewer-summary{
        grid-template-columns:1fr!important;
      }
      .viewer-full-link{
        justify-self:start;
      }
      .admin-code-row{
        grid-template-columns:1fr!important;
      }
      .admin-code-toggle{
        min-height:42px;
      }
      .actions,
      .campaign-actions,
      .intelligence-actions{
        width:min(100%,420px);
        margin-inline:auto;
      }
      .actions .button,
      .campaign-actions .button,
      .intelligence-actions .button{
        width:100%;
      }
    }

    @media(max-width:430px){
      .shell{width:min(calc(100% - 22px),var(--max))}
      .section{padding-inline:11px!important}
      .ecosystem-category-grid{grid-template-columns:1fr!important}
      .ecosystem-category-link{
        font-size:clamp(12px,3.7vw,14px)!important;
      }
      .button,
      .admin-gate-submit,
      .admin-gate-secondary,
      .feature-open-button,
      .feature-pause-button,
      .viewer-full-link{
        font-size:clamp(9px,2.8vw,10.5px)!important;
      }
      .ecosystem-viewer{
        width:100%!important;
        height:96svh!important;
      }
    }

    /* =========================================================
       FEATURED SITES — precision typography refinement
       ========================================================= */
    .ecosystem-directory-heading{
      max-width:820px;
      margin-bottom:clamp(30px,4vw,48px)!important;
    }
    .ecosystem-directory-heading .kicker{
      font-size:clamp(25px,2.15vw,33px)!important;
      letter-spacing:clamp(.07em,.1vw,.105em)!important;
    }
    .ecosystem-directory-heading h2{
      font-size:clamp(19px,1.8vw,27px)!important;
    }
    .ecosystem-directory-heading .section-intro{
      max-width:720px;
      font-size:clamp(13px,1vw,15px)!important;
    }

    /* Keep all ten names intact on one line. The grid drops a column
       before the lettering is allowed to wrap. */
    .ecosystem-category-grid{
  width:min(100%,980px)!important;
  grid-template-columns:repeat(auto-fit,minmax(min(100%,220px),1fr))!important;
}
    .ecosystem-category-doorway{
      grid-template-columns:minmax(0,1fr) clamp(40px,3.3vw,46px)!important;
      min-height:clamp(62px,5vw,70px)!important;
    }
    .ecosystem-category-link{
      min-height:inherit!important;
      padding:12px 8px 12px 12px!important;
      gap:6px!important;
      font-size:clamp(9px,.66vw,11px)!important;
      letter-spacing:clamp(.055em,.066vw,.077em)!important;
      line-height:1!important;
      white-space:nowrap!important;
      overflow:visible!important;
      text-overflow:clip!important;
    }
    .ecosystem-category-link::after{
      font-size:clamp(9px,.65vw,11px)!important;
    }
    .ecosystem-category-toggle{
      min-width:40px!important;
      min-height:inherit!important;
      font-size:clamp(11px,.75vw,13px)!important;
    }

    /* Compact action labels across the root page. */
    .button,
    .header-links a,
    .admin-gate-submit,
    .admin-gate-secondary,
    .admin-code-toggle,
    .feature-open-button,
    .feature-pause-button,
    .viewer-tool,
    .viewer-full-link{
      font-size:clamp(9px,.68vw,11px)!important;
      letter-spacing:clamp(.035em,.055vw,.075em)!important;
      line-height:1.15!important;
      white-space:nowrap!important;
      overflow:visible!important;
      text-overflow:clip!important;
    }

    /* Popup controls must always sit above the embedded page. */
    .ecosystem-viewer-toolbar,
    .viewer-toolbar-actions,
    .viewer-tool,
    .viewer-close{
      position:relative;
      z-index:5;
    }
    .viewer-tool,
    .viewer-close{
      pointer-events:auto;
    }
    .viewer-close{
      font-size:clamp(20px,1.7vw,24px)!important;
    }

    @media(max-width:520px){
      .ecosystem-category-grid{
        grid-template-columns:1fr!important;
      }
      .ecosystem-category-link{
        font-size:clamp(10px,3vw,12px)!important;
      }
    }



    /* =========================================================
       REPAIR 14 — PRESIDENTIAL PUBLIC SERVICE FEATURE
       Dark American flag palette; root campaign section only.
       ========================================================= */
    .campaign-section{
      position:relative;
      overflow:hidden;
      padding-block:clamp(72px,8.4vw,118px)!important;
      color:#f6f1e7;
      background:
        radial-gradient(circle at 12% 12%,rgba(176,24,42,.26),transparent 25rem),
        radial-gradient(circle at 88% 82%,rgba(255,255,255,.055),transparent 29rem),
        linear-gradient(132deg,#071426 0%,#0b1d38 44%,#101d34 100%)!important;
      border-block:1px solid rgba(255,255,255,.08);
    }
    .campaign-section::before{
      content:"";
      position:absolute;
      inset:0;
      pointer-events:none;
      opacity:.3;
      background:
        repeating-linear-gradient(
          0deg,
          transparent 0 46px,
          rgba(255,255,255,.032) 46px 48px,
          transparent 48px 94px
        );
    }
    .campaign-section::after{
      content:"★  ★  ★  ★  ★";
      position:absolute;
      top:clamp(22px,3vw,42px);
      right:clamp(20px,5vw,74px);
      color:rgba(246,241,231,.12);
      font-size:clamp(13px,1.35vw,20px);
      letter-spacing:.55em;
      pointer-events:none;
      white-space:nowrap;
    }
    .campaign-section .section-inner{
      position:relative;
      z-index:1;
      max-width:1180px;
    }

    .campaign-presidential{
      position:relative;
      display:grid;
      grid-template-columns:minmax(280px,.86fr) minmax(0,1.14fr);
      align-items:center;
      gap:clamp(34px,5vw,68px);
      padding:clamp(24px,4.2vw,52px);
      overflow:hidden;
      border:1px solid rgba(246,241,231,.18);
      border-radius:11px;
      background:
        linear-gradient(135deg,rgba(255,255,255,.055),rgba(255,255,255,.018)),
        rgba(4,13,27,.50);
      box-shadow:
        0 30px 80px rgba(0,0,0,.24),
        inset 0 0 0 1px rgba(255,255,255,.035);
      backdrop-filter:blur(3px);
    }
    .campaign-presidential::before{
      content:"";
      position:absolute;
      inset:0 auto 0 0;
      width:7px;
      background:linear-gradient(180deg,#971d2d 0 33%,#f3eee4 33% 66%,#19365f 66% 100%);
    }

    .campaign-flag-accent{
      position:absolute;
      top:0;
      right:0;
      width:min(40%,440px);
      height:8px;
      display:grid;
      grid-template-columns:1fr 1fr 1fr;
      opacity:.92;
    }
    .campaign-flag-accent span:nth-child(1){background:#a31d2e}
    .campaign-flag-accent span:nth-child(2){background:#eee9df}
    .campaign-flag-accent span:nth-child(3){background:#23436d}

    .campaign-visual{
      min-width:0;
      align-self:stretch;
      display:flex;
      flex-direction:column;
      justify-content:center;
    }
    .campaign-mark-frame{
      position:relative;
      overflow:hidden;
      border:1px solid rgba(246,241,231,.24);
      border-radius:7px;
      background:#f5f1e9;
      box-shadow:0 18px 48px rgba(0,0,0,.24);
    }
    .campaign-mark-frame::after{
      content:"";
      position:absolute;
      inset:8px;
      pointer-events:none;
      border:1px solid rgba(9,26,50,.15);
      border-radius:3px;
    }
    .campaign-mark{
      width:100%;
      height:auto;
      display:block;
      aspect-ratio:1.87/1;
      object-fit:cover;
    }
    .campaign-visual-note{
      margin:13px 0 0!important;
      color:rgba(246,241,231,.58)!important;
      font-family:var(--ceremonial);
      font-size:clamp(9px,.72vw,11px)!important;
      letter-spacing:.16em;
      line-height:1.4;
      text-align:center;
      text-transform:uppercase;
    }

    .campaign-copy-presidential{
      text-align:left!important;
    }
    .campaign-copy-presidential .kicker{
      margin:0 0 13px!important;
      color:#d5b9be!important;
      font-size:clamp(21px,2.1vw,31px)!important;
      font-weight:555;
      letter-spacing:clamp(.08em,.11vw,.12em)!important;
      text-align:left;
    }
    .campaign-copy-presidential h2{
      max-width:760px!important;
      margin:0!important;
      color:#fff!important;
      font-family:var(--display);
      font-size:clamp(38px,5vw,68px)!important;
      font-weight:444!important;
      letter-spacing:-.025em!important;
      line-height:.98!important;
      text-wrap:balance;
    }
    .campaign-copy-presidential .campaign-lead{
      max-width:690px;
      margin:22px 0 0!important;
      color:rgba(246,241,231,.80)!important;
      font-size:clamp(14px,1.2vw,17px)!important;
      line-height:1.72!important;
    }

    .campaign-principles{
      display:flex;
      flex-wrap:wrap;
      gap:8px;
      margin-top:24px;
    }
    .campaign-principles span{
      display:inline-flex;
      align-items:center;
      min-height:31px;
      padding:6px 10px;
      border:1px solid rgba(246,241,231,.17);
      border-radius:999px;
      color:#eee8dd;
      background:rgba(255,255,255,.045);
      font-size:clamp(9px,.68vw,11px);
      font-weight:555;
      letter-spacing:.07em;
      text-transform:uppercase;
    }

    .campaign-actions-presidential{
      display:flex!important;
      flex-wrap:wrap;
      gap:10px!important;
      margin-top:28px;
    }
    .campaign-button{
      min-height:44px;
      display:inline-flex;
      align-items:center;
      justify-content:center;
      gap:8px;
      padding:11px 15px;
      border-radius:7px;
      font-size:clamp(9.5px,.72vw,11.5px)!important;
      font-weight:600;
      letter-spacing:.065em;
      line-height:1.15;
      text-decoration:none;
      text-transform:uppercase;
      white-space:nowrap;
      transition:
        transform .17s ease,
        border-color .17s ease,
        background .17s ease,
        color .17s ease,
        box-shadow .17s ease;
    }
    .campaign-button-primary{
      border:1px solid #c44251;
      color:#fff;
      background:linear-gradient(180deg,#a72a3a,#851a2a);
      box-shadow:0 10px 24px rgba(91,11,25,.26);
    }
    .campaign-button-secondary{
      border:1px solid rgba(246,241,231,.31);
      color:#f6f1e7;
      background:rgba(255,255,255,.055);
    }
    .campaign-button:hover,
    .campaign-button:focus-visible{
      transform:translateY(-2px);
      box-shadow:0 14px 28px rgba(0,0,0,.22);
    }
    .campaign-button-primary:hover,
    .campaign-button-primary:focus-visible{
      background:linear-gradient(180deg,#bb3144,#932033);
    }
    .campaign-button-secondary:hover,
    .campaign-button-secondary:focus-visible{
      border-color:rgba(246,241,231,.58);
      background:rgba(255,255,255,.11);
    }
    .campaign-button:active{
      transform:translateY(0) scale(.995);
    }
    .campaign-button span{
      transition:transform .17s ease;
    }
    .campaign-button:hover span,
    .campaign-button:focus-visible span{
      transform:translate(2px,-2px);
    }

    .campaign-separation-note{
      max-width:650px;
      margin:18px 0 0!important;
      color:rgba(246,241,231,.48)!important;
      font-size:clamp(10px,.78vw,12px)!important;
      line-height:1.55!important;
    }

    @media(max-width:860px){
      .campaign-presidential{
        grid-template-columns:1fr;
        gap:30px;
      }
      .campaign-visual{
        width:min(100%,640px);
        margin-inline:auto;
      }
      .campaign-copy-presidential{
        text-align:center!important;
      }
      .campaign-copy-presidential .kicker{
        text-align:center;
      }
      .campaign-copy-presidential h2,
      .campaign-copy-presidential .campaign-lead,
      .campaign-separation-note{
        margin-inline:auto!important;
      }
      .campaign-principles,
      .campaign-actions-presidential{
        justify-content:center;
      }
    }

    @media(max-width:520px){
      .campaign-section{
        padding-inline:10px!important;
      }
      .campaign-presidential{
        padding:22px 17px 25px;
        border-radius:7px;
      }
      .campaign-presidential::before{
        width:5px;
      }
      .campaign-copy-presidential h2{
        font-size:clamp(34px,11vw,48px)!important;
      }
      .campaign-actions-presidential{
        display:grid!important;
        grid-template-columns:1fr;
        width:100%;
      }
      .campaign-button{
        width:100%;
      }
      .campaign-principles{
        justify-content:center;
      }
      .campaign-section::after{
        right:13px;
        letter-spacing:.33em;
      }
    }


    /* =========================================================
       2026-08-12 SYMMETRY + TYPOGRAPHY FINE-TUNING
       Cosmetic only. No navigation, directory, admin, viewer,
       ticker, campaign, or application logic is changed.
       ========================================================= */
    :root{
      --vnv-fine:clamp(13px,calc(12px + .16vw),15px);
      --vnv-control:clamp(11px,calc(10.8px + .05vw),11.5px);
      --vnv-eyebrow:clamp(24px,calc(21px + .72vw),30px);
      --vnv-support:33px;
    }

    /* Exact desktop centerline: brand | centered section bank | menu. */
    .header-inner{
      grid-template-columns:1fr auto 1fr!important;
      column-gap:18px!important;
    }
    .brand{
      justify-self:start!important;
    }
    .header-links{
      width:auto!important;
      justify-self:center!important;
      justify-content:center!important;
      gap:6px!important;
    }
    .header-links a{
      width:106px!important;
      min-width:106px!important;
      height:32px!important;
      min-height:32px!important;
      justify-content:center!important;
      padding:0 2px!important;
      border:1px solid rgba(8,11,15,.9)!important;
      border-radius:7px!important;
      color:#fff!important;
      background:var(--ink)!important;
      box-shadow:none!important;
      font-family:var(--sans)!important;
      font-size:var(--vnv-control)!important;
      font-weight:400!important;
      letter-spacing:.02em!important;
      line-height:1!important;
      white-space:nowrap!important;
      overflow:hidden!important;
      text-overflow:clip!important;
    }
    .header-links a:hover,
    .header-links a:focus-visible{
      color:#fff!important;
      background:var(--forest)!important;
      border-color:var(--forest)!important;
      transform:translateY(-1px);
    }

    /* The flanking controls mirror one another. */
    .brand-mark,
    .menu-button{
      width:36px!important;
      height:36px!important;
    }
    .brand-mark{
      flex:0 0 36px!important;
      font-weight:400!important;
    }
    .menu-button{
      justify-self:end!important;
      border-color:var(--ink)!important;
      color:#fff!important;
      background:var(--ink)!important;
    }

    .brand{gap:10px!important;}
    .brand-name{
      font-family:var(--ceremonial)!important;
      font-size:15px!important;
      font-weight:400!important;
      letter-spacing:.075em!important;
    }
    .brand-sub{
      font-family:var(--sans)!important;
      font-size:12px!important;
      font-weight:400!important;
      letter-spacing:.12em!important;
    }
    .menu-button:hover,
    .menu-button:focus-visible{
      background:var(--forest)!important;
      border-color:var(--forest)!important;
    }
    .menu-lines,
    .menu-lines::before,
    .menu-lines::after{
      background:#fff!important;
    }
    .menu-button[aria-expanded="true"] .menu-lines{
      background:transparent!important;
    }

    /* Down-page hierarchy: larger eyebrow, smaller supporting headline. */
    .section .kicker,
    .support-copy .kicker,
    .campaign-copy .kicker,
    .statement-copy .kicker,
    .final .kicker,
    .intelligence-copy .kicker,
    .ecosystem-directory-heading .kicker{
      font-size:var(--vnv-eyebrow)!important;
      line-height:1.12!important;
      letter-spacing:clamp(.065em,.1vw,.105em)!important;
      text-align:center!important;
    }
    .section .section-heading h2,
    .support-copy h2,
    .campaign-copy h2,
    .statement-copy h2,
    .final h2,
    .intelligence-copy h2,
    .ecosystem-directory-heading h2{
      font-size:var(--vnv-support)!important;
      line-height:1.24!important;
      text-align:center!important;
    }

    /* Enforce the shared Verve N Veda typography standard on the opening hero. */
    .hero .eyebrow{
      font-size:clamp(14px,calc(12px + .45vw),17px)!important;
    }
    .hero h1{
      font-size:44px!important;
    }

    /* Raise the page's smallest typography by roughly three pixels. */
    .network-ticker-label,
    .network-ticker-app,
    .network-ticker-call,
    .scroll-cue,
    .brand-sub,
    .admin-gate-kicker,
    .admin-gate-form label,
    .pillar-number,
    .pillar-primary,
    .pillar-browse,
    .footer-meta span,
    .ecosystem-subgroup-title,
    .feature-visual-label,
    .feature-kicker,
    .feature-breadcrumbs,
    .feature-counter,
    .viewer-breadcrumbs,
    .viewer-frame-note,
    .viewer-blocked-kicker,
    .menu-group,
    .menu-link i,
    .value-link small,
    .intelligence-path,
    .campaign-visual-note,
    .campaign-principles span,
    .campaign-separation-note,
    .site-card small{
      font-size:var(--vnv-fine)!important;
    }
    .button,
    .admin-gate-submit,
    .admin-gate-secondary,
    .admin-code-toggle,
    .feature-open-button,
    .feature-pause-button,
    .viewer-tool,
    .viewer-full-link{
      font-size:var(--vnv-control)!important;
    }

    /* Balance the two major paired modules around the same page centerline. */
    .support-bridge{
      grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;
    }
    .support-copy{
      text-align:center!important;
    }

    .campaign-presidential{
      grid-template-columns:minmax(0,1fr) minmax(0,1fr)!important;
    }
    .campaign-copy-presidential{
      text-align:center!important;
    }
    .campaign-copy-presidential .kicker{
      margin:0 auto 13px!important;
      font-size:var(--vnv-eyebrow)!important;
      text-align:center!important;
    }
    .campaign-copy-presidential h2{
      max-width:760px!important;
      margin:0 auto!important;
      font-size:var(--vnv-support)!important;
      line-height:1.2!important;
      letter-spacing:.01em!important;
      text-align:center!important;
    }
    .campaign-copy-presidential .campaign-lead,
    .campaign-separation-note{
      margin-left:auto!important;
      margin-right:auto!important;
      text-align:center!important;
    }
    .campaign-principles,
    .campaign-actions-presidential{
      justify-content:center!important;
    }

    /* Refined public typography: hierarchy comes from scale and spacing, not heaviness. */
    body *{font-weight:400!important;}
    body strong,
    body b{font-weight:444!important;}

    @media(max-width:1230px){
      .header-inner{
        grid-template-columns:minmax(0,1fr) 36px!important;
      }
      .header-links{
        display:none!important;
      }
    }

    @media(max-width:860px){
      .support-bridge,
      .campaign-presidential{
        grid-template-columns:1fr!important;
      }
    }

    @media(max-width:560px){
      .brand-mark,
      .menu-button{
        width:40px!important;
        height:40px!important;
      }
      .brand-mark{
        flex-basis:40px!important;
      }
      .header-inner{
        grid-template-columns:minmax(0,1fr) 40px!important;
      }
    }

        /* =========================================================
   FOUR GREAT HALLS — TYPOGRAPHY / OVERFLOW REPAIR
   ========================================================= */

.pillar-copy,
.pillar-card h3,
.pillar-card p,
.pillar-primary,
.pillar-browse{
  min-width:0;
  max-width:100%;
}

.pillar-card h3{
  font-size:clamp(23px,1.75vw,30px);
  line-height:1.08;
  overflow-wrap:normal;
  word-break:normal;
  hyphens:none;
}

.pillar-primary{
  white-space:normal;
  overflow-wrap:normal;
  word-break:normal;
  line-height:1.35;
  padding-inline:8px;
}

.pillar-browse{
  min-height:52px;
  padding:10px 14px;
  white-space:normal;
  overflow-wrap:normal;
  word-break:normal;
  line-height:1.25;
}


</style>
```

### Style 3 — id="vnv-enrolled-student-entry-style" (line 3722)

```html
<style id="vnv-enrolled-student-entry-style">
    .hero .enrolled-student-entry-row{
      display:flex;justify-content:center;align-items:center;
      width:100%;margin-top:25px;text-align:center;
    }
    .hero .enrolled-student-entry{
      display:inline-flex;align-items:center;justify-content:center;
      width:auto;max-width:calc(100% - 16px);min-height:40px;
      margin:0;padding:9px 19px;
      border:1px solid #28332f;border-radius:7px;
      background:#28332f;color:#f4f0e7;
      font-family:inherit;font-size:16px;font-weight:400;
      line-height:1.3;letter-spacing:.025em;text-align:center;
      text-decoration:none;box-shadow:0 2px 7px rgba(20,28,24,.10);
      transition:background .16s ease,box-shadow .16s ease,transform .16s ease;
    }
    .hero .enrolled-student-entry:hover{
      background:#374943;color:#fff;box-shadow:0 3px 11px rgba(20,28,24,.14);
      transform:translateY(-1px);
    }
    .hero .enrolled-student-entry:focus-visible{
      outline:3px solid #a88043;outline-offset:4px;
    }
    @media(max-width:560px){
      .hero .enrolled-student-entry-row{margin-top:20px;}
      .hero .enrolled-student-entry{padding:10px 15px;}
    }
    @media(prefers-reduced-motion:reduce){
      .hero .enrolled-student-entry{transition:none;}
      .hero .enrolled-student-entry:hover{transform:none;}
    }
  </style>
```

### Style 4 — id="vnv-footer-information-contrast" (line 3754)

```html
<style id="vnv-footer-information-contrast">
    /* Two public information sections follow NAIB; preserve existing anchors. */
    #privacy.section{background:#ede6d8!important;padding-block:55px!important;}
    #privacy .privacy-note{
      max-width:900px;
      padding:30px 36px;
      border:3px solid #28332f!important;
      border-radius:7px!important;
      background:#fffdf7!important;
      color:#28332f!important;
      font-size:16px!important;
      line-height:1.7!important;
      box-shadow:0 4px 15px rgba(20,28,24,.07);
      text-align:center;
    }
    #privacy .privacy-note strong{
      color:#23362f!important;
      font-size:clamp(24px,3vw,33px)!important;
      font-weight:400!important;
      margin-bottom:15px!important;
    }
    #support.section{background:#f5f0e7!important;padding-block:65px!important;}
    #support .support-bridge{
      max-width:1040px;
      margin-inline:auto;
      border:3px solid #28332f!important;
      border-radius:7px!important;
      background:#fffdf7!important;
      box-shadow:0 5px 16px rgba(20,28,24,.065)!important;
    }
    #support .support-copy h2{color:#23362f!important;}
    #support .support-copy p{color:#28332f!important;font-size:16px!important;line-height:1.7!important;}
    #support .support-payment{
      background:#f3eddf!important;
      border:1px solid #7d887e!important;
      border-radius:7px!important;
    }
    #support .support-payment small{color:#384840!important;font-size:16px!important;}
    #support .support-points span{
      color:#28332f!important;
      background:#f3eddf!important;
      border-color:#b4b9ac!important;
      font-size:16px!important;
      font-weight:400!important;
      border-radius:7px!important;
    }
    #support .support-payment .button{background:#28332f!important;color:#f4f0e7!important;border-color:#28332f!important;}
    #support .support-bridge{
      grid-template-columns:minmax(0,1.3fr) minmax(260px,.7fr);
      gap:clamp(22px,3vw,38px);
      align-items:center;
      padding:clamp(26px,4vw,44px);
    }
    #support .support-copy .kicker{font-size:16px!important;letter-spacing:.11em!important;}
    #support .support-copy h2{
      margin:10px 0 20px!important;
      font-family:var(--display),Georgia,serif!important;
      font-size:clamp(30px,3.1vw,43px)!important;
      font-weight:400!important;
      line-height:1.2!important;
      text-wrap:balance;
    }
    #support .support-copy p{margin:0 0 15px!important;}
    #support .support-copy .support-impact{font-size:18px!important;line-height:1.65!important;}
    #support .support-impact strong{color:#28332f;font-weight:600;}
    #support .support-copy .support-reassurance{
      margin-top:19px!important;
      padding:15px 18px;
      border-left:3px solid #a88043;
      background:#f3eddf;
      border-radius:0 7px 7px 0;
    }
    #support .support-copy .support-separation{
      margin-top:18px!important;
      font-size:16px!important;
      color:#435249!important;
    }
    #support .support-payment{
      gap:15px;
      justify-items:center;
      align-content:center;
      min-height:270px;
      padding:28px 22px!important;
      text-align:center;
    }
    #support .support-payment .support-payment-eyebrow{
      margin:0;
      font-family:var(--display),Georgia,serif;
      font-size:22px!important;
      color:#28332f;
      letter-spacing:.05em;
    }
    #support .support-payment .support-payment-message{
      margin:0;
      font-size:16px!important;
      color:#28332f;
      line-height:1.55;
    }
    #support .support-payment .button{
      display:inline-flex;
      align-items:center;
      justify-content:center;
      min-height:44px;
      width:min(100%,250px);
      padding:10px 18px!important;
      border-radius:7px!important;
      font-size:16px!important;
      font-weight:400!important;
      text-align:center;
      text-decoration:none;
    }
    #support .support-payment small{max-width:300px;line-height:1.6!important;}
    @media(max-width:760px){
      #support .support-bridge{grid-template-columns:1fr;}
      #support .support-copy{text-align:left;}
    }
    @media(max-width:640px){
      #privacy .privacy-note{padding:24px 20px;}
      #support .support-bridge{padding:25px 19px;}
    }
  </style>
```

### Style 5 — id="vnv-home-control-fit" (line 3875)

```html
<style id="vnv-home-control-fit">
    .hero h1#gatewayTitle{
      font-size:clamp(40px, calc(55px + 1.7vw), 77px)!important;
      line-height:1.15!important;
      max-width:100%;
      margin-inline:auto;
      text-align:center;
      overflow-wrap:normal;
      word-break:normal;
      text-wrap:balance;
    }
    .hero-actions{
      display:flex;
      flex-wrap:wrap;
      justify-content:center;
      align-items:stretch;
      gap:11px;
      max-width:100%;
    }
    .hero-actions .button{
      box-sizing:border-box;
      min-width:0!important;
      max-width:100%;
      min-height:44px;
      padding:11px 17px!important;
      line-height:1.35!important;
      white-space:normal!important;
      overflow:visible!important;
      text-align:center;
      text-wrap:balance;
      overflow-wrap:normal;
      word-break:normal;
      border-radius:7px!important;
    }
    .header-links{gap:7px!important;min-width:0;}
    .header-links a{
      box-sizing:border-box;
      width:auto!important;
      min-width:76px!important;
      max-width:none!important;
      height:auto!important;
      min-height:36px!important;
      padding:8px 11px!important;
      line-height:1.25!important;
      white-space:nowrap!important;
      overflow:visible!important;
      text-overflow:clip!important;
      border-radius:7px!important;
    }
    .menu-button{border-radius:7px!important;}
    .ecosystem-category-link,.pillar-browse,.feature-open-button,.feature-pause-button,
    .viewer-tool,.viewer-full-link,.admin-gate-submit,.admin-gate-secondary{
      box-sizing:border-box;
      max-width:100%;
      padding-inline:clamp(11px,1.2vw,18px)!important;
      line-height:1.35!important;
      white-space:normal!important;
      text-align:center;
      text-wrap:balance;
      overflow-wrap:normal;
      word-break:normal;
      border-radius:7px!important;
    }
    @media(max-width:1230px){.header-links{display:none!important;}}
    @media(max-width:560px){
      .hero h1#gatewayTitle{font-size:clamp(36px,9vw,44px)!important;}
      .hero-actions{display:grid;grid-template-columns:minmax(0,1fr);width:100%;}
      .hero-actions .button{width:100%!important;}
    }
  
    /* October refinement: airier editorial rhythm, compact and quiet controls. */
    .hero-stage{gap:clamp(32px,5vh,55px)!important;}
    .hero-copy{max-width:min(100%,1060px);text-align:center;}
    .hero .eyebrow{margin-bottom:clamp(16px,2vw,25px)!important;line-height:1.5!important;}
    .hero h1#gatewayTitle{letter-spacing:.012em!important;line-height:1.16!important;}
    .hero-aside{gap:clamp(23px,3vw,34px)!important;}
    .hero-aside::before{width:72px!important;opacity:.65;}
    .hero-lead{max-width:680px!important;line-height:1.72!important;text-wrap:pretty;}
    .hero-actions{gap:12px!important;margin-top:4px!important;}
    .hero-actions .button{
      width:auto!important;
      min-height:38px!important;
      padding:8px 15px!important;
      font-weight:400!important;
      letter-spacing:.045em!important;
      line-height:1.4!important;
      box-shadow:none!important;
      transform:none;
    }
    .hero-actions .button:hover{transform:translateY(-1px);}
    .header-links{gap:9px!important;}
    .header-links a{
      min-height:32px!important;
      min-width:0!important;
      padding:6px 12px!important;
      font-weight:400!important;
      letter-spacing:.035em!important;
      box-shadow:none!important;
    }
    .menu-button{width:39px;height:39px;box-shadow:none!important;}
    .section-heading{margin-bottom:clamp(32px,4vw,52px)!important;}
    .pillar-grid,.featured-grid{gap:clamp(17px,2vw,26px)!important;}
    .pillar-card,.feature-card{box-shadow:0 3px 13px rgba(20,28,24,.045)!important;}
    .pillar-browse,.feature-open-button,.feature-pause-button,
    .viewer-tool,.viewer-full-link{
      min-height:36px!important;
      padding:8px 13px!important;
      letter-spacing:.035em!important;
      font-weight:400!important;
      box-shadow:none!important;
    }
    .ecosystem-category-link{padding:12px 14px!important;line-height:1.4!important;}
    .ecosystem-category-grid{gap:clamp(9px,1.25vw,16px)!important;}
    a:focus-visible,button:focus-visible{outline-offset:3px;}
    @media(max-width:560px){
      .hero h1#gatewayTitle{font-size:clamp(43px,10vw,56px)!important;line-height:1.18!important;}
      .hero-stage{gap:30px!important;}
      .hero-actions{width:min(100%,340px)!important;}
      .hero-actions .button{width:100%!important;min-height:40px!important;}
      .hero-lead{line-height:1.65!important;}
    }
    /* Edge-aligned gateway header only. The remaining page grid is unchanged. */
    .site-header .shell.header-inner{
      width:calc(100% - 22px);max-width:none;margin-inline:11px;
      padding-left:0;padding-right:0;column-gap:12px;
    }
    .site-header .header-actions{justify-self:end}
    @media(max-width:760px){
      .site-header .shell.header-inner{
        width:calc(100% - 14px);margin-inline:7px;
        padding-left:0;padding-right:0;column-gap:7px;
      }
    }

</style>
```

### Style 6 — id="vnv-enrolled-account-row-unification-20261108" (line 4010)

```html
<style id="vnv-enrolled-account-row-unification-20261108">
    /* Two identical three-column rows, sized to the original compact enrolled buttons. */
    .hero .hero-actions,
    .hero .enrolled-student-entry-row{
      box-sizing:border-box!important;
      display:grid!important;
      grid-template-columns:repeat(3,minmax(0,1fr))!important;
      align-items:stretch!important;
      justify-content:center!important;
      column-gap:7px!important;
      width:min(100%,760px)!important;
      max-width:760px!important;
      margin-left:auto!important;
      margin-right:auto!important;
    }
    /* Resolve the parent grid gap that was separating both button rows by 26–37px.
       Keep editorial breathing room only between copy and the matched buttons. */
    .hero .hero-aside{row-gap:0!important;}
    .hero .hero-aside::before{margin-bottom:clamp(23px,3vw,34px)!important;}
    /* Give the editorial copy breathing room; keep both button rows a single compact group. */
    .hero .hero-actions{
      row-gap:7px!important;
      margin-top:clamp(48px,5vw,60px)!important;
    }
    .hero .enrolled-student-entry-row{margin-top:3px!important;}
    .hero .hero-actions .vnv-hero-doorway,
    .hero .enrolled-student-entry-row .enrolled-student-entry{
      box-sizing:border-box!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      flex:none!important;
      width:100%!important;
      min-width:0!important;
      max-width:none!important;
      min-height:40px!important;
      margin:0!important;
      padding:7px 9px!important;
      border:1px solid #28332f!important;
      border-radius:7px!important;
      background:#28332f!important;
      color:#fff8e9!important;
      -webkit-text-fill-color:#fff8e9!important;
      text-align:center!important;
      text-decoration:none!important;
      font-size:16px!important;
      font-weight:400!important;
      line-height:1.25!important;
      letter-spacing:0!important;
      white-space:nowrap!important;
      text-wrap:nowrap!important;
    }
    .hero .hero-actions .vnv-hero-doorway:focus-visible,
    .hero .enrolled-student-entry-row .enrolled-student-entry:focus-visible{
      outline:3px solid #b48b45!important;
      outline-offset:3px!important;
    }
    @media(prefers-reduced-motion:reduce){
      .hero .hero-actions .vnv-hero-doorway,
      .hero .enrolled-student-entry-row .enrolled-student-entry{transition:none!important;}
      .hero .hero-actions .vnv-hero-doorway:hover,
      .hero .enrolled-student-entry-row .enrolled-student-entry:hover{transform:none!important;}
    }
    .hero .hero-actions .vnv-hero-doorway:hover,
    .hero .enrolled-student-entry-row .enrolled-student-entry:hover{
      background:#394a43!important;
      border-color:#394a43!important;
      color:#fff8e9!important;
    }
    @media(max-width:800px){
      .hero .hero-actions,
      .hero .enrolled-student-entry-row{
        grid-template-columns:minmax(0,1fr)!important;
        width:min(100%,340px)!important;
        max-width:340px!important;
      }
      .hero .hero-actions .vnv-hero-doorway,
      .hero .enrolled-student-entry-row .enrolled-student-entry{white-space:normal!important;text-wrap:balance!important;}
    }
  </style>
```

### Style 7 — id="vnv-directory-legibility-2026-11" (line 4090)

```html
<style id="vnv-directory-legibility-2026-11">
    #directory .ecosystem-category-grid {
      width:min(100%,1120px)!important;
      grid-template-columns:repeat(4,minmax(0,1fr))!important;
      gap:12px!important;
    }
    #directory .ecosystem-category-doorway {
      min-height:72px!important;
      grid-template-columns:minmax(0,1fr) 46px!important;
    }
    #directory .ecosystem-quick-doorway {
      grid-template-columns:minmax(0,1fr)!important;
    }
    #directory .ecosystem-category-link {
      min-width:0!important;
      white-space:normal!important;
      overflow-wrap:break-word!important;
      line-height:1.3!important;
      font-size:16px!important;
      padding:12px!important;
    }
    #directory .ecosystem-category-link::after,
    #directory .ecosystem-category-toggle,
    #directory .ecosystem-category-toggle span,
    #directory p,#directory small,#directory a,#directory button,#directory label,
    #directory input,#directory select,#directory .complete-index-badge,
    #directory .ecosystem-subgroup-title,#directory .ecosystem-panel-note {
      font-size:16px!important;
      line-height:1.45!important;
    }
    #directory .ecosystem-directory-heading h2,
    #directory h3,#directory h4 {font-size:clamp(20px,2.3vw,30px)!important;}
    #directory .ecosystem-directory-heading .kicker {font-size:clamp(25px,2.15vw,33px)!important;}
    #directory .ecosystem-category-toggle {min-width:46px!important;}
    #directory .ecosystem-category-link::after {margin-left:4px!important;}
    @media(max-width:1000px){
      #directory .ecosystem-category-grid {grid-template-columns:repeat(2,minmax(0,1fr))!important;}
    }
    @media(max-width:560px){
      #directory .ecosystem-category-grid {grid-template-columns:1fr!important;}
    }
  </style>
```

### Style 8 — id="vnv-complete-index-charcoal-2026-11" (line 4133)

```html
<style id="vnv-complete-index-charcoal-2026-11">
    #completePageIndex {
      border:2px solid #202724!important;
      border-radius:7px!important;
    }
    #completePageIndex .complete-index-card {
      background:#232b28!important;
      color:#f7f0e3!important;
      border:1px solid #151b19!important;
      border-radius:7px!important;
    }
    #completePageIndex .complete-index-card :is(strong,small,span,.complete-index-badge) {
      color:#f7f0e3!important;
    }
    #completePageIndex .complete-index-badge {
      background:#38413c!important;
      border:1px solid #bba16b!important;
    }
    #completePageIndex .complete-index-card:hover,
    #completePageIndex .complete-index-card:focus-visible {
      background:#36433d!important;
      border-color:#d6b777!important;
      outline-offset:2px;
    }
  </style>
```

### Style 9 — id="vnv-index-last-row-centering-2026-11" (line 4159)

```html
<style id="vnv-index-last-row-centering-2026-11">
    @media(min-width:950px) {
      #completePageIndex .complete-index-grid:has(> .complete-index-card:nth-child(3n + 2):last-child)
      > .complete-index-card:nth-last-child(-n + 2) {
        transform:translateX(calc(50% + 5px));
      }
    }
  </style>
```

### Style 10 — id="vnv-civic-readable-control-floor" (line 4167)

```html
<style id="vnv-civic-readable-control-floor">
/* Civic readable-control floor */
body{font-size:16px}
button,input,select,textarea{font-size:16px!important}
a.btn,.btn,.tool-button,.open-app,.copy-link{font-size:16px!important}
</style>
```

### Style 11 — id="vnv-complete-index-title-only-2026-11" (line 4173)

```html
<style id="vnv-complete-index-title-only-2026-11">
    /* TITLE-ONLY COMPLETE ECOSYSTEM INDEX CARDS
       Presentation only: catalog data, categories, filters and routes remain unchanged. */
    #completePageIndex .complete-index-card{
      min-height:78px!important;
      display:flex!important;
      align-items:center!important;
      justify-content:center!important;
      padding:18px 20px!important;
      text-align:center!important;
    }
    #completePageIndex .complete-index-card > strong{
      margin:0!important;
      color:#f7f0e3!important;
      font-family:Cinzel,Georgia,serif!important;
      font-size:18px!important;
      font-weight:444!important;
      line-height:1.35!important;
    }
  </style>
```

### Style 12 — main inline stylesheet (line 6254)

```html
<style>body{font-family:Georgia,serif;color:#18201c;margin:48px;line-height:1.6}small{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#806a42}h1{font-weight:444;font-size:33px}img{max-width:100%;max-height:420px;object-fit:contain;border:1px solid #ddd}a{color:#21493d;word-break:break-all}.crumb{font:11px Arial,sans-serif;color:#756d60;margin-bottom:24px}

</style>
```

### Style 13 — id="vnv-gateway-dual-ticker-stack" (line 6480)

```html
<style id="vnv-gateway-dual-ticker-stack">
  /* Keep the original 333 strip at 0; stack the page-link strip immediately below. */
  body > #vnvTickerAutoPopulate {
    top:var(--ticker-height,33px)!important;
  }
  body:has(> #vnvTickerAutoPopulate) > .site-header {
    top:calc(var(--ticker-height,33px) + var(--vnv-autopopulate-ticker-height,33px))!important;
  }
</style>
```

## Complete source: `assets/vervenveda-global-standard.css` (blob `0f2846e2de3a938c939e60ee6e8807726cf267db`)

```css
/*
  Verve N Veda · Shared Public Presentation Standard · v3
  Applies only to public GitHub-facing pages that opt in.
  Dormant STOS, archive, disabled, diagnostic, and source-snippet surfaces are intentionally excluded.
*/
:root{
  --vnv-radius:7px;
  --vnv-body-size:14px;
  --vnv-h1-size:44px;
  --vnv-h2-size:33px;
  --vnv-descriptor-size:24px;
  --vnv-breath:clamp(18px,3vw,33px);
}

html{font-size:16px}

body{
  font-size:var(--vnv-body-size)!important;
  line-height:1.65!important;
  text-align:center;
}

h1{
  font-size:var(--vnv-h1-size)!important;
  line-height:1.12!important;
  text-align:center;
  overflow-wrap:normal;
  word-break:normal;
  text-wrap:balance;
}

h2{
  font-size:var(--vnv-h2-size)!important;
  line-height:1.18!important;
  text-align:center;
  overflow-wrap:normal;
  word-break:normal;
  text-wrap:balance;
}

h3,
.descriptor,
.subtitle,
.subhead,
.hero-subtitle,
.section-intro,
.lead{
  max-width:900px;
  margin-inline:auto;
  font-size:var(--vnv-descriptor-size)!important;
  line-height:1.35!important;
  text-align:center;
  overflow-wrap:normal;
  word-break:normal;
  text-wrap:balance;
}

p,
li,
label,
input,
select,
textarea{
  font-size:var(--vnv-body-size);
}

button,
.button,
.btn,
[role="button"],
input[type="button"],
input[type="submit"],
input[type="reset"]{
  border-radius:var(--vnv-radius)!important;
}

[class*="card"],
.card,
.tile,
.doorway,
.panel,
.notice,
.callout{
  border-radius:var(--vnv-radius)!important;
  text-align:center;
}

[class*="card"] > .actions,
.card > .actions,
.tile > .actions,
.doorway > .actions,
.panel > .actions{
  margin-top:auto;
  justify-content:center;
}

.actions,
.hero-actions,
.button-row,
.button-group,
.cta-row,
.controls{
  display:flex;
  flex-wrap:wrap;
  justify-content:center;
  align-items:stretch;
  gap:11px;
}

.actions > a,
.actions > button,
.hero-actions > a,
.hero-actions > button,
.button-row > a,
.button-row > button,
.button-group > a,
.button-group > button,
.cta-row > a,
.cta-row > button{
  min-height:44px;
  flex:1 1 180px;
  max-width:280px;
  display:inline-flex;
  align-items:center;
  justify-content:center;
  text-align:center;
}

.card-grid,
.cards,
.resource-grid,
.portal-grid,
.tool-grid,
.app-grid,
.course-grid,
.directory-grid,
.ecosystem-category-grid,
.ecosystem-panel-grid,
.pillar-grid,
.feature-grid{
  align-items:stretch!important;
  grid-auto-rows:1fr;
  gap:var(--vnv-breath)!important;
}

.card-grid > *,
.cards > *,
.resource-grid > *,
.portal-grid > *,
.tool-grid > *,
.app-grid > *,
.course-grid > *,
.directory-grid > *,
.ecosystem-category-grid > *,
.ecosystem-panel-grid > *,
.pillar-grid > *,
.feature-grid > *{
  min-width:0;
  height:100%;
}

section,
.section,
main > article{
  scroll-margin-top:96px;
}

@media (max-width:720px){
  h1{font-size:clamp(36px,10vw,var(--vnv-h1-size))!important}
  h2{font-size:clamp(28px,8vw,var(--vnv-h2-size))!important}
  h3,
  .descriptor,
  .subtitle,
  .subhead,
  .hero-subtitle,
  .section-intro,
  .lead{font-size:clamp(20px,6vw,var(--vnv-descriptor-size))!important}
}


/* Complete ecosystem page index */
.complete-page-index{
  margin-top:33px;
  padding:33px;
  border:1px solid var(--line,rgba(18,23,19,.14));
  border-radius:var(--vnv-radius);
  background:var(--paper-bright,#fbf9f4);
  text-align:center;
}
.complete-page-index h3{margin:7px auto 10px;max-width:900px}
.complete-index-copy{max-width:900px;margin:0 auto 24px;color:var(--ink-soft,#30413d)}
.complete-index-controls{
  display:grid;
  grid-template-columns:minmax(240px,2fr) minmax(180px,1fr) minmax(220px,1fr);
  gap:11px;
  align-items:stretch;
  max-width:1100px;
  margin:0 auto 18px;
}
.complete-index-controls input,
.complete-index-controls select{
  width:100%;
  min-height:46px;
  padding:10px 12px;
  border:1px solid var(--line-strong,rgba(18,23,19,.25));
  border-radius:var(--vnv-radius);
  background:#fff;
  color:var(--ink,#080b0f);
  text-align:center;
}
.complete-index-status{
  min-height:24px;
  margin:0 auto 16px;
  color:var(--ink-soft,#30413d);
  font-size:12px;
}
.complete-index-grid{
  display:grid;
  grid-template-columns:repeat(3,minmax(0,1fr));
  gap:11px;
  align-items:stretch;
}
.complete-index-card{
  min-width:0;
  height:100%;
  display:flex;
  flex-direction:column;
  justify-content:center;
  gap:7px;
  padding:16px;
  border:1px solid var(--line,rgba(18,23,19,.14));
  border-radius:var(--vnv-radius);
  background:#fff;
  text-align:center;
}
.complete-index-card:hover,
.complete-index-card:focus-visible{
  border-color:var(--gold,#b48b45);
  box-shadow:0 8px 24px rgba(27,34,29,.08);
}
.complete-index-card strong{
  display:block;
  font-size:14px;
  line-height:1.35;
  overflow-wrap:normal;
  word-break:normal;
  text-wrap:balance;
}
.complete-index-card small{
  display:block;
  color:var(--ink-soft,#30413d);
  font-size:11px;
  line-height:1.45;
  overflow-wrap:anywhere;
}
.complete-index-badge{
  display:inline-flex;
  align-self:center;
  justify-content:center;
  padding:4px 8px;
  border:1px solid var(--line,rgba(18,23,19,.14));
  border-radius:var(--vnv-radius);
  color:var(--forest,#243d33);
  background:var(--paper,#f4f0e7);
  font-size:9px;
  letter-spacing:.08em;
  text-transform:uppercase;
}
.menu-page-results{margin-top:18px}
.menu-page-results .menu-group{margin-top:16px}
.menu-page-note{margin:10px 0 0;color:var(--ink-soft,#30413d);font-size:11px;line-height:1.5;text-align:center}


/* v3 balance pass — preserve page identity while enforcing the shared Verve N Veda rhythm. */
h1,h2,h3,
.descriptor,.subtitle,.subhead,.hero-subtitle,.section-intro,.lead,
button,.button,.btn,[role="button"]{
  hyphens:none;
  -webkit-hyphens:none;
  word-break:normal;
}

.section-heading,
.hero-copy,
.page-heading,
.intro-wrap{
  width:min(100%,960px);
  margin-inline:auto;
  text-align:center;
}

.complete-index-grid{
  grid-auto-rows:1fr;
  gap:var(--vnv-breath)!important;
}

.complete-index-card,
[class*="card"]{
  align-content:center;
  justify-items:center;
}

.actions > a,
.actions > button,
.hero-actions > a,
.hero-actions > button,
.button-row > a,
.button-row > button,
.button-group > a,
.button-group > button,
.cta-row > a,
.cta-row > button{
  padding-inline:16px;
}

@media(max-width:900px){
  .complete-index-controls{grid-template-columns:1fr 1fr}
  .complete-index-controls input{grid-column:1/-1}
  .complete-index-grid{grid-template-columns:repeat(2,minmax(0,1fr))}
}
@media(max-width:620px){
  .complete-page-index{padding:24px 14px}
  .complete-index-controls{grid-template-columns:1fr}
  .complete-index-controls input{grid-column:auto}
  .complete-index-grid{grid-template-columns:1fr}
}
```

## Complete source: `assets/vnv-global-standard.css` (blob `4a1639543b3a96d9d756f88e13b8e7a26d8db0a2`)

```css
/*
  Verve N Veda · Global Presentation Standard
  2026-10-14
  Public GitHub presentation layer only.
  STOS migration surfaces remain dormant and are not activated by this file.
*/
:root{
  --vnv-radius:7px;
  --vnv-h1:44px;
  --vnv-h2:33px;
  --vnv-descriptor:24px;
  --vnv-body:14px;
}
html body{font-size:var(--vnv-body)!important;line-height:1.65}
html body h1{font-size:var(--vnv-h1)!important;line-height:1.08!important;font-weight:400!important;text-align:center!important;text-wrap:balance;overflow-wrap:normal;word-break:normal}
html body h2{font-size:var(--vnv-h2)!important;line-height:1.16!important;font-weight:400!important;text-align:center!important;text-wrap:balance;overflow-wrap:normal;word-break:normal}
html body .descriptor,
html body .lede,
html body .hero-lede,
html body .hero-subtitle,
html body .subtitle,
html body .subhead,
html body .section-intro,
html body .intro{max-width:900px;margin-left:auto;margin-right:auto;font-size:var(--vnv-descriptor)!important;line-height:1.45!important;text-align:center!important;text-wrap:pretty}
html body button,
html body .button,
html body .btn,
html body [role="button"]{border-radius:var(--vnv-radius)!important;min-height:44px;display:inline-flex;align-items:center;justify-content:center;text-align:center;white-space:normal}
html body .card,
html body .site-card,
html body .feature-card,
html body .pillar-card,
html body .assessment-card,
html body .resource-card,
html body .course-card,
html body .metric,
html body .stat,
html body .tile,
html body .hall,
html body .trace-node{border-radius:var(--vnv-radius)!important;text-align:center!important;height:100%}
html body .grid,
html body .cards,
html body .card-grid,
html body .directory-grid,
html body .featured-grid,
html body .pillar-grid,
html body .hall-grid,
html body .trace-grid,
html body .metrics,
html body .resource-grid,
html body .course-grid{align-items:stretch!important;grid-auto-rows:1fr}
html body .grid>*,
html body .cards>*,
html body .card-grid>*,
html body .directory-grid>*,
html body .featured-grid>*,
html body .pillar-grid>*,
html body .hall-grid>*,
html body .trace-grid>*,
html body .metrics>*,
html body .resource-grid>*,
html body .course-grid>*{min-width:0;height:100%}
html body .actions,
html body .hero-actions,
html body .button-row,
html body .button-group{justify-content:center!important;align-items:stretch!important}
html body .actions>button,
html body .actions>.button,
html body .actions>.btn,
html body .hero-actions>button,
html body .hero-actions>.button,
html body .hero-actions>.btn{min-width:min(100%,180px)}
html body form,
html body label,
html body input,
html body textarea,
html body select{text-align:left}
```

## Complete source: `assets/vnv-ecosystem-menu.css` (blob `5d586bf85b201ed68f04210258b88fcc1ee40b91`)

```css
/* Verve N Veda · Global Ecosystem Hamburger
   Public GitHub navigation only. No STOS runtime dependency. */
.vnv-ecosystem-nav{
  position:fixed;
  top:max(14px,env(safe-area-inset-top));
  right:max(14px,env(safe-area-inset-right));
  z-index:2147482000;
  margin:0;
  font-family:"Brandon Grotesque","Avenir Next","Segoe UI",Arial,sans-serif;
  font-size:14px;
  color:#172331;
}
.vnv-ecosystem-nav summary{
  width:44px;
  height:44px;
  display:grid;
  place-items:center;
  margin-left:auto;
  padding:0;
  list-style:none;
  cursor:pointer;
  border:1px solid rgba(183,148,82,.72);
  border-radius:7px;
  color:#fff8e9;
  background:#202724;
  box-shadow:0 8px 24px rgba(8,21,34,.14);
  -webkit-tap-highlight-color:transparent;
}
.vnv-ecosystem-nav summary::-webkit-details-marker{display:none}
.vnv-ecosystem-nav summary::marker{content:""}
.vnv-ecosystem-nav summary:hover,
.vnv-ecosystem-nav summary:focus-visible{
  border-color:#80642f;
  outline:3px solid rgba(183,148,82,.28);
  outline-offset:3px;
}
.vnv-ecosystem-lines{
  width:21px;
  display:grid;
  gap:4px;
}
.vnv-ecosystem-lines span{
  display:block;
  width:21px;
  height:2px;
  border-radius:7px;
  background:#fff8e9;
  transition:transform .18s ease,opacity .18s ease;
}
.vnv-ecosystem-nav[open] .vnv-ecosystem-lines span:nth-child(1){
  transform:translateY(6px) rotate(45deg);
}
.vnv-ecosystem-nav[open] .vnv-ecosystem-lines span:nth-child(2){
  opacity:0;
}
.vnv-ecosystem-nav[open] .vnv-ecosystem-lines span:nth-child(3){
  transform:translateY(-6px) rotate(-45deg);
}
.vnv-ecosystem-dropdown{
  width:min(320px,calc(100vw - 28px));
  margin-top:7px;
  padding:14px;
  display:grid;
  gap:7px;
  border:1px solid rgba(16,34,56,.16);
  border-radius:7px;
  background:#fcf9f2;
  box-shadow:0 18px 44px rgba(8,21,34,.16);
}
.vnv-ecosystem-dropdown .vnv-ecosystem-kicker{
  margin:0 0 2px;
  text-align:center;
  color:#80642f;
  font-size:11px;
  font-weight:500;
  letter-spacing:.12em;
  text-transform:uppercase;
}
.vnv-ecosystem-dropdown a{
  min-height:44px;
  display:flex;
  align-items:center;
  justify-content:center;
  padding:10px 14px;
  text-align:center;
  text-decoration:none;
  color:#172331;
  border:1px solid rgba(16,34,56,.15);
  border-radius:7px;
  background:#fffdf8;
  font-size:14px;
  font-weight:500;
  line-height:1.35;
}
.vnv-ecosystem-dropdown a:hover,
.vnv-ecosystem-dropdown a:focus-visible{
  border-color:#b79452;
  background:#f5f0e4;
  outline:2px solid rgba(183,148,82,.25);
  outline-offset:2px;
}
.vnv-ecosystem-dropdown a.vnv-ecosystem-primary{
  color:#fffdf8;
  border-color:#102238;
  background:#102238;
}
.vnv-ecosystem-dropdown a.vnv-ecosystem-primary:hover,
.vnv-ecosystem-dropdown a.vnv-ecosystem-primary:focus-visible{
  background:#1a314b;
}
@media (prefers-color-scheme:dark){
  .vnv-ecosystem-nav{color:#eee5d5}
  .vnv-ecosystem-nav summary{background:#202724;border-color:rgba(232,225,209,.22)}
  .vnv-ecosystem-dropdown{background:#101d2a;border-color:rgba(232,225,209,.22)}
  .vnv-ecosystem-lines span{background:#eee5d5}
  .vnv-ecosystem-dropdown a{color:#eee5d5;background:#142536;border-color:rgba(232,225,209,.16)}
  .vnv-ecosystem-dropdown a:hover,
  .vnv-ecosystem-dropdown a:focus-visible{background:#1a3144}
  .vnv-ecosystem-dropdown a.vnv-ecosystem-primary{background:#b79452;border-color:#b79452;color:#101820}
}
@media (max-width:520px){
  .vnv-ecosystem-nav{
    top:max(8px,env(safe-area-inset-top));
    right:max(8px,env(safe-area-inset-right));
  }
  .vnv-ecosystem-dropdown{width:min(300px,calc(100vw - 16px))}
}
@media print{.vnv-ecosystem-nav{display:none!important}}
@media (prefers-reduced-motion:reduce){
  .vnv-ecosystem-lines span{transition:none}
}


/* Canonical directory enhancement · 2026-10-14 */
.vnv-ecosystem-dropdown{
  width:min(420px,calc(100vw - 28px));
  max-height:min(78vh,680px);
  overflow:auto;
  overscroll-behavior:contain;
}
.vnv-ecosystem-search-wrap{
  display:grid;
  gap:7px;
  margin:2px 0 4px;
}
.vnv-ecosystem-search{
  width:100%;
  min-height:44px;
  padding:10px 12px;
  border:1px solid rgba(16,34,56,.18);
  border-radius:7px;
  background:#fffdf8;
  color:#172331;
  font:500 14px/1.35 "Brandon Grotesque","Avenir Next","Segoe UI",Arial,sans-serif;
  text-align:center;
}
.vnv-ecosystem-search:focus-visible{
  border-color:#b79452;
  outline:2px solid rgba(183,148,82,.25);
  outline-offset:2px;
}
.vnv-ecosystem-status{
  margin:0;
  color:#59646d;
  font-size:11px;
  line-height:1.45;
  text-align:center;
}
.vnv-ecosystem-results{
  display:grid;
  gap:11px;
  margin-top:2px;
}
.vnv-ecosystem-group{
  display:grid;
  gap:7px;
  padding-top:7px;
  border-top:1px solid rgba(16,34,56,.10);
}
.vnv-ecosystem-group:first-child{
  padding-top:0;
  border-top:0;
}
.vnv-ecosystem-group-title{
  margin:0;
  color:#80642f;
  font-size:11px;
  font-weight:600;
  letter-spacing:.08em;
  text-align:center;
  text-transform:uppercase;
}
.vnv-ecosystem-result{
  min-height:44px;
  display:flex;
  flex-direction:column;
  align-items:center;
  justify-content:center;
  gap:3px;
  padding:9px 12px;
  text-align:center;
}
.vnv-ecosystem-result strong{
  font-size:14px;
  font-weight:600;
  line-height:1.25;
}
.vnv-ecosystem-result small{
  color:#66717a;
  font-size:10.5px;
  font-weight:400;
  line-height:1.35;
}
.vnv-ecosystem-result[aria-current="page"]{
  border-color:#b79452;
  background:#f5f0e4;
}
.vnv-ecosystem-empty{
  margin:7px 0 2px;
  color:#59646d;
  font-size:12px;
  line-height:1.5;
  text-align:center;
}
@media (prefers-color-scheme:dark){
  .vnv-ecosystem-search{
    color:#eee5d5;
    background:#142536;
    border-color:rgba(232,225,209,.18);
  }
  .vnv-ecosystem-status,
  .vnv-ecosystem-result small,
  .vnv-ecosystem-empty{color:#b8c2c9}
  .vnv-ecosystem-group{border-top-color:rgba(232,225,209,.11)}
  .vnv-ecosystem-result[aria-current="page"]{background:#1a3144}
}
@media(max-width:520px){
  .vnv-ecosystem-dropdown{width:min(340px,calc(100vw - 16px));max-height:82vh}
}


/* Shared JS drawer presentation · v1.2.0
   Canonical presentation for assets/vnv-ecosystem-menu.js.
   The legacy <details> rules above remain for backward compatibility while
   repository pages migrate to the shared runtime. */

      #vnvEcosystemMenuButton{
        min-height:34px;display:inline-flex;align-items:center;justify-content:center;gap:8px;
        padding:6px 10px;border:1px solid rgba(49,73,62,.24);border-radius:7px;
        color:#fff8e9!important;background:#202724!important;
        box-shadow:none;font:500 10px/1.1 "Avenir Next","Segoe UI",Arial,sans-serif;
        letter-spacing:.075em;text-transform:uppercase;white-space:nowrap;cursor:pointer;
      }
      #vnvEcosystemMenuButton:hover,#vnvEcosystemMenuButton:focus-visible{background:#344148!important;color:#fff8e9!important;border-color:#b48b45;outline:2px solid #b48b45;outline-offset:2px}
      #vnvEcosystemMenuButton.vnv-eco-text-only{
        min-height:34px;padding:6px 9px;letter-spacing:.03em;
        white-space:normal;text-align:center;
      }
      #vnvEcosystemMenuButton .vnv-eco-lines{width:14px;height:10px;display:grid;align-content:space-between}
      #vnvEcosystemMenuButton .vnv-eco-lines::before,#vnvEcosystemMenuButton .vnv-eco-lines::after,#vnvEcosystemMenuButton .vnv-eco-lines span{
        content:"";display:block;height:1px;background:#fff8e9!important
      }
      #vnvEcosystemMenuOverlay{
        position:fixed;inset:0;z-index:2147483500;display:grid;justify-items:end;overflow:hidden;contain:layout paint;
        visibility:hidden;opacity:0;background:rgba(9,15,13,.34);backdrop-filter:blur(4px);
        transition:opacity .18s ease,visibility .18s ease
      }
      #vnvEcosystemMenuOverlay[data-open="true"]{visibility:visible;opacity:1}
      #vnvEcosystemMenuOverlay:not([data-open="true"]) #vnvEcosystemMenuDrawer{display:none}
      #vnvEcosystemMenuDrawer{
        width:min(92vw,420px);max-width:100vw;height:100%;overflow:auto;box-sizing:border-box;padding:24px 20px 30px;
        transform:translateX(102%);transition:transform .2s ease;
        color:#202d28;background:#fbf8ef;border-left:1px solid rgba(49,73,62,.18);
        box-shadow:-20px 0 54px rgba(20,30,25,.15)
      }
      #vnvEcosystemMenuOverlay[data-open="true"] #vnvEcosystemMenuDrawer{transform:none}
      .vnv-eco-top{display:flex;align-items:flex-start;justify-content:space-between;gap:14px}
      .vnv-eco-kicker{margin:0 0 5px;color:#91733f;font:500 10px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.13em;text-transform:uppercase}
      #vnvEcosystemMenuDrawer h2{margin:0;color:#233b32;font:500 29px/1.05 Georgia,"Times New Roman",serif}
      .vnv-eco-close{width:38px;height:38px;flex:0 0 38px;border:1px solid rgba(49,73,62,.22);border-radius:7px;background:#fff;color:#243a32;font-size:21px;cursor:pointer}
      .vnv-eco-intro{margin:13px 0 0;color:#69736e;font:400 12px/1.6 "Avenir Next","Segoe UI",Arial,sans-serif}
      #vnvEcosystemMenuSearch{width:100%;min-height:42px;margin:17px 0 5px;padding:0 12px;border:1px solid rgba(49,73,62,.22);border-radius:7px;background:#fff;color:#202d28;font:400 13px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif}
      #vnvEcosystemMenuStatus{min-height:20px;margin:6px 0 0;color:#7b837f;font:400 10px/1.45 "Avenir Next","Segoe UI",Arial,sans-serif}
      .vnv-eco-home{display:flex;justify-content:center;margin:12px 0 2px}
      .vnv-eco-home a{min-height:34px;display:inline-flex;align-items:center;justify-content:center;padding:7px 11px;border:1px solid rgba(145,115,63,.28);border-radius:7px;color:#6f5935;background:#fff;text-decoration:none;font:500 10px/1.1 "Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.06em;text-transform:uppercase}
      .vnv-eco-group{margin:20px 0 7px;color:#92743f;font:500 10px/1.2 "Avenir Next","Segoe UI",Arial,sans-serif;letter-spacing:.1em;text-transform:uppercase}
      .vnv-eco-list{display:grid;gap:6px}
      .vnv-eco-link{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:9px;align-items:center;padding:10px 11px;border:1px solid rgba(49,73,62,.12);border-radius:7px;color:#25362f;background:#fff;text-decoration:none}
      .vnv-eco-link:hover,.vnv-eco-link:focus-visible{border-color:rgba(145,115,63,.46);background:#fffefb}
      .vnv-eco-link strong{display:block;font:500 12px/1.3 "Avenir Next","Segoe UI",Arial,sans-serif}
      .vnv-eco-link small{display:block;margin-top:2px;color:#7b837f;font:400 9px/1.35 "Avenir Next","Segoe UI",Arial,sans-serif}
      .vnv-eco-arrow{color:#9a7b43;font-size:12px}
      #vnvEcosystemMenuButton.vnv-eco-fixed{position:fixed;right:12px;top:12px;z-index:2147482500;box-shadow:0 6px 18px rgba(20,30,25,.08)}
      @media(max-width:620px){
        #vnvEcosystemMenuButton{font-size:9px;padding:6px 8px}
        #vnvEcosystemMenuButton .vnv-eco-label{display:none}
        #vnvEcosystemMenuButton .vnv-eco-lines{width:17px;height:12px}
        #vnvEcosystemMenuDrawer{width:min(94vw,390px);padding:20px 15px 26px}
      }
      @media(prefers-reduced-motion:reduce){#vnvEcosystemMenuOverlay,#vnvEcosystemMenuDrawer{transition:none!important}}
      @media print{#vnvEcosystemMenuButton,#vnvEcosystemMenuOverlay{display:none!important}}
    

/* Explicit header slot: icon-only, normal-flow placement.
   Fixed positioning is reserved for pages without a recognized header slot. */
[data-vnv-ecosystem-slot]{
  display:inline-flex;
  align-items:center;
  justify-content:center;
  justify-self:end;
}
[data-vnv-ecosystem-slot] #vnvEcosystemMenuButton.vnv-eco-icon-only{
  width:44px;
  height:44px;
  min-height:44px;
  padding:0;
  border-radius:7px;
}
@media(max-width:560px){
  [data-vnv-ecosystem-slot] #vnvEcosystemMenuButton.vnv-eco-icon-only{
    width:40px;
    height:40px;
    min-height:40px;
  }
}
```

## Complete source: `assets/vnv-ecosystem-menu.js` (blob `4300a012c8eb0102d0385dec07125c8857d54961`)

```javascript
(() => {
  "use strict";

  const CURRENT_SCRIPT_URL=document.currentScript?.src||"https://vervenveda.com/assets/vnv-ecosystem-menu.js";
  const IDS = Object.freeze({
    button:"vnvEcosystemMenuButton",
    overlay:"vnvEcosystemMenuOverlay",
    drawer:"vnvEcosystemMenuDrawer",
    search:"vnvEcosystemMenuSearch",
    content:"vnvEcosystemMenuContent",
    status:"vnvEcosystemMenuStatus",
    style:"vnvEcosystemMenuStyles"
  });
  const publicHost=/^(?:www\.)?vervenveda\.com$|^vervenveda\.github\.io$/i.test(location.hostname||"");
  const PUBLIC_ROOT=publicHost ? location.origin+"/" : "https://vervenveda.com/";
  const REGISTRY=PUBLIC_ROOT+"ecosystem/master-ecosystem-directory.json";
  const HOME=PUBLIC_ROOT;
  const CATEGORY_ORDER=["education","research","news","weather","creative","professional","games","health","finance","civic","environmental","communication","gateway"];
  const CATEGORY_LABELS={
    education:"Education",research:"Research & Discovery",news:"News & Verification",
    weather:"Weather & Space",creative:"Art, Music & Creativity",professional:"Professional Tools",
    games:"Games & Play",health:"Health & Wellness",finance:"Finance",civic:"Civic & Community",
    environmental:"Earth & Environment",communication:"Communication",gateway:"Main Gateways"
  };

  if(document.getElementById(IDS.button) || document.getElementById(IDS.overlay)) return;
  if(document.getElementById("menuOverlay") && document.getElementById("menuButton") && /public gateway/i.test(document.title||"")) return;

  let entries=[];
  let catalogParts=[];
  let catalogPages=[];
  let catalogLoaded=false;
  let catalogLoading=null;
  let catalogUnavailable=false;
  let ecosystemCounts={repositories:0,pages:0};
  let lastFocus=null;
  let previousBodyOverflow=null;

  const esc=(value)=>String(value??"").replace(/[&<>"']/g,ch=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[ch]));
  const safeUrl=(value)=>{
    try{
      const url=new URL(value,location.href);
      if(url.protocol!=="https:") return null;
      const allowed=["vervenveda.com","www.vervenveda.com","vervenveda.github.io","artist1970.github.io","jenniferpearl2028.github.io"];
      if(!allowed.includes(url.hostname)) return null;
      return url.href;
    }catch{return null}
  };

  function installStyle(){
    // Load the existing menu CSS on lesson pages too, not only site homepages.
    if(document.getElementById(IDS.style)||
       document.querySelector('link[rel="stylesheet"][href*="vnv-ecosystem-menu.css"]'))return;
    const link=document.createElement("link");
    link.id=IDS.style;
    link.rel="stylesheet";
    link.href=new URL("vnv-ecosystem-menu.css",CURRENT_SCRIPT_URL).href;
    (document.head||document.documentElement).appendChild(link);
  }

  function mountButton(){
    const button=document.createElement("button");
    button.id=IDS.button;
    button.type="button";
    button.setAttribute("aria-expanded","false");
    button.setAttribute("aria-controls",IDS.overlay);
    button.setAttribute("aria-label","Open Verve N Veda ecosystem directory");
    const ecosystemSlot=document.querySelector("[data-vnv-ecosystem-slot]");
    const nativeMenu=document.querySelector('#menuButton, .menu-button[aria-controls], .hamburger[aria-controls], [data-menu-toggle]');
    if(ecosystemSlot){
      button.innerHTML='<span class="vnv-eco-lines" aria-hidden="true"><span></span></span>';
      button.classList.add("vnv-eco-icon-only");
      button.title="Ecosystem Directory";
    }else{
      button.innerHTML=nativeMenu
        ? '<span class="vnv-eco-label">Ecosystem Directory</span>'
        : '<span class="vnv-eco-lines" aria-hidden="true"><span></span></span><span class="vnv-eco-label">Ecosystem</span>';
      if(nativeMenu)button.classList.add("vnv-eco-text-only");
    }

    const target=
      ecosystemSlot ||
      document.querySelector("[data-vnv-global-tools]") ||
      document.querySelector(".header-actions") ||
      document.querySelector(".nav-utilities") ||
      document.querySelector(".topbar-inner") ||
      document.querySelector(".site-header .nav") ||
      document.querySelector(".site-header .header-inner") ||
      document.querySelector("header nav");

    if(target) target.append(button);
    else {button.classList.add("vnv-eco-fixed");document.body.append(button);}
    return button;
  }

  function mountDrawer(){
    const overlay=document.createElement("div");
    overlay.id=IDS.overlay;
    overlay.dataset.open="false";
    overlay.setAttribute("aria-hidden","true");
    // The optional directory must remain hidden even if its stylesheet fails.
    overlay.style.display="none";
    overlay.innerHTML=`
      <aside id="${IDS.drawer}" role="dialog" aria-modal="true" aria-labelledby="vnvEcosystemMenuTitle">
        <div class="vnv-eco-top">
          <div><p class="vnv-eco-kicker">One Connected Public Campus</p><h2 id="vnvEcosystemMenuTitle">Ecosystem Directory</h2></div>
          <button class="vnv-eco-close" type="button" aria-label="Close ecosystem directory">×</button>
        </div>
        <p class="vnv-eco-intro">Browse curated doorways or search every synchronized public page across Verve N Veda.</p>
        <div class="vnv-eco-home"><a href="${HOME}">Verve N Veda Home</a></div>
        <label style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)" for="${IDS.search}">Search the ecosystem</label>
        <input id="${IDS.search}" type="search" autocomplete="off" placeholder="Search education, art, news, tools…">
        <p id="${IDS.status}" role="status" aria-live="polite">Loading public directory…</p>
        <div id="${IDS.content}"></div>
      </aside>`;
    document.body.append(overlay);
    return overlay;
  }

  function render(query=""){
    const box=document.getElementById(IDS.content);
    const status=document.getElementById(IDS.status);
    if(!box)return;
    const q=String(query||"").trim().toLowerCase();

    if(q.length>=2 && !catalogLoaded && !catalogUnavailable){
      status.textContent="Searching the synchronized public page catalog…";
      ensureCatalog().then(()=>render(query)).catch(()=>{
        catalogUnavailable=true;
        render(query);
      });
      return;
    }

    if(q.length>=2 && catalogLoaded){
      const matches=catalogPages.filter(page=>
        [page.title,page.category,page.repo,page.path,page.source]
          .join(" ").toLowerCase().includes(q)
      ).slice(0,60);
      box.innerHTML=matches.length
        ? '<section><h3 class="vnv-eco-group">Complete Public Index</h3><div class="vnv-eco-list">'+matches.map(page=>
            '<a class="vnv-eco-link" href="'+esc(page.url)+'"><span><strong>'+esc(page.title||page.path)+'</strong><small>'+esc((page.source||page.repo||"Verve N Veda")+' · '+(page.path||""))+'</small></span><span class="vnv-eco-arrow" aria-hidden="true">↗</span></a>'
          ).join("")+'</div></section>'
        : '<p class="vnv-eco-intro">No synchronized public page matches this search.</p>';
      status.textContent=matches.length
        ? "Showing "+matches.length+" of "+ecosystemCounts.pages.toLocaleString()+" synchronized public pages."
        : "No match across "+ecosystemCounts.pages.toLocaleString()+" synchronized public pages.";
      return;
    }

    const filtered=entries.filter(e=>!q || [e.title,e.category,e.type,e.description].join(" ").toLowerCase().includes(q));
    const groups=new Map();
    filtered.forEach(e=>{
      const key=e.category||"gateway";
      if(!groups.has(key))groups.set(key,[]);
      groups.get(key).push(e);
    });
    const order=[...CATEGORY_ORDER,...[...groups.keys()].filter(k=>!CATEGORY_ORDER.includes(k))];
    box.innerHTML=order.filter(k=>groups.has(k)).map(k=>{
      const list=groups.get(k).sort((a,b)=>a.title.localeCompare(b.title));
      return '<section><h3 class="vnv-eco-group">'+esc(CATEGORY_LABELS[k]||k)+'</h3><div class="vnv-eco-list">'+list.map(e=>
        '<a class="vnv-eco-link" href="'+esc(e.url)+'"><span><strong>'+esc(e.title)+'</strong><small>'+esc(e.type||"public doorway")+'</small></span><span class="vnv-eco-arrow" aria-hidden="true">↗</span></a>'
      ).join("")+'</div></section>';
    }).join("");
    const repoText=ecosystemCounts.repositories ? " · "+ecosystemCounts.repositories+" repositories" : "";
    const pageText=ecosystemCounts.pages ? " · "+ecosystemCounts.pages.toLocaleString()+" searchable pages" : "";
    status.textContent=catalogUnavailable&&q.length>=2 ? "Full page catalog unavailable; showing matching public doorways." : filtered.length+" curated "+(filtered.length===1?"doorway":"doorways")+repoText+pageText+".";
  }

  async function ensureCatalog(){
    if(catalogLoaded)return catalogPages;
    if(catalogLoading)return catalogLoading;
    catalogLoading=(async()=>{
      const parts=catalogParts.length ? catalogParts : [
        "/registry/ecosystem-pages-a.json",
        "/registry/ecosystem-pages-b.json"
      ];
      const settled=await Promise.allSettled(parts.map(async part=>{
        const url=new URL(part,PUBLIC_ROOT).href;
        const response=await fetch(url,{cache:"no-store",credentials:"same-origin"});
        if(!response.ok)throw new Error("HTTP "+response.status);
        const data=await response.json();
        return Array.isArray(data?.pages)?data.pages:[];
      }));
      const seen=new Set();
      catalogPages=settled
        .filter(result=>result.status==="fulfilled")
        .flatMap(result=>result.value)
        .filter(page=>{
          const url=safeUrl(page?.url);
          if(!url)return false;
          const key=String(page.repo||"").toLowerCase()+"|"+String(page.path||"").toLowerCase();
          if(seen.has(key))return false;
          seen.add(key);
          page.url=url;
          return true;
        });
      if(!catalogPages.length)throw new Error("catalog unavailable");
      catalogLoaded=true;
      catalogUnavailable=false;
      return catalogPages;
    })().finally(()=>{catalogLoading=null});
    return catalogLoading;
  }

  async function load(){
    const status=document.getElementById(IDS.status);
    try{
      const response=await fetch(REGISTRY,{cache:"no-store",credentials:"same-origin"});
      if(!response.ok)throw new Error("HTTP "+response.status);
      const data=await response.json();
      if(!Array.isArray(data?.entries))throw new Error("entries missing");
      catalogParts=Array.isArray(data?.pageCatalog?.parts)
        ? data.pageCatalog.parts.filter(part=>/^\/registry\/[A-Za-z0-9._/-]+\.json$/i.test(String(part||"")))
        : [];
      ecosystemCounts={
        repositories:Number(data?.pageCatalog?.repositoryCount)||0,
        pages:Number(data?.pageCatalog?.publicPageCount)||0
      };
      entries=data.entries.filter(e=>{
        if(!e||e.directoryVisible!==true||e.access!=="free-public"||e.status!=="active"||!e.title)return false;
        const url=safeUrl(e.url);
        if(!url)return false;
        e.url=url;
        return true;
      });
      render("");
    }catch(err){
      entries=[
        {title:"Khaemenes Academy",url:"/Khaemenes_Academy.github.io/",category:"education",type:"gateway"},
        {title:"PLERA Search",url:"/PLERASearch.github.io/",category:"research",type:"gateway"},
        {title:"The Verifier",url:"/theverifier.github.io/",category:"news",type:"gateway"},
        {title:"Bazaar Art",url:"/bazaarart.github.io/",category:"creative",type:"gateway"},
        {title:"Aurora",url:"/aurora.github.io/",category:"health",type:"gateway"},
        {title:"333 Network",url:"/333.github.io/",category:"communication",type:"network"}
      ].map(e=>({...e,url:new URL(e.url,location.origin).href}));
      render("");
      if(status)status.textContent="Core ecosystem gateways available; full directory is temporarily unavailable.";
    }
  }

  function open(){
    lastFocus=document.activeElement;
    const overlay=document.getElementById(IDS.overlay);
    const button=document.getElementById(IDS.button);
    overlay.style.display="grid";
    overlay.dataset.open="true";
    overlay.setAttribute("aria-hidden","false");
    button.setAttribute("aria-expanded","true");
    previousBodyOverflow=document.body.style.overflow;
    document.body.style.overflow="hidden";
    setTimeout(()=>document.getElementById(IDS.search)?.focus(),0);
  }
  function close(){
    const overlay=document.getElementById(IDS.overlay);
    const button=document.getElementById(IDS.button);
    overlay.dataset.open="false";
    overlay.setAttribute("aria-hidden","true");
    overlay.style.display="none";
    button.setAttribute("aria-expanded","false");
    if(previousBodyOverflow!==null)document.body.style.overflow=previousBodyOverflow;
    previousBodyOverflow=null;
    if(lastFocus?.focus)lastFocus.focus();
  }
  function bind(){
    const button=document.getElementById(IDS.button);
    const overlay=document.getElementById(IDS.overlay);
    const closeButton=overlay.querySelector(".vnv-eco-close");
    button.addEventListener("click",open);
    closeButton.addEventListener("click",close);
    overlay.addEventListener("click",e=>{if(e.target===overlay)close();});
    document.getElementById(IDS.search).addEventListener("input",e=>render(e.target.value));
    document.addEventListener("keydown",e=>{
      if(e.key==="Escape"&&overlay.dataset.open==="true")close();
      if(e.key==="Tab"&&overlay.dataset.open==="true"){
        const focusable=[...overlay.querySelectorAll('a[href],button,input,[tabindex]:not([tabindex="-1"])')].filter(el=>!el.disabled);
        if(!focusable.length)return;
        const first=focusable[0],last=focusable[focusable.length-1];
        if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
        else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
      }
    });
  }

  function start(){
    if(!document.body)return;
    if(document.getElementById(IDS.button) || document.getElementById(IDS.overlay)) return;
    if(document.getElementById("menuOverlay") && document.getElementById("menuButton") && /public gateway/i.test(document.title||"")) return;
    if(window.__VNV_ECOSYSTEM_MENU_MOUNTING__) return;
    window.__VNV_ECOSYSTEM_MENU_MOUNTING__=true;
    try{
      installStyle();
      mountButton();
      mountDrawer();
      bind();
      load();
    }finally{
      window.__VNV_ECOSYSTEM_MENU_MOUNTING__=false;
    }
  }
  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",start,{once:true});
  else start();

  window.VNVEcosystemMenu=Object.freeze({version:"1.2.0",open,close});
})();
```

## Integrity and reference

- Full `index.html` CSS source blob `2031ea54ca312b379a99c18b0f33c5ffe8807b28`.
- 13 inline stylesheet blocks identified in this snapshot; do not treat selectors repeating across different breakpoints as automatically redundant.
- Global standard files are loaded in addition to inline styles; shared toolbar and translator also inject scoped CSS at runtime.
- Footer HTML and complete directory controller appear in Volume 03, not duplicated here.
