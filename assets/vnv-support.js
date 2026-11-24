(() => {
  "use strict";

  const PAYMENT_URL = "https://buy.stripe.com/aFa8wQ5xf9Scf65caT4AU0s";
  const ECOSYSTEM_MENU_URL = "https://vervenveda.com/assets/vnv-ecosystem-menu.js";
  const SUPPORT_ID = "vnv-global-support";

  if(
    !document.getElementById("vnvEcosystemMenuButton") &&
    !document.getElementById("menuOverlay") &&
    !document.querySelector('script[data-vnv-ecosystem-menu],script[src*="vnv-ecosystem-menu.js"]')
  ){
    try{
      const menuScript=document.createElement("script");
      menuScript.src=ECOSYSTEM_MENU_URL;
      menuScript.defer=true;
      menuScript.dataset.vnvEcosystemMenu="1";
      (document.head||document.documentElement).appendChild(menuScript);
    }catch{}
  }

  if (document.getElementById(SUPPORT_ID) || document.getElementById("support")?.querySelector('a[href="' + PAYMENT_URL + '"]') || document.documentElement.hasAttribute("data-vnv-support-off")) return;

  const path = location.pathname.toLowerCase();
  const title = (document.title || "").toLowerCase();

  /* Educational teaching surfaces stay free of fundraising prompts.
     The ecosystem menu is loaded above before this guard returns. */
  const instructionalPath =
    /(^|\/)(lesson|lessons|quiz|quizzes|exam|exams|assessment|assessments|course|courses|workshop|workshops|unit|units|week|weeks)(\/|$)/.test(path) ||
    /(^|[_-])(lesson|quiz|exam|assessment|course|workshop|unit|week)([_-]|\.|$)/.test(path);
  const instructionalTitle =
    /\b(lesson|quiz|exam|assessment|workshop|course)\b/.test(title) ||
    /\b(unit|week)\s*(?:\d+|one|two|three|four|five|six|seven|eight|nine|ten|eleven|twelve|thirteen|fourteen|fifteen|sixteen|seventeen|eighteen|nineteen|twenty|twenty-one|twenty-two|twenty-three|twenty-four|twenty-five|twenty-six|twenty-seven|twenty-eight|twenty-nine|thirty|thirty-one|thirty-two)\b/.test(title);
  const instructionalSurface = instructionalPath || instructionalTitle;

  /* A quiet footer reminder is permitted on public instructional pages; never add a fundraising interruption. */

  /* Child-facing public rooms keep the resource free and move any contribution
     invitation explicitly to parents, caregivers, and other grown-ups. */
  const childFacing =
    /(^|\/)(?:khaemenes_(?:preschool|kindergarden)\.github\.io|[^/]*(?:kids?|children|youth|young[-_ ]?readers)[^/]*)(\/|$)/i.test(path) ||
    /\b(preschool|crech[eè]|kinder garden|kindergarten|kids?|children|childrens|youth|young readers?|young newsroom)\b/i.test(title);

  const style = document.createElement("style");
  style.textContent = `
    #${SUPPORT_ID}{box-sizing:border-box;width:min(calc(100% - 24px),1100px);margin:24px auto;padding:24px 18px;border:1px solid #d8b66b;border-radius:7px;background:#292827;color:#f8f0df;text-align:center;font:400 16px/1.65 Nunito,"Brandon Grotesque",Arial,sans-serif}
    #${SUPPORT_ID} .vnv-support-kicker{font:400 16px/1.4 Cinzel,Georgia,serif;color:#d8b66b;margin:0 auto 8px}
    #${SUPPORT_ID} h2{font:400 24px/1.25 Cinzel,Georgia,serif;color:#f8f0df;margin:8px auto 12px}
    #${SUPPORT_ID} p,#${SUPPORT_ID} small{display:block;max-width:800px;margin:9px auto;color:#f8f0df;font:400 16px/1.65 Nunito,"Brandon Grotesque",Arial,sans-serif}
    #${SUPPORT_ID} .vnv-support-button{display:inline-flex;align-items:center;justify-content:center;box-sizing:border-box;min-height:44px;margin:10px auto;padding:10px 20px;border:1px solid #f8f0df;border-radius:7px;background:#f8f0df;color:#292827;text-decoration:none;font:400 16px/1.4 Nunito,Arial,sans-serif}
    #${SUPPORT_ID} .vnv-support-button:hover{background:#d8b66b;color:#292827}
    #${SUPPORT_ID} .vnv-support-button:focus-visible{outline:3px solid #d8b66b;outline-offset:4px}
    #${SUPPORT_ID} .vnv-support-gratitude{color:#d8b66b}
    @media print{#${SUPPORT_ID}{display:none!important}}
    @media(max-width:600px){#${SUPPORT_ID}{padding:20px 14px}}
  `;
  document.head.appendChild(style);

  const section = document.createElement("section");
  section.id = SUPPORT_ID;
  section.setAttribute("aria-labelledby", "vnvGlobalSupportTitle");
  section.innerHTML = childFacing ? `
    <p class="vnv-support-kicker">For Parents, Caregivers &amp; Grown-Ups</p>
    <h2 id="vnvGlobalSupportTitle">Help Us Keep Learning Free</h2>
    <p>Voluntary adult contributions help sustain the stories, lessons, tools, accessibility and continued development of Verve N Veda and Khaemenes Academy. Every child is welcome, regardless of whether their family contributes.</p>
    <a class="vnv-support-button" href="${PAYMENT_URL}" target="_blank" rel="noopener noreferrer">Grown-Ups · Support Free Access</a>
    <small>Children never need to donate. Contributions are voluntary, separate from campaign contributions, and never required for access. Payments are handled by Stripe. No charitable status or tax-deductibility is claimed.</small>
    <p class="vnv-support-gratitude">With gratitude, Verve N Veda</p>
  ` : `
    <p class="vnv-support-kicker">Knowledge Belongs to Everyone</p>
    <h2 id="vnvGlobalSupportTitle">Help Us Keep Knowledge Free</h2>
    <p>Verve N Veda and Khaemenes Academy are built through countless hours of dedicated work, with a commitment to making education, knowledge and creative tools freely accessible to everyone.</p>
    <p>Your voluntary donations are vital to sustaining this work, maintaining our resources and helping our platform grow.</p>
    <a class="vnv-support-button" href="${PAYMENT_URL}" target="_blank" rel="noopener noreferrer">Support Free Access</a>
    <small>Give what you can, when you can. Access never depends on donating. Payments are handled by Stripe. Contributions are separate from campaign contributions. No charitable status or tax-deductibility is claimed.</small>
    <p class="vnv-support-gratitude">With gratitude, Verve N Veda</p>
  `;

  const footer = [...document.querySelectorAll("footer")].filter(el=>!el.closest("blockquote,article,dialog,template")).at(-1);
  if (footer?.parentNode) footer.parentNode.insertBefore(section, footer);
  else document.body.appendChild(section);

})();
