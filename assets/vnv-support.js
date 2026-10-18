(() => {
  "use strict";

  const PAYMENT_URL = "https://buy.stripe.com/aFa8wQ5xf9Scf65caT4AU0s";
  const ECOSYSTEM_MENU_URL = "https://vervenveda.com/assets/vnv-ecosystem-menu.js";
  const SUPPORT_ID = "vnv-global-support";
  const TOP_ID = "vnv-global-support-top";

  if(!document.getElementById("vnvEcosystemMenuButton") && !document.getElementById("menuOverlay")){
    try{
      const menuScript=document.createElement("script");
      menuScript.src=ECOSYSTEM_MENU_URL;
      menuScript.defer=true;
      menuScript.dataset.vnvEcosystemMenu="1";
      (document.head||document.documentElement).appendChild(menuScript);
    }catch{}
  }

  if (document.getElementById(SUPPORT_ID) || document.documentElement.hasAttribute("data-vnv-support-off")) return;

  const path = location.pathname.toLowerCase();
  const title = (document.title || "").toLowerCase();
  const lessonLike =
    /(^|\/)(lesson|lessons)(\/|$)/.test(path) ||
    /(^|\/)(quiz|quizzes|exam|exams|assessment|assessments)(\/|$)/.test(path) ||
    /\b(lesson|quiz|exam|assessment)\b/.test(title);

  if (lessonLike && !document.documentElement.hasAttribute("data-vnv-support-force")) return;

  const childFacing =
    /khaemenes_(preschool|kindergarden)\.github\.io/i.test(path) ||
    /\b(preschool|crech[eè]|kinder garden|kindergarten)\b/i.test(title);

  const style = document.createElement("style");
  style.textContent = `
    #${TOP_ID}{
      position:fixed;right:14px;top:14px;z-index:2147483000;
      min-height:33px;display:inline-flex;align-items:center;justify-content:center;
      padding:7px 11px;border:1px solid rgba(36,61,51,.28);border-radius:7px;
      color:#15251f;background:rgba(251,249,244,.94);
      box-shadow:0 6px 18px rgba(27,34,29,.08);
      font:444 10px/1.1 "Brandon Grotesque","Avenir Next",Avenir,"Segoe UI",Arial,sans-serif;
      letter-spacing:.08em;text-transform:uppercase;text-decoration:none;white-space:nowrap;
      backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);
    }
    #${TOP_ID}.vnv-support-top-inline{
      position:static;right:auto;top:auto;z-index:auto;
      margin:0;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none;
      background:rgba(255,255,255,.56);
    }
    #${TOP_ID}:hover,#${TOP_ID}:focus-visible{background:#fff;border-color:#243d33;transform:translateY(-1px)}
    #${SUPPORT_ID}{
      width:min(calc(100% - 32px),980px);margin:55px auto 28px;padding:28px;
      border:1px solid rgba(18,23,19,.14);border-radius:7px;
      color:#080b0f;background:linear-gradient(135deg,#fff,#f8f4e9);
      box-shadow:0 16px 40px rgba(27,34,29,.07);
      font-family:"Brandon Grotesque","Avenir Next",Avenir,"Segoe UI",Arial,sans-serif;
      text-align:center;
    }
    #${SUPPORT_ID} .vnv-support-kicker{
      margin:0 0 7px;color:#806a42;font-family:Cinzel,Georgia,serif;
      font-size:11px;font-weight:444;letter-spacing:.15em;text-transform:uppercase;
    }
    #${SUPPORT_ID} h2{margin:0 auto 10px;max-width:760px;font:444 26px/1.15 Cinzel,Georgia,serif;color:#15251f}
    #${SUPPORT_ID} p{max-width:760px;margin:8px auto;color:#30413d;font-size:14px;line-height:1.65}
    #${SUPPORT_ID} .vnv-support-button{
      display:inline-flex;align-items:center;justify-content:center;min-height:39px;margin-top:12px;padding:9px 14px;
      border:1px solid #243d33;border-radius:7px;color:#fff;background:#243d33;
      font-size:11px;font-weight:444;letter-spacing:.06em;text-transform:uppercase;text-decoration:none;
    }
    #${SUPPORT_ID} small{display:block;max-width:720px;margin:11px auto 0;color:#66716c;font-size:11px;line-height:1.5}
    .vnv-support-ticker-link{
      display:inline-flex;align-items:center;justify-content:center;flex:0 0 auto;
      min-height:25px;padding:4px 10px;border:1px solid rgba(231,215,182,.3);border-radius:7px;
      color:inherit;background:rgba(255,255,255,.05);
      font:444 10px/1.2 "Brandon Grotesque","Avenir Next",Avenir,"Segoe UI",Arial,sans-serif;
      letter-spacing:.08em;text-transform:uppercase;text-decoration:none;white-space:nowrap;
    }
    .vnv-support-ticker-link:hover,.vnv-support-ticker-link:focus-visible{text-decoration:underline;text-underline-offset:3px}
    @media(max-width:700px){
      #${TOP_ID}{right:8px;top:8px;font-size:9px;padding:7px 9px}
      #${SUPPORT_ID}{width:min(calc(100% - 22px),980px);padding:22px 16px}
      #${SUPPORT_ID} h2{font-size:22px}
    }
  `;
  document.head.appendChild(style);

  const section = document.createElement("section");
  section.id = SUPPORT_ID;
  section.setAttribute("aria-labelledby", "vnvGlobalSupportTitle");
  section.innerHTML = childFacing ? `
    <p class="vnv-support-kicker">Grown-Up Support</p>
    <h2 id="vnvGlobalSupportTitle">Learning stays free for every child.</h2>
    <p>Parents, caregivers, and other grown-ups can voluntarily support the art, stories, games, repairs, accessibility work, and new learning experiences that keep Verve N Veda and Khaemenes Academy growing.</p>
    <a class="vnv-support-button" href="${PAYMENT_URL}" target="_blank" rel="noopener noreferrer">Grown-Ups · Support with Stripe ↗</a>
    <small>Children never need to donate. Secure payment is handled by Stripe. Contributions are voluntary, are not required for access, and are separate from campaign contributions. No tax-deductibility or charitable status is represented.</small>
  ` : `
    <p class="vnv-support-kicker">Support Free Access</p>
    <h2 id="vnvGlobalSupportTitle">Everything here is free. Voluntary support helps keep it that way.</h2>
    <p>Verve N Veda and Khaemenes Academy provide free learning, tools, games, research, art, public resources, and continued development. If this work helps you or your family, you can support its maintenance and growth.</p>
    <a class="vnv-support-button" href="${PAYMENT_URL}" target="_blank" rel="noopener noreferrer">Support with Stripe ↗</a>
    <small>Secure payment is handled by Stripe. Contributions are voluntary, are not required for access, and are separate from campaign contributions. No tax-deductibility or charitable status is represented.</small>
  `;

  const footer = document.querySelector("footer");
  if (footer?.parentNode) footer.parentNode.insertBefore(section, footer);
  else document.body.appendChild(section);

  const top = document.createElement("a");
  top.id = TOP_ID;
  top.href = "#"+SUPPORT_ID;
  top.textContent = childFacing ? "Grown-Ups · Support" : "Support Free Access";
  top.setAttribute("aria-label", childFacing ? "Grown-ups: jump to voluntary support information" : "Jump to voluntary support information");
  const headerTarget =
    document.querySelector(".header-actions") ||
    document.querySelector(".site-header .header-inner") ||
    document.querySelector("header nav");
  if(headerTarget){
    top.classList.add("vnv-support-top-inline");
    headerTarget.appendChild(top);
  }else{
    document.body.appendChild(top);
  }

  const tickerSelectors = [
    ".network-ticker-set",
    ".ticker-track",
    ".news-ticker-track",
    "[data-vnv-ticker]"
  ];
  const seen = new Set();
  tickerSelectors.forEach(selector => {
    document.querySelectorAll(selector).forEach(ticker => {
      if (seen.has(ticker) || ticker.querySelector('[data-vnv-support-ticker]')) return;
      seen.add(ticker);
      const a = document.createElement("a");
      a.href = "#"+SUPPORT_ID;
      a.textContent = "Support Free Access";
      a.dataset.vnvSupportTicker = "true";
      a.className = ticker.classList.contains("network-ticker-set")
        ? "network-ticker-call vnv-support-ticker-link"
        : "vnv-support-ticker-link";
      ticker.appendChild(a);
    });
  });
})();