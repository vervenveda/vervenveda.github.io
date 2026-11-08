# VNV Continuum Codex · 03 · Hero, ecosystem directory, slideshow and footer

**Frozen source, 2026-11-08.** This volume contains full live homepage markup for the title hero, complete directory, slideshow, footer and ecosystem viewer, plus the complete inline engine. The additional `assets/vnv-featured-slideshow.js` exists but is **not referenced by the current homepage's script tags**; do not replace the active inline engine with it without verification.

## Page title hero — full HTML

**Requirements:** eyebrow = category; largest title = short noun/title (Verve N Veda); descriptive sentence below. Six equal buttons in two three-column rows, 760px shared width, charcoal/cream, 7px radius, 3px row gap, breathing space above. Keep the reserved tickers/header/translator stack intact.

```html
<main id="main">
    <section class="hero" aria-labelledby="gatewayTitle">
      <div class="shell hero-inner">
        <div class="hero-stage">
          <div class="hero-copy">
            <p class="eyebrow">One Connected Public Campus</p>
            <h1 id="gatewayTitle">Verve N Veda</h1>
          </div>

   <div class="hero-aside">
            <p class="hero-lead">
              A public gateway to education, research, creativity, health,
              civic knowledge, environmental stewardship, compassionate service, and
              intelligent navigation through the connected Verve N Veda ecosystem.
            </p>

            <div class="hero-actions">
              <a class="button vnv-hero-doorway" href="#directory">Ecosystem</a>
              <a class="button vnv-hero-doorway" href="#pillars">Learning</a>
              <a class="button vnv-hero-doorway" href="https://vervenveda.github.io/333.github.io/">333 Network</a>
            </div>
            <div class="enrolled-student-entry-row" aria-label="Enrolled Academy account entrances">
              <a class="enrolled-student-entry" id="vnvEnrolledStudentEntry" href="https://vervenveda.com/Khaemenes_Academy.github.io/family/" aria-label="Enrolled Students Enter Here">Enrolled Students Enter Here</a>
              <a class="enrolled-student-entry" href="https://vervenveda.com/Khaemenes_Academy.github.io/family/#khaeFamilyParentProfileHero">Enrolled Families Enter Here</a>
              <a class="enrolled-student-entry" href="https://vervenveda.com/Khaemenes_Academy.github.io/adult/">Enrolled Adults Enter Here</a>
            </div>
          </div>
        </div>

        <a class="scroll-cue" href="#directory" aria-label="Scroll to explore the Verve N Veda ecosystem directory">
          <span>Scroll to Explore</span>
        </a>
      </div>
    </section>
```

## Ecosystem directory and featured directory slideshow — full HTML

**Requirements:** preserve original category grid, featured slide, pause/preview/open controls, breadcrumbs, Complete Ecosystem Index search/filter/repository selector, category panel, and canonical navigation sources. The moving feature is a discovery surface, not an authorization boundary.

```html
<section class="section ecosystem-directory-section" id="directory" aria-labelledby="ecosystemDirectoryTitle">
      <div class="section-inner">
        <div class="section-heading ecosystem-directory-heading">
          <p class="kicker">Ecosystem Directory</p>
          <h2 id="ecosystemDirectoryTitle">Choose a Doorway</h2>
          <p class="section-intro">Open a featured site, browse a category, or use the Ecosystem Directory below to reach every public page currently cataloged across the connected Verve n Veda and Khaemenes Academy Ecosystem.</p>
        </div>
        <div class="ecosystem-category-grid" id="ecosystemCategoryGrid" aria-label="Explore the Verve N Veda ecosystem by category"></div>

        <aside class="directory-intelligence-doorway" id="directoryIntelligenceDoorway" aria-labelledby="directoryIntelligenceTitle">
          <div>
            <p class="kicker">Ecosystem and Directory</p>
            
          </div>
          <div class="directory-intelligence-actions" aria-label="Directory intelligence tools">
            
            
            
          </div>
        </aside>

        <section class="ecosystem-feature-showcase" id="ecosystemFeatureShowcase" aria-label="Featured destination across Verve N Veda">
          <div class="feature-showcase-shell">
            <article class="feature-slide" id="featureSlide" aria-live="polite">
              <div class="feature-visual" id="featureVisual">
                <img id="featureImage" alt="">
                <span class="feature-monogram" id="featureMonogram" aria-hidden="true">V</span>
                <span class="feature-visual-label" id="featureVisualLabel">Featured across Verve N Veda</span>
              </div>
              <div class="feature-copy">
                <p class="feature-kicker" id="featureKicker">Featured across Verve N Veda</p>
                <h3 class="feature-title" id="featureTitle">Discover the ecosystem</h3>
                <p class="feature-description" id="featureDescription">A rotating doorway into the applications, learning halls, studios, services, games, and public resources across Verve N Veda.</p>
                <nav class="feature-breadcrumbs" id="featureBreadcrumbs" aria-label="Featured destination breadcrumb"></nav>
                <div class="feature-actions">
                  <a class="feature-open-button" id="featureOpenButton" href="https://vervenveda.com/" target="_blank" rel="noopener noreferrer">Open full page ↗</a>
                  <button class="feature-pause-button" id="featurePreviewButton" type="button">Preview</button>
                  <button class="feature-pause-button" id="featurePauseButton" type="button" aria-pressed="false">Pause</button>
                  <span class="feature-counter" id="featureCounter"></span>
                </div>
              </div>
            </article>
          </div>
        </section>

        <section class="complete-page-index" id="completePageIndex" aria-labelledby="completePageIndexTitle">
          <p class="kicker">FEATURED DOORWAYS</p>
          <h3 id="completePageIndexTitle">Complete Ecosystem Index</h3>
          <p class="complete-index-copy">Search every public page across the Verve N Veda network.</p>
          <div class="complete-index-controls">
            <label class="visually-hidden" for="ecosystemPageSearch">Search every public ecosystem page</label>
            <input id="ecosystemPageSearch" type="search" autocomplete="off" placeholder="Search courses, lessons, tools, games, halls, topics…">
            <label class="visually-hidden" for="ecosystemPageCategory">Filter by ecosystem category</label>
            <select id="ecosystemPageCategory">
              <option value="">All categories</option>
              <option value="news">News</option>
              <option value="weather">Weather</option>
              <option value="creative">Creative</option>
              <option value="professional">Professional</option>
              <option value="education">Education</option>
              <option value="games">Games</option>
              <option value="civic">Civic</option>
              <option value="environmental">Earth</option>
              <option value="health">Health</option>
              <option value="communication">Connect</option>
              <option value="finance">Finance</option>
              <option value="research">Research</option>
            </select>
            <label class="visually-hidden" for="ecosystemPageRepo">Filter by repository</label>
            <select id="ecosystemPageRepo"><option value="">All repositories</option></select>
          </div>
          <p class="complete-index-status" id="ecosystemPageStatus" role="status" aria-live="polite">Loading complete public page index…</p>
          <div class="complete-index-grid" id="ecosystemPageResults"></div>
        </section>

        <div class="ecosystem-dropdown-stage" id="ecosystemDropdownStage">
          <section class="ecosystem-directory-panel" id="ecosystemDirectoryPanel" role="region" aria-labelledby="ecosystemPanelHeading" hidden>
            <div class="ecosystem-panel-head">
              <div>
                <h3 class="ecosystem-panel-heading" id="ecosystemPanelHeading"></h3>
                <p class="ecosystem-panel-note" id="ecosystemPanelNote"></p>
              </div>
              <button class="ecosystem-panel-close" id="ecosystemPanelClose" type="button" aria-label="Close directory category">×</button>
            </div>
            <div class="ecosystem-panel-grid" id="ecosystemPanelGrid"></div>
          </section>
        </div>


      </div>
    </section>
```

## Footer — full HTML

**Requirements:** charcoal background, centered navigation, cream 16px+ readable text, correct public links, privacy policy, mission and back-to-top. Visual rules live in the stylesheet volume.

```html
<footer>
    <div class="shell footer-inner">
      <div class="footer-credit">
        <strong>© <span id="year"></span> Verve N Veda · Khaemenes Academy · Jennifer Kay Pearl</strong>
      </div>
      <nav class="footer-links" aria-label="Footer navigation">
        <a href="#pillars">Halls</a>
        <a href="#featured">Featured</a>
        <a href="#directory">Directory</a>
        <a href="#support">Contribute</a>
        <a href="#mission">Mission</a>
        <a href="#intelligence">NAIB</a>
        <a href="/privacy-policy.html">Privacy Policy</a>
        <a href="#top">Back to Top</a>
      </nav>
      <div class="footer-meta" aria-label="Jennifer Pearl 2028 campaign links">
        <span>Public Service:</span>
        <a href="https://jenniferpearl2028.github.io">Jennifer Pearl 2028</a>
        <a href="https://vervenveda.github.io/onenationforall.github.io/">Campaign</a>
      </div>
    </div>
  </footer>
```

## Ecosystem viewer and slide-preview overlay — full HTML

```html
<div class="ecosystem-viewer-overlay" id="ecosystemViewerOverlay" aria-hidden="true">
    <section class="ecosystem-viewer" id="ecosystemViewer" role="dialog" aria-modal="true" aria-labelledby="viewerTitle">
      <header class="ecosystem-viewer-toolbar">
        <nav class="viewer-breadcrumbs" id="viewerBreadcrumbs" aria-label="Ecosystem breadcrumb"></nav>
        <div class="viewer-toolbar-actions">
          <button class="viewer-tool" id="viewerPrint" type="button" title="Print this destination"><span>Print</span> ⎙</button>
          <button class="viewer-close" id="viewerClose" type="button" aria-label="Close ecosystem viewer">×</button>
        </div>
      </header>
      <div class="viewer-summary">
        <div>
          <h3 id="viewerTitle">Verve N Veda</h3>
          <p id="viewerDescription"></p>
        </div>
        <a class="viewer-full-link" id="viewerFullLink" href="#" target="_blank" rel="noopener noreferrer">Open full page ↗</a>
      </div>
      <div class="viewer-frame-wrap">
        <iframe class="viewer-frame" id="viewerFrame" title="Featured Verve N Veda destination" loading="eager" referrerpolicy="strict-origin-when-cross-origin" sandbox="allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"></iframe>
        <div class="viewer-embed-blocked" id="viewerEmbedBlocked" hidden>
          <div>
            <p class="viewer-blocked-kicker">Protected Display</p>
            <h3 id="viewerBlockedTitle">This destination is protected by Aranea and her Spyders.</h3>
            <p>This page uses a frame-ancestor policy.</p>
            <a class="viewer-full-link" id="viewerBlockedLink" href="#" target="_blank" rel="noopener noreferrer">Open protected page ↗</a>
          </div>
        </div>
      </div>
      <div class="viewer-frame-note">Some destinations protect themselves from embedded display. If a page declines the viewer, use <strong>Open full page</strong>; Verve N Veda remains open behind it.</div>
    </section>
  </div>
```

## LIVE directory, category navigation, slideshow and viewer controller — full inline JavaScript

This exact single script block contains the canonical `ECOSYSTEM_DIRECTORY`, navigation discovery and filtering, `FEATURE_POOL`, feature interval, preview controls, and viewer. It is preserved whole so implementation details cannot be silently omitted.

```javascript
(async () => {
      "use strict";

      /* Emergency presentation fallback only.
         Canonical public navigation is loaded from
         /ecosystem/master-ecosystem-directory.json. */
      let SITES = [{"title":"333 Network","url":"https://vervenveda.github.io/333.github.io/","icon":"333","group":"Creative & Professional","desc":"HOLLO, KANSEE, E=Ven Mail, Bazaar Art Live, SIte Studio, and Bunya digital infrastructure.","keywords":"communication meetings email social network website builder domains hosting infrastructure collaboration"},{"title":"NAIB","url":"https://artist1970.github.io/NAIB.github.io/","icon":"N","group":"Knowledge","desc":"The Verve N Veda intelligence and navigation guide for context, resource federation, specialist routing, memory, and verification-aware discovery.","keywords":"naib ai intelligence navigation mentor context memory routing federation specialists verifier plera khaemenes arshif 333"},{"title":"Khaemenes Academy","url":"https://vervenveda.com/KhaemenesAcademy_Home.github.io/","icon":"KA","group":"Education","desc":"The central international learning campus from preschool through higher learning and lifelong education.","keywords":"school homeschool curriculum students parents teachers learning international education"},{"title":"Khaemenes Preschool","url":"https://vervenveda.github.io/Khaemenes_Preschool.github.io/","icon":"PS","group":"Education","desc":"Colorful early-learning stories, play, life skills, creativity, and discovery.","keywords":"pre-k early childhood children stories games preschool parents"},{"title":"Khaemenes Kinder Garden","url":"https://vervenveda.github.io/Khaemenes_KinderGarden.github.io/","icon":"KG","group":"Education","desc":"A garden of kindness, curiosity, literacy, numbers, nature, and wonder.","keywords":"kindergarten early learning reading math nature children"},{"title":"Khaemenes Elementary","url":"https://vervenveda.github.io/Khaemenes_Elementary.github.io/","icon":"E","group":"Education","desc":"Grades 1–5 academics, creativity, family learning, and foundational skills.","keywords":"elementary first second third fourth fifth grade homeschool parents"},{"title":"Khaemenes Middle","url":"https://vervenveda.github.io/Khaemenes_Middle.github.io/","icon":"M","group":"Education","desc":"Grades 6–8 academic foundations, independence, exploration, and preparation.","keywords":"middle school sixth seventh eighth grade homeschool students"},{"title":"Khaemenes High","url":"https://vervenveda.github.io/Khaemenes_High.github.io/","icon":"HS","group":"Education","desc":"Grades 9–12 courses, portfolios, records, examinations, and graduation pathways.","keywords":"high school ninth tenth eleventh twelfth grade diploma certificate math curriculum homeschool"},{"title":"Khaemenes Higher Learning","url":"https://vervenveda.com/Khaemenes_Higher_Learning.github.io/start/","icon":"HL","group":"Education","desc":"GED, college access, careers, professional development, and lifelong study.","keywords":"adult education college university career workforce employment ged training"},{"title":"Khaemenes Linguistics","url":"https://vervenveda.github.io/Khaemenes_Linguistics.github.io/","icon":"L","group":"Education","desc":"Languages, linguistics, translation, writing systems, and communication.","keywords":"language arabic spanish english translation literacy writing"},{"title":"ARSHIF","url":"https://vervenveda.github.io/Arshif.github.io/","icon":"A","group":"Knowledge","desc":"Research, literature, history, philosophy, culture, faith, archives, and memory.","keywords":"classics books library religion mythology science theatre travel oral traditions"},{"title":"The Verifier","url":"https://vervenveda.github.io/theverifier.github.io/","icon":"V","group":"Knowledge","desc":"News discovery, source comparison, evidence, editorials, research, and media literacy.","keywords":"news fact check journalism politics current events science daily children news"},{"title":"PLERA Search","url":"https://vervenveda.github.io/PLERASearch.github.io/","icon":"◎","group":"Knowledge","desc":"A search gateway into trusted public learning and resource destinations.","keywords":"search engine research directory find resources"},{"title":"Solanar","url":"https://vervenveda.github.io/solanar.github.io/","icon":"☀","group":"Knowledge","desc":"Weather, Earth systems, climate, moon cycles, world time, and environmental observation.","keywords":"weather forecast hurricane storm emergency climate moon phase space weather world clock"},{"title":"Medicament Hub","url":"https://vervenveda.github.io/medicament-hub.github.io/","icon":"⚕","group":"Public Service","desc":"Health, medicine, trauma, mental wellness, family care, seniors, insurance, and safety resources.","keywords":"medical hospital doctor medication tbi memory loss mental health addiction recovery disability maternal child health"},{"title":"Firmament Law","url":"https://vervenveda.github.io/firmament.github.io/","icon":"§","group":"Public Service","desc":"Legal information, rights, family and veteran resources, evidence tools, and civic literacy.","keywords":"legal help attorney rights court family law lgbtq seniors insurance veterans citations evidence"},{"title":"One Nation for All","url":"https://vervenveda.github.io/onenationforall.github.io/","icon":"☆","group":"Public Service","desc":"Constitutional learning, voter access, policy, veterans, homelessness, service, and community support.","keywords":"government voting elections constitution civic homeless housing legal help public policy unity"},{"title":"Jennifer Pearl 2028 · GitHub","url":"https://jenniferpearl2028.github.io/","icon":"JP","group":"Public Service","desc":"Jennifer Pearl’s public-service campaign GitHub Pages destination for policy, voter access, and connected community resources.","keywords":"president campaign candidate policy voter registration petition public service 2028 github"},{"title":"Jennifer Pearl 2028 · Campaign Home","url":"https://vervenveda.wixsite.com/home","icon":"JP","group":"Public Service","desc":"The live Jennifer Pearl 2028 campaign home for public-service information, policy, voter access, and community updates.","keywords":"president campaign candidate policy voter registration petition public service 2028 wix campaign home"},{"title":"Veterans","url":"https://vervenveda.github.io/veterans.github.io/","icon":"★","group":"Public Service","desc":"Veteran benefits, crisis resources, housing, employment, services, and family assistance.","keywords":"military va benefits disability housing jobs crisis family"},{"title":"Finance","url":"https://vervenveda.github.io/finance.github.io/","icon":"$","group":"Public Service","desc":"Financial literacy, budgeting, planning, markets, consumer knowledge, and practical tools.","keywords":"money banking credit debt taxes budget investing business insurance"},{"title":"River to Road","url":"https://vervenveda.github.io/river_to_road.github.io/","icon":"≈","group":"Public Service","desc":"Environmental stewardship, clean water, science, service learning, events, and community action.","keywords":"environment pollution cleanup activism conservation climate ocean river road trash ecology"},{"title":"Aurora","url":"https://vervenveda.github.io/aurora.github.io/","icon":"☼","group":"Public Service","desc":"Rest, yoga, reflection, encouragement, organization, wellness, and creative renewal.","keywords":"wellbeing meditation prayer breathing sleep journal relaxation mental health self care"},{"title":"ProResource Hub","url":"https://vervenveda.github.io/proresource_hub.github.io/","icon":"P","group":"Creative & Professional","desc":"Professional tools for writing, editing, media, research, design, meetings, and productivity.","keywords":"prose editor pdf docx letters zip clean task manager meeting media cad tools"},{"title":"Bazaar Art","url":"https://vervenveda.github.io/bazaarart.github.io/","icon":"✦","group":"Creative & Professional","desc":"Art education, artist tools, galleries, creativity, social expression, and cultural enterprise.","keywords":"artist painting drawing photo album gallery community social feed art business"},{"title":"Bazaar Art Live","url":"https://vervenveda.github.io/333.github.io/app/Bazaar_Art_Live_index.html","icon":"LIVE","group":"Creative & Professional","desc":"The live local-first creative community feed for profiles, posts, stories, reels, groups, events, and artistic connection.","keywords":"artists social network creative feed stories reels groups events community 333 live"},{"title":"My Art Gallery","url":"https://vervenveda.github.io/myartgallery.github.io/","icon":"▧","group":"Creative & Professional","desc":"Artist Jenny Pearl’s portfolio preserving more than three decades of professional artistry.","keywords":"Jennifer Jenny Pearl artist portfolio murals watercolor acrylic commissions photography"},{"title":"The Refrain","url":"https://vervenveda.github.io/the_refrain.github.io/","icon":"♫","group":"Creative & Professional","desc":"Music education, composition, recording, performance, and creative exploration.","keywords":"music studio composer multitrack recording harmony songs instruments"},{"title":"Arcade","url":"https://vervenveda.github.io/arcade.github.io/","icon":"◆","group":"Creative & Professional","desc":"Original games, strategy, puzzles, trivia, practice, and playful discovery.","keywords":"games chess checkers sudoku trivia educational arcade puzzles"},{"title":"Saudi Arabia · People · Heritage · Horizon","url":"https://vervenveda.com/Saudi_Arabia.github.io/","icon":"SA","group":"Knowledge","desc":"Bilingual source-led guide to Saudi Arabia's people, heritage, history, regions, culture, and educational resources.","keywords":"saudi arabia kingdom arabia arabic heritage culture history diplomacy country world"},{"title":"Palestine · Land · People · Memory","url":"https://vervenveda.com/Palestine.github.io/","icon":"PS","group":"Knowledge","desc":"Bilingual source-led guide to Palestinian land, cities, culture, archives, social history, Gaza, and educational research.","keywords":"palestine palestinian arabic heritage culture history gaza jerusalem diplomacy country world"},{"title":"Iran · Art · Music · Script · Legacy · Innovation","url":"https://vervenveda.com/Iran.github.io/","icon":"IR","group":"Knowledge","desc":"Source-led cultural gateway to Iranian art, music, Persian script and calligraphy, historical legacy, innovation, archives, and free Academy learning.","keywords":"iran persia persian iranian art music script calligraphy culture legacy innovation history culture heritage achaemenid safavid qajar diplomacy country world research"}];
      const GROUP_ORDER = ["Education","Knowledge","Public Service","Creative & Professional"];
      const ALLOWED_HOSTS = new Set([
        "vervenveda.github.io",
        "vervenveda.com",
        "www.vervenveda.com",
        "artist1970.github.io",
        "jenniferpearl2028.github.io",
        
      ]);
      const $ = id => document.getElementById(id);
      let lastFocusedElement = null;

      function escapeHtml(value){
        return String(value).replace(/[&<>"']/g, char => ({
          "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"
        }[char]));
      }

      function escapeAttribute(value){
        return escapeHtml(value).replace(/`/g,"&#096;");
      }

      function searchableText(site){
        return `${site.title} ${site.group} ${site.desc} ${site.keywords || ""}`.toLowerCase();
      }

      function validateSiteRegistry(){
        const errors = [];
        const seenTitles = new Set();
        const seenUrls = new Set();

        SITES.forEach((site,index) => {
          if(!site.title || !site.url || !site.group || !site.desc){
            errors.push(`Entry ${index + 1} is missing a required field.`);
            return;
          }

          try{
            const url = new URL(site.url);
            if(url.protocol !== "https:" || !ALLOWED_HOSTS.has(url.hostname)){
              errors.push(`${site.title} uses a disallowed URL: ${site.url}`);
            }
          }catch{
            errors.push(`${site.title} has an invalid URL: ${site.url}`);
          }

          if(seenTitles.has(site.title)) errors.push(`Duplicate title: ${site.title}`);
          if(seenUrls.has(site.url)) errors.push(`Duplicate URL: ${site.url}`);
          seenTitles.add(site.title);
          seenUrls.add(site.url);
        });

        if(errors.length) console.warn("Verve N Veda directory registry warnings:",errors);
        else console.info(`Verve N Veda directory registry loaded: ${SITES.length} destinations.`);
      }


       /* Emergency presentation fallback only. The master ecosystem directory
          is the authoritative public-navigation source at runtime. */
       let ECOSYSTEM_DIRECTORY = [{"id":"news","label":"News","groups":[{"title":"Gateways","items":[{"title":"The Verifier","url":"https://vervenveda.github.io/theverifier.github.io/","desc":"Gateway in the Verve N Veda news ecosystem."}]},{"title":"Apps","items":[{"title":"Global News Digest","url":"https://vervenveda.github.io/theverifier.github.io/apps/global_news_digest_index.html","desc":"App in the Verve N Veda news ecosystem."},{"title":"Kids News Network","url":"https://vervenveda.github.io/theverifier.github.io/apps/kids_news_network_index.html","desc":"App in the Verve N Veda news ecosystem."},{"title":"Modern News Engine","url":"https://vervenveda.github.io/theverifier.github.io/apps/Modern_News_Engine_index.html","desc":"App in the Verve N Veda news ecosystem."},{"title":"Science News","url":"https://vervenveda.github.io/theverifier.github.io/apps/science_news_index.html","desc":"App in the Verve N Veda news ecosystem."},{"title":"World Wire","url":"https://vervenveda.github.io/theverifier.github.io/apps/world_wire_index.html","desc":"App in the Verve N Veda news ecosystem."}]}]},{"id":"weather","label":"Weather","groups":[{"title":"Gateways","items":[{"title":"Solanar","url":"https://vervenveda.github.io/solanar.github.io/","desc":"Gateway in the Verve N Veda weather ecosystem."}]},{"title":"Apps","items":[{"title":"Solanar Kids SkyLab","url":"https://vervenveda.github.io/solanar.github.io/apps/Solanar_kids_skylab_index.html","desc":"App in the Verve N Veda weather ecosystem."},{"title":"Solanar Live Weather","url":"https://vervenveda.github.io/solanar.github.io/apps/Solanar_Live_Weather_index.html","desc":"App in the Verve N Veda weather ecosystem."},{"title":"Solanar Planetarium","url":"https://vervenveda.github.io/solanar.github.io/apps/Solanar_Planetarium_index.html","desc":"App in the Verve N Veda weather ecosystem."},{"title":"Weather Planetarium","url":"https://vervenveda.github.io/Khaemenes_KinderGarden.github.io/apps/Weather_planetarium_index.html","desc":"App in the Verve N Veda weather ecosystem."}]},{"title":"Tools","items":[{"title":"Solanar TraceLab","url":"https://vervenveda.github.io/solanar.github.io/apps/Solanar-TraceLab/","desc":"Tool in the Verve N Veda weather ecosystem."}]}]},{"id":"creative","label":"Creative","groups":[{"title":"Gateways","items":[{"title":"Aurora","url":"https://vervenveda.github.io/aurora.github.io/","desc":"Gateway in the Verve N Veda creative ecosystem."},{"title":"Bazaar Art","url":"https://vervenveda.github.io/bazaarart.github.io/","desc":"Gateway in the Verve N Veda creative ecosystem."},{"title":"The Refrain","url":"https://vervenveda.github.io/the_refrain.github.io/","desc":"Gateway in the Verve N Veda creative ecosystem."}]},{"title":"Pages","items":[{"title":"My Art Gallery","url":"https://vervenveda.github.io/myartgallery.github.io/","desc":"Page in the Verve N Veda creative ecosystem."}]},{"title":"Apps","items":[{"title":"Aurora Inspiration","url":"https://vervenveda.github.io/aurora.github.io/apps/Aurora_Inspiration_index.html","desc":"App in the Verve N Veda creative ecosystem."}]},{"title":"Tools","items":[{"title":"Art Drawing Tool","url":"https://vervenveda.github.io/Khaemenes_Preschool.github.io/apps/art_drawing_tool_index.html","desc":"Tool in the Verve N Veda creative ecosystem."},{"title":"SpinSpire Art Prompt Generator","url":"https://vervenveda.github.io/bazaarart.github.io/apps/SpinSpire_Art_Prompt_Generator_index.html","desc":"Tool in the Verve N Veda creative ecosystem."}]},{"title":"Halls","items":[{"title":"Art Hall","url":"https://vervenveda.github.io/bazaarart.github.io/apps/Class_art_hall_index.html","desc":"Hall in the Verve N Veda creative ecosystem."},{"title":"Music Hall","url":"https://vervenveda.github.io/bazaarart.github.io/apps/Class_music_hall_index.html","desc":"Hall in the Verve N Veda creative ecosystem."}]},{"title":"Courses","items":[{"title":"Art 101","url":"https://vervenveda.github.io/bazaarart.github.io/apps/Class_art_101_index.html","desc":"Course in the Verve N Veda creative ecosystem."}]},{"title":"Workshops","items":[{"title":"Music 101 Workshop","url":"https://vervenveda.github.io/the_refrain.github.io/education/Music%20101%20Workshop_index.html","desc":"Workshop in the Verve N Veda creative ecosystem."},{"title":"Music 201 Workshop","url":"https://vervenveda.github.io/the_refrain.github.io/education/Music%20201%20Workshop_index.html","desc":"Workshop in the Verve N Veda creative ecosystem."}]},{"title":"Studios","items":[{"title":"Composer Studio","url":"https://vervenveda.github.io/the_refrain.github.io/apps/composer_studio_index.html","desc":"Studio in the Verve N Veda creative ecosystem."},{"title":"Photo Album Studio","url":"https://vervenveda.github.io/bazaarart.github.io/apps/Photo_Album_Studio/","desc":"Studio in the Verve N Veda creative ecosystem."}]}]},{"id":"professional","label":"Professional","groups":[{"title":"Gateways","items":[{"title":"ProReSources","url":"https://vervenveda.github.io/proresource_hub.github.io/ProReSources_updated_index.html","desc":"Gateway in the Verve N Veda professional ecosystem."}]},{"title":"Tools","items":[{"title":"DailySpark Task Studio","url":"https://vervenveda.github.io/proresource_hub.github.io/Protools/DailySpark%E2%84%A2_task_studio_index.html","desc":"Tool in the Verve N Veda professional ecosystem."},{"title":"KhaeClean","url":"https://vervenveda.github.io/proresource_hub.github.io/Protools/KhaeClean%E2%84%A2_index.html","desc":"Tool in the Verve N Veda professional ecosystem."},{"title":"Khaemenes Scientific Calculator","url":"https://vervenveda.github.io/proresource_hub.github.io/Protools/Khaemenes_Scientific_Calculator/","desc":"Tool in the Verve N Veda professional ecosystem."},{"title":"KhaeZip","url":"https://vervenveda.github.io/proresource_hub.github.io/Protools/KhaeZip%E2%84%A2_index.html","desc":"Tool in the Verve N Veda professional ecosystem."}]},{"title":"Resources","items":[{"title":"Evidence Citation Lab Resource Cloud","url":"https://vervenveda.github.io/proresource_hub.github.io/Protools/Evidence_Citation_Studio/lab-resource-cloud.html","desc":"Resource in the Verve N Veda professional ecosystem."}]},{"title":"Studios","items":[{"title":"Evidence & Citation Studio","url":"https://vervenveda.github.io/proresource_hub.github.io/Protools/Evidence_Citation_Studio/","desc":"Studio in the Verve N Veda professional ecosystem."},{"title":"Ohmic CAD Studio","url":"https://vervenveda.github.io/proresource_hub.github.io/Protools/Ohmic_CAD_Studio.html","desc":"Studio in the Verve N Veda professional ecosystem."}]}]},{"id":"education","label":"Education","groups":[{"title":"Gateways","items":[{"title":"Khaemenes Academy","url":"https://vervenveda.com/KhaemenesAcademy_Home.github.io/","desc":"Gateway in the Verve N Veda education ecosystem."},{"title":"Khaemenes Elementary","url":"https://vervenveda.github.io/Khaemenes_Elementary.github.io/","desc":"Gateway in the Verve N Veda education ecosystem."},{"title":"Khaemenes Higher Learning","url":"https://vervenveda.com/Khaemenes_Higher_Learning.github.io/start/","desc":"Gateway in the Verve N Veda education ecosystem."},{"title":"Khaemenes Kinder Garden","url":"https://vervenveda.github.io/Khaemenes_KinderGarden.github.io/","desc":"Gateway in the Verve N Veda education ecosystem."},{"title":"Khaemenes Linguistics","url":"https://vervenveda.github.io/Khaemenes_Linguistics.github.io/","desc":"Gateway in the Verve N Veda education ecosystem."},{"title":"Khaemenes Middle","url":"https://vervenveda.github.io/Khaemenes_Middle.github.io/","desc":"Gateway in the Verve N Veda education ecosystem."},{"title":"Khaemenes Preschool · Crechè","url":"https://vervenveda.github.io/Khaemenes_Preschool.github.io/","desc":"Gateway in the Verve N Veda education ecosystem."},{"title":"Khaemenes Sr. High","url":"https://vervenveda.github.io/Khaemenes_High.github.io/","desc":"Gateway in the Verve N Veda education ecosystem."}]},{"title":"Apps","items":[{"title":"ABC Story Time","url":"https://vervenveda.github.io/Khaemenes_Preschool.github.io/apps/ABC_Story_Time/","desc":"App in the Verve N Veda education ecosystem."},{"title":"Kindergarten Math Cloud","url":"https://vervenveda.github.io/Khaemenes_KinderGarden.github.io/apps/kindergarten_math_cloud_index.html","desc":"App in the Verve N Veda education ecosystem."},{"title":"Letter Lab","url":"https://vervenveda.github.io/Khaemenes_KinderGarden.github.io/apps/ABC_letter-lab.index.html","desc":"App in the Verve N Veda education ecosystem."},{"title":"Preschool Math Cloud","url":"https://vervenveda.github.io/Khaemenes_Preschool.github.io/apps/math_cloud_index.html","desc":"App in the Verve N Veda education ecosystem."}]},{"title":"Tools","items":[{"title":"Career Directory AGI","url":"https://vervenveda.com/Khaemenes_Higher_Learning.github.io/start/Career/directory-agi/","desc":"Tool in the Verve N Veda education ecosystem."},{"title":"Diploma Generator","url":"https://vervenveda.com/Khaemenes_Academy.github.io/Parent_resources/Diploma_generator_index.html","desc":"Tool in the Verve N Veda education ecosystem."},{"title":"Homeschool Compass","url":"https://vervenveda.com/Khaemenes_Academy.github.io/Parent_resources/Homeschool_compass_index.html","desc":"Tool in the Verve N Veda education ecosystem."},{"title":"Qur'an Root Explorer","url":"https://vervenveda.github.io/Khaemenes_Linguistics.github.io/apps/faith/Arabic/Quran_root_explorer/index.html","desc":"Tool in the Verve N Veda education ecosystem."},{"title":"Transcript Generator","url":"https://vervenveda.com/Khaemenes_Academy.github.io/Parent_resources/Transcript_generator_index.html","desc":"Tool in the Verve N Veda education ecosystem."},{"title":"Khaemenes Career Star","url":"https://vervenveda.com/assessment-engine/apps/career_star_index.html","desc":"Career shortlisting and comparison tool for learners."},{"title":"Verve Sovereign Problem-Solving Agent","url":"https://vervenveda.com/assessment-engine/agents/demos/","desc":"Local problem-solving demonstration tool for structured reasoning practice."}]},{"title":"Games","items":[{"title":"ABC Alphabet Adventure","url":"https://vervenveda.github.io/Khaemenes_Preschool.github.io/apps/ABC_Alphabet_Adventure_index.html","desc":"Game in the Verve N Veda education ecosystem."},{"title":"Feelings Game","url":"https://vervenveda.github.io/Khaemenes_Preschool.github.io/apps/feelings_game_index.html","desc":"Game in the Verve N Veda education ecosystem."},{"title":"Math Garden","url":"https://vervenveda.github.io/Khaemenes_KinderGarden.github.io/apps/math-garden_index.html","desc":"Game in the Verve N Veda education ecosystem."},{"title":"Shapes Game","url":"https://vervenveda.github.io/Khaemenes_Preschool.github.io/apps/shapes_game_index.html","desc":"Game in the Verve N Veda education ecosystem."},{"title":"Sink or Float","url":"https://vervenveda.github.io/Khaemenes_KinderGarden.github.io/apps/sink-or-float_index.html","desc":"Game in the Verve N Veda education ecosystem."},{"title":"Spelling Soup","url":"https://vervenveda.github.io/Khaemenes_KinderGarden.github.io/apps/ABC_spelling_soup_index.html","desc":"Game in the Verve N Veda education ecosystem."}]},{"title":"Halls","items":[{"title":"Language Learning Hall","url":"https://vervenveda.github.io/Khaemenes_Linguistics.github.io/Halls/language-learning-v3_index.html","desc":"Hall in the Verve N Veda education ecosystem."},{"title":"Linguistics Halls","url":"https://vervenveda.github.io/Khaemenes_Linguistics.github.io/Halls/","desc":"Hall in the Verve N Veda education ecosystem."}]},{"title":"Portals","items":[{"title":"Adult Scholar Enrollment","url":"https://vervenveda.com/Khaemenes_Academy.github.io/adult/enroll/","desc":"Portal in the Verve N Veda education ecosystem."},{"title":"Career Portal","url":"https://vervenveda.com/Khaemenes_Higher_Learning.github.io/start/Career/","desc":"Portal in the Verve N Veda education ecosystem."},{"title":"GED Portal","url":"https://vervenveda.com/Khaemenes_Higher_Learning.github.io/start/GED/portal_index.html","desc":"Portal in the Verve N Veda education ecosystem."}]},{"title":"Courses","items":[{"title":"Arabic Daily","url":"https://vervenveda.github.io/Khaemenes_Linguistics.github.io/apps/electives/Arabic/Daily-language/index.html","desc":"Daily Arabic language practice in the Verve N Veda education ecosystem."},{"title":"Higher Learning Science","url":"https://vervenveda.com/Khaemenes_Higher_Learning.github.io/start/Science/","desc":"Course in the Verve N Veda education ecosystem."},{"title":"Pre-Algebra","url":"https://vervenveda.github.io/Khaemenes_High.github.io/courses/mathematics/pre-algebra/","desc":"Course in the Verve N Veda education ecosystem."}]},{"title":"Assessments","items":[{"title":"Career Assessment","url":"https://vervenveda.com/Khaemenes_Higher_Learning.github.io/start/Career/apps/career-assessment_index.html","desc":"Assessment in the Verve N Veda education ecosystem."},{"title":"NAIB Progress Assessment Engine","url":"https://vervenveda.com/assessment-engine/","desc":"Assessment gateway for Khaemenes Academy progress review and evidence-aware learning."},{"title":"Career Assessment","url":"https://vervenveda.com/assessment-engine/apps/career_assessment_index.html","desc":"300-question career assessment in the Verve N Veda education ecosystem."}]},{"title":"Mentors & Guides","items":[{"title":"Career Mentor Hub","url":"https://vervenveda.com/Khaemenes_Higher_Learning.github.io/start/Career/apps/career-mentor-hub_index.html","desc":"Mentors & Guide in the Verve N Veda education ecosystem."},{"title":"Khaemenes Mentor Review","url":"https://vervenveda.com/assessment-engine/apps/mentor_review_index.html","desc":"Mentor review workspace for learner evidence and progress reflection."}]}]},{"id":"games","label":"Games","groups":[{"title":"Gateways","items":[{"title":"Verve N Veda Arcade","url":"https://vervenveda.github.io/arcade.github.io/","desc":"Gateway in the Verve N Veda games ecosystem."}]},{"title":"Games","items":[{"title":"Backgammon","url":"https://vervenveda.github.io/arcade.github.io/Backgammon_index.html","desc":"Game in the Verve N Veda games ecosystem."},{"title":"Checkers Variant Lab","url":"https://vervenveda.github.io/arcade.github.io/Checkers_Variant_Lab_index.html","desc":"Game in the Verve N Veda games ecosystem."},{"title":"Chess Studio","url":"https://vervenveda.github.io/arcade.github.io/Chess_Studio_index.html","desc":"Game in the Verve N Veda games ecosystem."},{"title":"Jenny's Sudoku","url":"https://vervenveda.github.io/arcade.github.io/Jenny%27s_Sudoku_index.html","desc":"Game in the Verve N Veda games ecosystem."},{"title":"Learn a New Word","url":"https://vervenveda.github.io/arcade.github.io/Learn_a_New_Word_index.html","desc":"Game in the Verve N Veda games ecosystem."},{"title":"Mandala Rings","url":"https://vervenveda.github.io/arcade.github.io/Geometry/mandala_rings_game_index.html","desc":"Game in the Verve N Veda games ecosystem."},{"title":"Sacred Geometry Game","url":"https://vervenveda.github.io/arcade.github.io/Geometry/sacred_geometry_game_index.html","desc":"Game in the Verve N Veda games ecosystem."}]}]},{"id":"civic","label":"Civic","groups":[{"title":"Gateways","items":[{"title":"Firmament","url":"https://vervenveda.github.io/firmament.github.io/","desc":"Gateway in the Verve N Veda civic ecosystem."},{"title":"One Nation For All","url":"https://vervenveda.github.io/onenationforall.github.io/","desc":"Gateway in the Verve N Veda civic ecosystem."}]},{"title":"Pages","items":[{"title":"Jennifer Pearl 2028","url":"https://vervenveda.github.io/JenniferPearl2028.github.io/","desc":"Page in the Verve N Veda civic ecosystem."}]},{"title":"Apps","items":[{"title":"Pulse · One Nation","url":"https://vervenveda.github.io/onenationforall.github.io/apps/Pulse/","desc":"App in the Verve N Veda civic ecosystem."}]},{"title":"Halls","items":[{"title":"Law & Governance Hall","url":"https://vervenveda.github.io/firmament.github.io/apps/Law_Governance_hall_index.html","desc":"Hall in the Verve N Veda civic ecosystem."}]},{"title":"Portals","items":[{"title":"Family Hub","url":"https://vervenveda.github.io/firmament.github.io/apps/Family_Hub_index.html","desc":"Portal in the Verve N Veda civic ecosystem."},{"title":"Florida Voter Hub","url":"https://vervenveda.github.io/onenationforall.github.io/apps/Florida_Voter_Hub_index.html","desc":"Portal in the Verve N Veda civic ecosystem."},{"title":"Global Voter Portal","url":"https://vervenveda.github.io/onenationforall.github.io/apps/Global_Voter_Portal_index.html","desc":"Portal in the Verve N Veda civic ecosystem."},{"title":"Homeless Resource Hub","url":"https://vervenveda.com/Homeless.github.io/","desc":"Portal in the Verve N Veda civic ecosystem."},{"title":"U.S. Voter Hub","url":"https://vervenveda.github.io/onenationforall.github.io/apps/US_VOTER_HUB_index.html","desc":"Portal in the Verve N Veda civic ecosystem."},{"title":"Veterans Hub · Florida","url":"https://vervenveda.github.io/firmament.github.io/apps/Veterans_Hub_Florida_index.html","desc":"Portal in the Verve N Veda civic ecosystem."},{"title":"Veterans Hub · National","url":"https://vervenveda.github.io/firmament.github.io/apps/Veterans_Hub_National_index.html","desc":"Portal in the Verve N Veda civic ecosystem."},{"title":"Veterans Resource Hub","url":"https://vervenveda.github.io/veterans.github.io/","desc":"Portal in the Verve N Veda civic ecosystem."}]},{"title":"Resources","items":[{"title":"National Policy Proposals","url":"https://vervenveda.github.io/onenationforall.github.io/apps/National_Policy_Proposals_index.html","desc":"Resource in the Verve N Veda civic ecosystem."},{"title":"Verve N Veda Privacy Policy","url":"https://vervenveda.com/privacy-policy.html","desc":"Public privacy policy for Verve N Veda visitors and users."}]}]},{"id":"environmental","label":"Earth","groups":[{"title":"Gateways","items":[{"title":"River to Road","url":"https://vervenveda.github.io/river_to_road.github.io/","desc":"Gateway in the Verve N Veda environmental ecosystem."}]},{"title":"Games","items":[{"title":"Lawn Care Quiz","url":"https://vervenveda.github.io/river_to_road.github.io/apps/lawn_care_quiz_index.html","desc":"Game in the Verve N Veda environmental ecosystem."},{"title":"Virtual Lawn Mower","url":"https://vervenveda.github.io/river_to_road.github.io/apps/virtual_lawn_mower_index.html","desc":"Game in the Verve N Veda environmental ecosystem."}]}]},{"id":"health","label":"Health","groups":[{"title":"Gateways","items":[{"title":"Medicament Hub","url":"https://vervenveda.github.io/medicament-hub.github.io/","desc":"Gateway in the Verve N Veda health ecosystem."}]},{"title":"Tools","items":[{"title":"Workout Builder","url":"https://vervenveda.com/Khaemenes_Academy.github.io/Health_learning/workout_builder_index.html","desc":"Tool in the Verve N Veda health ecosystem."}]},{"title":"Courses","items":[{"title":"Grade 9 Health & Wellness","url":"https://vervenveda.github.io/medicament-hub.github.io/academy/high-school-health/courses/health-wellness/grade-09/","desc":"Course in the Verve N Veda health ecosystem."},{"title":"Health Is Wealth · 6 Weeks","url":"https://vervenveda.com/Khaemenes_Academy.github.io/Health_learning/Health_is_wealth_6weeks_index.html","desc":"Course in the Verve N Veda health ecosystem."},{"title":"High School Physical Education · 42 Weeks","url":"https://vervenveda.github.io/medicament-hub.github.io/academy/high-school-health/High_School_Physical_Education_42week_index.html","desc":"Course in the Verve N Veda health ecosystem."}]},{"title":"Workshops","items":[{"title":"Wellness Workshop","url":"https://vervenveda.com/Khaemenes_Academy.github.io/Health_learning/wellness_workshop_index.html","desc":"Workshop in the Verve N Veda health ecosystem."}]}]},{"id":"communication","label":"Connect","groups":[{"title":"Apps","items":[{"title":"Bazaar Art Live","url":"https://vervenveda.github.io/333.github.io/app/Bazaar_Art_Live_index.html","desc":"App in the Verve N Veda communication ecosystem."},{"title":"E=Ven Mail","url":"https://vervenveda.github.io/333.github.io/app/EVen_mail_index.html","desc":"App in the Verve N Veda communication ecosystem."},{"title":"HOLLO 333 Direct Connect","url":"https://vervenveda.github.io/333.github.io/app/HOLLO_333_direct_connect_index.html","desc":"App in the Verve N Veda communication ecosystem."},{"title":"KANSEE 333 Meeting Rooms","url":"https://vervenveda.github.io/333.github.io/app/KANSEE_333_meeting_rooms_index.html","desc":"App in the Verve N Veda communication ecosystem."}]},{"title":"Tools","items":[{"title":"Bunya Digital Infrastructure","url":"https://vervenveda.github.io/333.github.io/app/Bunya_digital_infrastructure_index.html","desc":"Tool in the Verve N Veda communication ecosystem."},{"title":"SIte Builder","url":"https://vervenveda.github.io/333.github.io/app/SIte_builder_index.html","desc":"Tool in the Verve N Veda communication ecosystem."}]},{"title":"Networks","items":[{"title":"333 Network","url":"https://vervenveda.github.io/333.github.io/","desc":"Network in the Verve N Veda communication ecosystem."}]}]},{"id":"finance","label":"Finance","groups":[{"title":"Gateways","items":[{"title":"Finance Academy & Hall","url":"https://vervenveda.github.io/finance.github.io/","desc":"Gateway in the Verve N Veda finance ecosystem."}]},{"title":"Tools","items":[{"title":"Budget Planner","url":"https://vervenveda.github.io/finance.github.io/apps/budget_planner_index.html","desc":"Tool in the Verve N Veda finance ecosystem."},{"title":"Small Business Budget","url":"https://vervenveda.github.io/finance.github.io/apps/small-business-budget_index.html","desc":"Tool in the Verve N Veda finance ecosystem."}]},{"title":"Halls","items":[{"title":"Financial Hall","url":"https://vervenveda.github.io/finance.github.io/financial-hall/","desc":"Hall in the Verve N Veda finance ecosystem."},{"title":"Nonprofit Hall","url":"https://vervenveda.github.io/finance.github.io/nonprofit-hall/","desc":"Hall in the Verve N Veda finance ecosystem."}]},{"title":"Workshops","items":[{"title":"6-Week Personal Finance","url":"https://vervenveda.github.io/finance.github.io/workshops/6-week-personal-finance_index.html","desc":"Workshop in the Verve N Veda finance ecosystem."},{"title":"Investment Foundations","url":"https://vervenveda.github.io/finance.github.io/workshops/investment-foundations_index.html","desc":"Workshop in the Verve N Veda finance ecosystem."}]}]},{"id":"research","label":"Research","groups":[{"title":"Gateways","items":[{"title":"PLERA Search","url":"https://vervenveda.github.io/PLERASearch.github.io/","desc":"Gateway in the Verve N Veda research ecosystem."},{"title":"PLERA","url":"https://vervenveda.github.io/PLERA.github.io/","desc":"Primary PLERA movement gateway in the Verve N Veda research ecosystem."}]},{"title":"Tools","items":[{"title":"PLERA Search Gate","url":"https://vervenveda.github.io/PLERASearch.github.io/apps/PLERA_Search_Gate_index.html","desc":"Tool in the Verve N Veda research ecosystem."},{"title":"PLERA Search Pro","url":"https://vervenveda.github.io/PLERASearch.github.io/apps/PLERA_search_pro_index.html","desc":"Tool in the Verve N Veda research ecosystem."}]},{"title":"Halls","items":[{"title":"ARSHIF Faith Hall","url":"https://vervenveda.github.io/Arshif.github.io/Faith/","desc":"Hall in the Verve N Veda research ecosystem."}]},{"title":"Courses","items":[{"title":"Yahushua Study","url":"https://vervenveda.github.io/Arshif.github.io/Faith/apps/Yahushua_Study_index.html","desc":"Course in the Verve N Veda research ecosystem."}]},{"title":"Archives","items":[{"title":"ARSHIF Archives","url":"https://vervenveda.github.io/Arshif.github.io/","desc":"Archive in the Verve N Veda research ecosystem."}]},{"title":"Resources","items":[{"title":"Bible Context","url":"https://vervenveda.github.io/Arshif.github.io/Faith/apps/Bible-context_index.html","desc":"Resource in the Verve N Veda research ecosystem."},{"title":"Biblical Web Directory","url":"https://vervenveda.github.io/Arshif.github.io/Faith/apps/biblical_web_directory_index.html","desc":"Resource in the Verve N Veda research ecosystem."}]}]},{"id":"diplomacy","label":"World & Diplomacy","groups":[{"title":"Gateways","items":[{"title":"Palestine · Land · People · Memory","url":"https://vervenveda.com/Palestine.github.io/","desc":"Source-led bilingual country and cultural guide with archives, documentary history, Gaza, and Academy learning."},{"title":"Saudi Arabia · People · Heritage · Horizon","url":"https://vervenveda.com/Saudi_Arabia.github.io/","desc":"Source-led bilingual country and cultural guide to Saudi history, regions, heritage, society, and learning resources."},{"title":"Iran · Art · Music · Script · Legacy · Innovation","url":"https://vervenveda.com/Iran.github.io/","desc":"Source-led Iranian cultural gateway for art, music, Persian script, heritage, innovation, primary sources, and Academy research tools."}]}]}];
      let activeEcosystemCategory = null;
      let ECOSYSTEM_PAGE_CATALOG = [];
      let ECOSYSTEM_PAGE_CATALOG_READY = false;
      let ECOSYSTEM_PAGE_CATALOG_PARTS = [];
      let ECOSYSTEM_PAGE_CATALOG_EXPECTED_COUNT = null;
      const ECOSYSTEM_PAGE_LIMIT = 120;

      const ECOSYSTEM_CATEGORY_LABELS = Object.freeze({
        news:"News",weather:"Weather",creative:"Creative",professional:"Professional",
        education:"Education",games:"Games",civic:"Civic",environmental:"Earth",
        health:"Health",communication:"Connect",finance:"Finance",research:"Research",
        diplomacy:"World & Diplomacy"
      });

      const ECOSYSTEM_TYPE_GROUPS = Object.freeze({
        gateway:"Gateways",network:"Networks",page:"Pages",app:"Apps",tool:"Tools",
        game:"Games",hall:"Halls",portal:"Portals",course:"Courses",
        assessment:"Assessments",archive:"Archives",mentor:"Mentors",
        resource:"Resources",workshop:"Workshops",studio:"Studios"
      });
      const ECOSYSTEM_TYPE_ORDER = Object.freeze([
        "gateway","network","page","app","tool","game","hall","portal",
        "course","assessment","archive","mentor","resource","workshop","studio"
      ]);
      const ECOSYSTEM_CATEGORY_ORDER = Object.freeze([
        "news","weather","creative","professional","education","games",
        "civic","environmental","health","communication","finance","research","diplomacy"
      ]);
      const NAV_GROUP_BY_CATEGORY = Object.freeze({
        education:"Education",
        research:"Knowledge",news:"Knowledge",weather:"Knowledge",diplomacy:"Knowledge",
        civic:"Public Service",environmental:"Public Service",health:"Public Service",finance:"Public Service",
        creative:"Creative & Professional",professional:"Creative & Professional",
        games:"Creative & Professional",communication:"Creative & Professional",
        gateway:"Knowledge"
      });

      function directoryUrlKey(value){
        try{
          const url=new URL(value,location.href);
          url.hash="";
          url.search="";
          url.pathname=url.pathname.replace(/\/index\.html$/i,"/");
          return url.href;
        }catch{
          return String(value||"");
        }
      }

      function validatedPublicDirectoryUrl(value){
        try{
          const url=new URL(value,location.href);
          if(url.protocol!=="https:" || !ALLOWED_HOSTS.has(url.hostname)) return null;
          return url.href;
        }catch{
          return null;
        }
      }

      function validatedCatalogPartPath(value){
        if(typeof value!=="string") return null;
        const path=value.trim();
        if(!/^\/registry\/[A-Za-z0-9._/-]+\.json$/i.test(path)) return null;
        return path;
      }

      function initialsForDirectory(title){
        const words=String(title||"")
          .replace(/[^A-Za-z0-9 ]+/g," ")
          .trim().split(/\s+/).filter(Boolean);
        if(!words.length) return "→";
        if(words.length===1) return words[0].slice(0,3).toUpperCase();
        return words.slice(0,3).map(word=>word[0]).join("").toUpperCase();
      }

      async function loadCanonicalNavigation(){
        const source="/ecosystem/master-ecosystem-directory.json";
        try{
          const response=await fetch(source,{cache:"no-store",credentials:"same-origin"});
          if(!response.ok) throw new Error(`HTTP ${response.status}`);
          const payload=await response.json();
          if(!Array.isArray(payload?.entries)) throw new Error("entries missing");

          ECOSYSTEM_PAGE_CATALOG_PARTS = Array.isArray(payload?.pageCatalog?.parts)
            ? payload.pageCatalog.parts.map(validatedCatalogPartPath).filter(Boolean)
            : [];
          ECOSYSTEM_PAGE_CATALOG_EXPECTED_COUNT = Number.isSafeInteger(payload?.pageCatalog?.publicPageCount)
            ? payload.pageCatalog.publicPageCount : null;

          const active=payload.entries.filter(entry=>{
            if(!entry || entry.directoryVisible!==true || entry.access!=="free-public" || entry.status!=="active") return false;
            if(!entry.title || !entry.url || !entry.category || !entry.type) return false;
            return Boolean(validatedPublicDirectoryUrl(entry.url));
          });

          if(!active.length) throw new Error("no active public entries");

          const fallbackSiteByUrl=new Map(SITES.map(site=>[directoryUrlKey(site.url),site]));
          const fallbackSiteByTitle=new Map(SITES.map(site=>[String(site.title||"").toLowerCase(),site]));
          const fallbackDirectoryByUrl=new Map(
            ECOSYSTEM_DIRECTORY.flatMap(category=>
              category.groups.flatMap(group=>
                group.items.map(item=>[directoryUrlKey(item.url),item])
              )
            )
          );
          const fallbackDirectoryByTitle=new Map(
            ECOSYSTEM_DIRECTORY.flatMap(category=>
              category.groups.flatMap(group=>
                group.items.map(item=>[String(item.title||"").toLowerCase(),item])
              )
            )
          );

          SITES=active
            .filter(entry=>["gateway","network","portal","page"].includes(entry.type) && entry.id!=="gateway-verve")
            .map(entry=>{
              const prior=fallbackSiteByUrl.get(directoryUrlKey(entry.url)) ||
                          fallbackSiteByTitle.get(String(entry.title||"").toLowerCase()) || {};
              return {
                title:entry.title,
                url:entry.url,
                icon:prior.icon || initialsForDirectory(entry.title),
                group:NAV_GROUP_BY_CATEGORY[entry.category] || "Knowledge",
                desc:prior.desc || `${entry.title} · public ${entry.type} in the Verve N Veda ${ECOSYSTEM_CATEGORY_LABELS[entry.category] || entry.category} ecosystem.`,
                keywords:`${prior.keywords || ""} ${entry.repository || ""} ${entry.path || ""} ${entry.category} ${entry.type}`.trim()
              };
            })
            .sort((a,b)=>{
              const ga=GROUP_ORDER.indexOf(a.group),gb=GROUP_ORDER.indexOf(b.group);
              return (ga<0?99:ga)-(gb<0?99:gb) || a.title.localeCompare(b.title,undefined,{sensitivity:"base"});
            });

          const byCategory=new Map();
          active.forEach(entry=>{
            if(!ECOSYSTEM_CATEGORY_LABELS[entry.category]) return;
            if(!byCategory.has(entry.category)) byCategory.set(entry.category,new Map());
            const groups=byCategory.get(entry.category);
            if(!groups.has(entry.type)) groups.set(entry.type,[]);
            const prior=fallbackDirectoryByUrl.get(directoryUrlKey(entry.url)) ||
                        fallbackDirectoryByTitle.get(String(entry.title||"").toLowerCase()) || {};
            groups.get(entry.type).push({
              title:entry.title,
              url:entry.url,
              type:entry.type,
              desc:prior.desc || `${ECOSYSTEM_TYPE_GROUPS[entry.type] || entry.type} destination in the Verve N Veda ${ECOSYSTEM_CATEGORY_LABELS[entry.category]} ecosystem.`
            });
          });

          ECOSYSTEM_DIRECTORY=ECOSYSTEM_CATEGORY_ORDER
            .filter(id=>byCategory.has(id))
            .map(id=>{
              const typeMap=byCategory.get(id);
              const groups=ECOSYSTEM_TYPE_ORDER
                .filter(type=>typeMap.has(type))
                .map(type=>({
                  title:ECOSYSTEM_TYPE_GROUPS[type] || type,
                  items:typeMap.get(type).sort((a,b)=>a.title.localeCompare(b.title,undefined,{sensitivity:"base"}))
                }));
              return {id,label:ECOSYSTEM_CATEGORY_LABELS[id] || id,groups};
            });

          console.info(
            `Verve N Veda canonical directory loaded: ${active.length} active public destinations from ${source}.`
          );
        }catch(error){
          console.warn("Verve N Veda canonical directory fallback active:",error);
        }
      }

      function ecosystemPageSearchText(page){
        return `${page.title || ""} ${page.source || ""} ${page.repo || ""} ${page.path || ""} ${ECOSYSTEM_CATEGORY_LABELS[page.category] || page.category || ""}`.toLowerCase();
      }

      function completeIndexMatches(){
        const query = ($("ecosystemPageSearch")?.value || "").trim().toLowerCase();
        const category = $("ecosystemPageCategory")?.value || "";
        const repo = $("ecosystemPageRepo")?.value || "";
        const filtered = ECOSYSTEM_PAGE_CATALOG.filter(page =>
          (!query || ecosystemPageSearchText(page).includes(query)) &&
          (!category || page.category === category) &&
          (!repo || page.repo === repo)
        );
        return {query,category,repo,filtered};
      }

      function renderCompletePageIndex(){
        const results = $("ecosystemPageResults");
        const status = $("ecosystemPageStatus");
        if(!results || !status) return;
        if(!ECOSYSTEM_PAGE_CATALOG_READY){
          status.textContent = "Loading complete public page index…";
          results.innerHTML = "";
          return;
        }

        const {query,category,repo,filtered} = completeIndexMatches();
        const activeFilter = Boolean(query || category || repo);
        let visible = filtered;

        if(!activeFilter){
          visible = ECOSYSTEM_PAGE_CATALOG.filter(page => page.path === "index.html");
        }

        visible = visible
          .slice()
          .sort((a,b) => (a.source || "").localeCompare(b.source || "") || (a.path || "").localeCompare(b.path || ""));

        const shown = visible.slice(0,ECOSYSTEM_PAGE_LIMIT);
        if(activeFilter){
          status.textContent = `Indexed ${ECOSYSTEM_PAGE_CATALOG.length.toLocaleString()} public pages · showing ${shown.length.toLocaleString()} of ${visible.length.toLocaleString()} matches${visible.length > shown.length ? " · refine the search to narrow results" : ""}.`;
        }else{
          status.textContent = `Indexed ${ECOSYSTEM_PAGE_CATALOG.length.toLocaleString()} public pages across the connected ecosystem · showing repository gateways until you search or filter.`;
        }

        if(!shown.length){
          results.innerHTML = '<p style="grid-column:1/-1;margin:11px auto;color:var(--ink-soft)">No public page matches the current search and filters.</p>';
          return;
        }

        results.innerHTML = shown.map(page => `
          <a class="complete-index-card"
             href="${escapeAttribute(page.url)}"
             aria-label="Open ${escapeAttribute(page.title || page.path)}">
            <strong>${escapeHtml(page.title || page.path)}</strong>
          </a>`).join("");
      }

      function populateCompleteIndexRepositories(){
        const select = $("ecosystemPageRepo");
        if(!select) return;
        const repos = [...new Set(ECOSYSTEM_PAGE_CATALOG.map(page => page.repo).filter(Boolean))]
          .sort((a,b) => a.localeCompare(b));
        select.innerHTML = '<option value="">All repositories</option>' +
          repos.map(repo => `<option value="${escapeAttribute(repo)}">${escapeHtml(repo.replace(/\.github\.io$/i,""))}</option>`).join("");
      }

      async function loadEcosystemPageCatalog(){
        const status = $("ecosystemPageStatus");
        // One canonical public inventory: the master registry determines the
        // authoritative catalog shards. No historical/dated catalog fallback.
        async function fetchCatalogParts(urls){
          if(!urls.length) throw new Error("canonical catalog parts unavailable");
          const shards=await Promise.all(urls.map(async url=>{
            const response=await fetch(url,{cache:"no-store",credentials:"same-origin"});
            if(!response.ok) throw new Error(`${url} HTTP ${response.status}`);
            const data=await response.json();
            if(!Array.isArray(data?.pages)) throw new Error(`${url} pages missing`);
            return data;
          }));
          const generation=String(shards[0]?.generatedAt||"");
          if(!generation||shards.some(part=>String(part.generatedAt||"")!==generation)){
            throw new Error("catalog shards disagree on generation");
          }
          return shards.flatMap(part=>part.pages);
        }

        try{
          const pages=await fetchCatalogParts(ECOSYSTEM_PAGE_CATALOG_PARTS);
          if(!pages.length) throw new Error("canonical catalog is empty");
          if(ECOSYSTEM_PAGE_CATALOG_EXPECTED_COUNT!==null &&
             pages.length!==ECOSYSTEM_PAGE_CATALOG_EXPECTED_COUNT){
            throw new Error("canonical catalog count mismatch");
          }
          const known=new Set();
          for(const page of pages){
            if(!page?.title||!page?.url||!validatedPublicDirectoryUrl(page.url)){
              throw new Error("canonical catalog contains invalid public destination");
            }
            const key=String(page.url).replace(/\/+$/,"").toLowerCase();
            if(known.has(key)) throw new Error("canonical catalog contains duplicate destination");
            known.add(key);
          }
          ECOSYSTEM_PAGE_CATALOG=pages;
          ECOSYSTEM_PAGE_CATALOG_READY = true;
          populateCompleteIndexRepositories();
          renderCompletePageIndex();
          if($("menuOverlay")?.classList.contains("open")) buildMenu($("menuSearch")?.value || "");
        }catch(error){
          ECOSYSTEM_PAGE_CATALOG_READY = false;
          if(status) status.textContent = "The complete page index is temporarily unavailable. Featured ecosystem doorways remain available above.";
          console.warn("Verve N Veda complete ecosystem index:",error);
        }
      }

      $("ecosystemPageSearch")?.addEventListener("input",renderCompletePageIndex);
      $("ecosystemPageCategory")?.addEventListener("change",renderCompletePageIndex);
      $("ecosystemPageRepo")?.addEventListener("change",renderCompletePageIndex);

      function ecosystemCategoryById(id){
        return ECOSYSTEM_DIRECTORY.find(category => category.id === id) || null;
      }

      function ecosystemCategorySummary(category){
        const count = category.groups.reduce((sum,group) => sum + group.items.length,0);
        const subgroupNames = category.groups.map(group => group.title).join(" · ");
        return `${count} verified ecosystem destination${count === 1 ? "" : "s"} · ${subgroupNames}`;
      }

      function renderEcosystemPanel(category){
        const panel = $("ecosystemDirectoryPanel");
        const heading = $("ecosystemPanelHeading");
        const note = $("ecosystemPanelNote");
        const grid = $("ecosystemPanelGrid");
        if(!panel || !heading || !note || !grid) return;

        heading.textContent = category.label;
        note.textContent = ecosystemCategorySummary(category);
        grid.innerHTML = category.groups.map(group => `
          <section class="ecosystem-subgroup">
            <h4 class="ecosystem-subgroup-title">${escapeHtml(group.title)}</h4>
            <div class="ecosystem-link-list">
              ${group.items.map(entry => `
                <a class="ecosystem-link"
                   href="${escapeAttribute(entry.url)}"
                   target="_blank" rel="noopener noreferrer"
                   data-ecosystem-url="${escapeAttribute(entry.url)}"
                   data-ecosystem-title="${escapeAttribute(entry.title)}"
                   data-ecosystem-desc="${escapeAttribute(entry.desc)}"
                   data-ecosystem-category="${escapeAttribute(category.label)}"
                   data-ecosystem-subgroup="${escapeAttribute(group.title)}"
                   aria-label="Open full page for ${escapeAttribute(entry.title)} in a new tab">
                  <span class="ecosystem-link-copy">
                    <strong>${escapeHtml(entry.title)}</strong>
                    <small>${escapeHtml(entry.desc)}</small>
                  </span>
                  <span class="ecosystem-link-arrow" aria-hidden="true">→</span>
                </a>
              `).join("")}
            </div>
          </section>
        `).join("");
        panel.hidden = false;

        /* Native links open applications in full browsing contexts. The viewer remains an optional featured preview. */
      }

      function setEcosystemCategory(id,{
        scroll=false,
        focusPanel=false
      }={}){
        const category = ecosystemCategoryById(id);
        if(!category) return;

        const buttons = [...document.querySelectorAll(".ecosystem-category-toggle")];
        const shells = [...document.querySelectorAll(".ecosystem-category-doorway")];
        const isClosing = activeEcosystemCategory === id;

        buttons.forEach(button => {
          const expanded = !isClosing && button.dataset.category === id;
          button.setAttribute("aria-expanded", String(expanded));
        });
        shells.forEach(shell => {
          shell.dataset.expanded = String(!isClosing && shell.dataset.categoryShell === id);
        });

        if(isClosing){
          activeEcosystemCategory = null;
          $("ecosystemDirectoryPanel").hidden = true;
          return;
        }

        activeEcosystemCategory = id;
        renderEcosystemPanel(category);

        const panel = $("ecosystemDirectoryPanel");
        requestAnimationFrame(() => {
          if(!panel || panel.hidden) return;
          const rect = panel.getBoundingClientRect();
          const topGuard = Number.parseInt(getComputedStyle(document.documentElement).getPropertyValue("--sticky-stack"),10) || 108;
          if(rect.top < topGuard || rect.bottom > window.innerHeight){
            panel.scrollIntoView({behavior:"smooth",block:"nearest"});
          }
        });

        if(scroll){
          $("directory")?.scrollIntoView({behavior:"smooth",block:"start"});
        }
        if(focusPanel){
          requestAnimationFrame(() => $("ecosystemPanelHeading")?.focus?.());
        }
      }
      const ECOSYSTEM_CATEGORY_HUBS = Object.freeze({
        news:"https://vervenveda.github.io/theverifier.github.io/",
        weather:"https://vervenveda.github.io/solanar.github.io/",
        creative:"https://vervenveda.github.io/bazaarart.github.io/",
        professional:"https://vervenveda.github.io/proresource_hub.github.io/",
        education:"https://vervenveda.com/KhaemenesAcademy_Home.github.io/",
        games:"https://vervenveda.github.io/arcade.github.io/",
        civic:"https://vervenveda.github.io/onenationforall.github.io/",
        environmental:"https://vervenveda.github.io/river_to_road.github.io/",
        health:"https://vervenveda.github.io/medicament-hub.github.io/",
        communication:"https://vervenveda.github.io/333.github.io/",
        finance:"https://vervenveda.github.io/finance.github.io/",
        research:"https://vervenveda.github.io/Arshif.github.io/"
      });

      function ecosystemCategoryHub(category){
        const items=category?.groups?.flatMap(group=>group.items||[]) || [];
        return ECOSYSTEM_CATEGORY_HUBS[category?.id] ||
               items.find(item=>item.type==="gateway"||item.type==="network")?.url ||
               items[0]?.url ||
               "#directory";
      }

      function renderEcosystemDirectory(){
        const grid = $("ecosystemCategoryGrid");
        if(!grid) return;

        grid.innerHTML = ECOSYSTEM_DIRECTORY.map(category => {
          const hubUrl = ecosystemCategoryHub(category);
          return `
            <div class="ecosystem-category-doorway"
                 data-category-shell="${escapeAttribute(category.id)}"
                 data-expanded="false">
              <a class="ecosystem-category-link"
                 href="${escapeAttribute(hubUrl)}"
                 aria-label="Open ${escapeAttribute(category.label)} hub">
                <span>${escapeHtml(category.label)}</span>
              </a>
              <button class="ecosystem-category-toggle"
                      type="button"
                      data-category="${escapeAttribute(category.id)}"
                      aria-expanded="false"
                      aria-controls="ecosystemDirectoryPanel"
                      aria-label="Browse ${escapeAttribute(category.label)} resources">
                <span aria-hidden="true">⌄</span>
              </button>
            </div>`;
        }).join("") + [
          ["Khaemenes Academy","https://vervenveda.com/KhaemenesAcademy_Home.github.io/"],
          ["Arshif Archives","https://vervenveda.github.io/Arshif.github.io/"],
          ["PLERA Search","https://vervenveda.github.io/PLERASearch.github.io/"]
        ].map(([label,url]) =>
          '<div class="ecosystem-category-doorway ecosystem-quick-doorway">'+
          '<a class="ecosystem-category-link" href="'+escapeAttribute(url)+'" aria-label="Open '+escapeAttribute(label)+'">'+
          '<span>'+escapeHtml(label)+'</span></a></div>'
        ).join("");

        grid.addEventListener("click",event => {
          const toggle = event.target.closest(".ecosystem-category-toggle");
          if(!toggle || !grid.contains(toggle)) return;
          setEcosystemCategory(toggle.dataset.category,{focusPanel:false});
        });

        $("ecosystemPanelClose")?.addEventListener("click",() => {
          if(!activeEcosystemCategory) return;
          const prior = document.querySelector(`.ecosystem-category-toggle[data-category="${activeEcosystemCategory}"]`);
          activeEcosystemCategory = null;
          $("ecosystemDirectoryPanel").hidden = true;
          document.querySelectorAll(".ecosystem-category-toggle").forEach(button => button.setAttribute("aria-expanded","false"));
          document.querySelectorAll(".ecosystem-category-doorway").forEach(shell => shell.dataset.expanded="false");
          prior?.focus();
        });

        document.addEventListener("keydown",event => {
          if(event.key !== "Escape" || !activeEcosystemCategory || $("menuOverlay")?.classList.contains("open") || $("adminGate")?.classList.contains("open")) return;
          const prior = document.querySelector(`.ecosystem-category-toggle[data-category="${activeEcosystemCategory}"]`);
          activeEcosystemCategory = null;
          $("ecosystemDirectoryPanel").hidden = true;
          document.querySelectorAll(".ecosystem-category-toggle").forEach(button => button.setAttribute("aria-expanded","false"));
          document.querySelectorAll(".ecosystem-category-doorway").forEach(shell => shell.dataset.expanded="false");
          prior?.focus();
        });
      }

      document.querySelectorAll("[data-group-browse]").forEach(button => {
        button.addEventListener("click",() => {
          openMenu(button.dataset.groupBrowse || "");
        });
      });

      document.querySelectorAll(".feature-card-doorway[data-href]").forEach(card => {
        const openCard = () => {
          const href = card.dataset.href;
          if(href) window.location.assign(href);
        };
        card.addEventListener("click",openCard);
        card.addEventListener("keydown",event => {
          if(event.key === "Enter" || event.key === " "){
            event.preventDefault();
            openCard();
          }
        });
      });

      const networkTicker = $("networkTicker");
      const tickerControl = $("tickerControl");
      let storedTickerState = false;

      try{
        storedTickerState = localStorage.getItem("VNV_TICKER_PAUSED") === "true";
      }catch{}

      function setTickerPaused(paused){
        networkTicker.dataset.paused = String(paused);
        tickerControl.setAttribute("aria-pressed",String(paused));
        tickerControl.setAttribute("aria-label",paused ? "Resume 333 Network ticker" : "Pause 333 Network ticker");
        tickerControl.textContent = paused ? "▶" : "Ⅱ";
        try{localStorage.setItem("VNV_TICKER_PAUSED",String(paused));}catch{}
      }

      setTickerPaused(storedTickerState);
      tickerControl.addEventListener("click",() => {
        setTickerPaused(networkTicker.dataset.paused !== "true");
      });

      const menuOverlay = $("menuOverlay");
      const menuDrawer = $("menuDrawer");

      /* Complete drawer directory ----------------------------------------
         Uses the primary SITES registry so the drawer remains a concise
         gateway while the larger ecosystem directory handles deep links. */
      const MENU_BRANCHES = Object.freeze([
        {
          id:"home",
          label:"Verve N Veda Home",
          desc:"Main gateway, ecosystem search, and network entry points.",
          categoryIds:[],
          special:"home"
        },
        {
          id:"academy",
          label:"Khaemenes Academy",
          desc:"Schools, courses, learning portals, assessments, and academic tools.",
          categoryIds:["education"]
        },
        {
          id:"professional",
          label:"Professional",
          desc:"Professional studios, practical tools, resources, and workspaces.",
          categoryIds:["professional"]
        },
        {
          id:"creative",
          label:"Creative",
          desc:"Art, music, studios, creative tools, galleries, and games.",
          categoryIds:["creative","games"]
        },
        {
          id:"communication",
          label:"Communication",
          desc:"Networks, mail, meetings, publishing, and connected communication tools.",
          categoryIds:["communication"],
          siteTitles:["333 Network"]
        },
        {
          id:"citizen",
          label:"Citizen Resources",
          desc:"Health, finance, weather, Earth, legal, veteran, research, and practical public resources.",
          categoryIds:["health","finance","weather","environmental","research"],
          siteTitles:["Firmament Law","Veterans"]
        },
        {
          id:"civic",
          label:"Civic and Political",
          desc:"Civic learning, public policy, elections, diplomacy, campaigns, and news.",
          categoryIds:["civic","diplomacy","news"],
          siteTitles:["One Nation for All","Jennifer Pearl 2028 · GitHub","Jennifer Pearl 2028 · Campaign Home"]
        },
        {
          id:"ai",
          label:"AI Mentors",
          desc:"NAIB and the ecosystem's registered mentors, guides, and AI learning companions.",
          categoryIds:[],
          siteTitles:["NAIB"],
          special:"mentors"
        }
      ]);

      let activeMenuBranch = "";

      function menuLinkHtml(item){
        return `
          <a class="menu-link" href="${escapeAttribute(item.url)}"
             aria-label="Open ${escapeAttribute(item.title)}">
            <i aria-hidden="true">${escapeHtml(item.icon || "→")}</i>
            <span>
              <strong>${escapeHtml(item.title)}</strong>
              <small>${escapeHtml(item.desc || "Verve N Veda ecosystem destination.")}</small>
            </span>
            <span aria-hidden="true">→</span>
          </a>`;
      }

      function branchDirectoryItems(branch){
        const seen = new Set();
        const sections = [];

        if(branch.special === "home"){
          sections.push({
            title:"Main Gateways",
            items:[
              {title:"Verve N Veda Home",url:"https://vervenveda.com/",icon:"V",desc:"Return to the main Verve N Veda public gateway."},
              {title:"Explore the Ecosystem",url:"https://vervenveda.com/#directory",icon:"◎",desc:"Open the complete public ecosystem directory."},
              {title:"PLERA Search",url:"https://vervenveda.github.io/PLERASearch.github.io/",icon:"⌕",desc:"Search connected public learning and resource destinations."},
              {title:"333 Network",url:"https://vervenveda.github.io/333.github.io/",icon:"333",desc:"Open the Verve N Veda communication and network gateway."}
            ]
          });
          return sections;
        }

        for(const categoryId of branch.categoryIds || []){
          const category = ECOSYSTEM_DIRECTORY.find(entry => entry.id === categoryId);
          if(!category) continue;
          for(const group of category.groups || []){
            const items = (group.items || []).filter(item => {
              const key = directoryUrlKey(item.url);
              if(!item.url || seen.has(key)) return false;
              seen.add(key);
              return true;
            }).map(item => ({
              ...item,
              icon:initialsForDirectory(item.title)
            }));
            if(items.length){
              sections.push({
                title:`${category.label} · ${group.title}`,
                items
              });
            }
          }
        }

        const specialSites = SITES.filter(site => (branch.siteTitles || []).includes(site.title));
        const uniqueSpecial = specialSites.filter(site => {
          const key=directoryUrlKey(site.url);
          if(seen.has(key)) return false;
          seen.add(key);
          return true;
        });
        if(uniqueSpecial.length) sections.unshift({title:"Gateways",items:uniqueSpecial});

        if(branch.special === "mentors"){
          const mentorItems=[];
          for(const category of ECOSYSTEM_DIRECTORY){
            for(const group of category.groups || []){
              for(const item of group.items || []){
                const haystack=`${group.title} ${item.title} ${item.desc || ""}`.toLowerCase();
                if(!/(mentor|guide|naib|ai companion|assistant)/.test(haystack)) continue;
                const key=directoryUrlKey(item.url);
                if(!item.url || seen.has(key)) continue;
                seen.add(key);
                mentorItems.push({...item,icon:initialsForDirectory(item.title)});
              }
            }
          }
          if(mentorItems.length) sections.push({title:"Mentors & Guides",items:mentorItems});
        }

        return sections;
      }

      function renderMenuRoot(){
        activeMenuBranch="";
        const content=$("menuContent");
        if(!content) return;
        content.innerHTML=`
          <div class="menu-branch-home" aria-label="Verve N Veda main menu folders">
            ${MENU_BRANCHES.map(branch => `
              <button class="menu-branch-button" type="button" data-menu-branch="${escapeAttribute(branch.id)}"
                      aria-label="Open ${escapeAttribute(branch.label)} folder">
                <span>
                  <strong>${escapeHtml(branch.label)}</strong>
                  <small>${escapeHtml(branch.desc)}</small>
                </span>
                <span class="menu-branch-arrow" aria-hidden="true">›</span>
              </button>`).join("")}
          </div>`;
      }

      function renderMenuBranch(branchId){
        const content=$("menuContent");
        const branch=MENU_BRANCHES.find(entry => entry.id === branchId);
        if(!content || !branch){ renderMenuRoot(); return; }
        activeMenuBranch=branch.id;
        const sections=branchDirectoryItems(branch);
        content.innerHTML=`
          <div class="menu-branch-toolbar">
            <button class="menu-branch-back" type="button" data-menu-home aria-label="Back to main menu folders">← Main folders</button>
            <div class="menu-branch-title">${escapeHtml(branch.label)}</div>
          </div>
          ${sections.length ? sections.map(section => `
            <section class="menu-subgroup" aria-label="${escapeAttribute(section.title)}">
              <div class="menu-subgroup-title">${escapeHtml(section.title)}</div>
              <div class="menu-list">
                ${section.items.map(menuLinkHtml).join("")}
              </div>
            </section>`).join("") :
            '<p role="status" style="margin:22px 0;color:var(--ink-soft);font-size:13px">This branch is ready for registered destinations.</p>'}`;
        content.querySelector("[data-menu-home]")?.focus();
      }

      function buildMenu(query = ""){
        const content = $("menuContent");
        if(!content) return;

        const term = String(query || "").trim().toLowerCase();
        if(!term){
          if(activeMenuBranch) renderMenuBranch(activeMenuBranch);
          else renderMenuRoot();
          return;
        }

        const matches = SITES.filter(site => searchableText(site).includes(term));
        const pageMatches = term.length >= 2 && ECOSYSTEM_PAGE_CATALOG_READY
          ? ECOSYSTEM_PAGE_CATALOG.filter(page => ecosystemPageSearchText(page).includes(term)).slice(0,80)
          : [];

        if(!matches.length && !pageMatches.length){
          content.innerHTML = `
            <div class="menu-branch-toolbar">
              <button class="menu-branch-back" type="button" data-menu-home>← Main folders</button>
              <div class="menu-branch-title">Search</div>
            </div>
            <p role="status" style="margin:22px 0 0;color:var(--ink-soft);font-size:13px;line-height:1.6">
              No public ecosystem page matches <strong>${escapeHtml(query)}</strong>.
            </p>`;
          return;
        }

        const gatewayHtml = matches.length ? `
          <section aria-label="Gateway matches">
            <div class="menu-group">Gateway Matches</div>
            <div class="menu-list">
              ${matches.map(menuLinkHtml).join("")}
            </div>
          </section>` : "";

        const pageHtml = pageMatches.length ? `
          <section class="menu-page-results" aria-label="Matching public pages">
            <div class="menu-group">Complete Page Index · ${pageMatches.length} shown</div>
            <div class="menu-list">
              ${pageMatches.map(page => menuLinkHtml({
                title:page.title || page.path,
                url:page.url,
                icon:"↗",
                desc:`${page.source || page.repo} · ${page.path}`
              })).join("")}
            </div>
            <p class="menu-page-note">Search covers the complete public catalog. Refine your words if more than 80 pages match.</p>
          </section>` : "";

        content.innerHTML = `
          <div class="menu-branch-toolbar">
            <button class="menu-branch-back" type="button" data-menu-home>← Main folders</button>
            <div class="menu-branch-title">Search</div>
          </div>` + gatewayHtml + pageHtml;
      }

      function getFocusableElements(){
        return [...menuDrawer.querySelectorAll(
          'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),[tabindex]:not([tabindex="-1"])'
        )].filter(element => !element.hasAttribute("hidden"));
      }

      function openMenu(initialQuery = ""){
        lastFocusedElement = document.activeElement;
        menuOverlay.classList.add("open");
        menuOverlay.setAttribute("aria-hidden","false");
        $("menuButton").setAttribute("aria-expanded","true");
        document.body.classList.add("menu-open");
        const query = String(initialQuery || "");
        activeMenuBranch="";
        $("menuSearch").value = query;
        buildMenu(query);
        setTimeout(() => {
          $("menuSearch").focus();
          if(query) $("menuSearch").select();
        },80);
      }

      function closeMenu(restoreFocus = true){
        if(!menuOverlay.classList.contains("open")) return;
        menuOverlay.classList.remove("open");
        menuOverlay.setAttribute("aria-hidden","true");
        $("menuButton").setAttribute("aria-expanded","false");
        document.body.classList.remove("menu-open");
        $("menuSearch").value = "";
        activeMenuBranch="";
        buildMenu();
        if(restoreFocus && lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
      }

      $("menuButton").addEventListener("click",openMenu);
      $("openAllGateways")?.addEventListener("click",() => openMenu(""));
      $("closeMenu").addEventListener("click",() => closeMenu());
      menuOverlay.addEventListener("click",event => {
        if(event.target === menuOverlay) closeMenu();
      });
      $("menuSearch").addEventListener("input",event => {
        activeMenuBranch="";
        buildMenu(event.target.value);
      });
      $("menuContent").addEventListener("click",event => {
        const branchButton=event.target.closest("[data-menu-branch]");
        if(branchButton){
          renderMenuBranch(branchButton.dataset.menuBranch);
          return;
        }
        const homeButton=event.target.closest("[data-menu-home]");
        if(homeButton){
          activeMenuBranch="";
          $("menuSearch").value="";
          renderMenuRoot();
        }
      });

      document.addEventListener("keydown",event => {
        if(!menuOverlay.classList.contains("open") &&
           event.key === "/" &&
           !/^(INPUT|SELECT|TEXTAREA)$/.test(document.activeElement?.tagName || "")){
          event.preventDefault();
          openMenu();
          return;
        }

        if(!menuOverlay.classList.contains("open")) return;

        if(event.key === "Escape"){
          event.preventDefault();
          closeMenu();
          return;
        }

        if(event.key === "Tab"){
          const focusable = getFocusableElements();
          if(!focusable.length) return;
          const first = focusable[0];
          const last = focusable[focusable.length - 1];

          if(event.shiftKey && document.activeElement === first){
            event.preventDefault();
            last.focus();
          }else if(!event.shiftKey && document.activeElement === last){
            event.preventDefault();
            first.focus();
          }
        }
      });



      await loadCanonicalNavigation();

      /* Featured ecosystem discovery -------------------------------------- */
      const NON_EMBEDDABLE_URLS = new Set([
        "https://vervenveda.github.io/medicament-hub.github.io/",
        "https://vervenveda.github.io/river_to_road.github.io/"
      ]);

      function isKnownNonEmbeddable(url){
        try{
          const normalized = new URL(url,window.location.href).href;
          return NON_EMBEDDABLE_URLS.has(normalized);
        }catch{
          return false;
        }
      }

      const FEATURE_MEDIA = Object.freeze({
        /* Optional visuals can be added without changing slideshow logic.
           Example:
           "https://vervenveda.github.io/bazaarart.github.io/": {
             image:"assets/bazaar-art-feature.jpg",
             alt:"Bazaar Art feature poster",
             type:"Feature poster"
           }
        */
      });

      const FEATURE_POOL = ECOSYSTEM_DIRECTORY.flatMap(category =>
        category.groups.flatMap(group =>
          group.items.map(item => ({
            ...item,
            categoryId:category.id,
            category:category.label,
            subgroup:group.title
          }))
        )
      ).filter(item => item.url && item.title && item.desc);

      let featuredIndex = -1;
      let featureTimer = 0;
      let featurePaused = false;
      let featureHoverPaused = false;
      let currentFeature = null;
      let viewerCurrentItem = null;
      let viewerLastFocus = null;
      const FEATURE_INTERVAL = 4000;

      function featureInitials(title){
        const words=String(title).replace(/[^A-Za-z0-9 ]+/g," ").trim().split(/\s+/).filter(Boolean);
        if(!words.length) return "V";
        if(words.length===1) return words[0].slice(0,3).toUpperCase();
        return words.slice(0,3).map(word=>word[0]).join("").toUpperCase();
      }

      function chooseRandomFeature(){
        if(!FEATURE_POOL.length) return null;
        if(FEATURE_POOL.length===1){ featuredIndex=0; return FEATURE_POOL[0]; }
        let next=featuredIndex;
        while(next===featuredIndex) next=Math.floor(Math.random()*FEATURE_POOL.length);
        featuredIndex=next;
        return FEATURE_POOL[next];
      }

      function renderFeature(item,{animate=true}={}){
        if(!item) return;
        const slide=$("featureSlide");
        const apply=()=>{
          currentFeature=item;
          $("featureOpenButton").href=item.url;
          const media=FEATURE_MEDIA[item.url] || null;
          const visual=$("featureVisual");
          const image=$("featureImage");
          visual.classList.toggle("has-image",Boolean(media?.image));
          if(media?.image){
            image.src=media.image;
            image.alt=media.alt || `${item.title} feature image`;
          }else{
            image.removeAttribute("src");
            image.alt="";
          }
          $("featureMonogram").textContent=featureInitials(item.title);
          $("featureVisualLabel").textContent=media?.type || `${item.category} · ${item.subgroup}`;
          $("featureKicker").textContent=`Featured · ${item.category}`;
          $("featureTitle").textContent=item.title;
          $("featureDescription").textContent=item.desc;
          $("featureBreadcrumbs").innerHTML=`
            <span>Verve N Veda</span><span aria-hidden="true">›</span>
            <span>${escapeHtml(item.category)}</span><span aria-hidden="true">›</span>
            <span>${escapeHtml(item.subgroup)}</span>`;
          $("featureCounter").textContent=`${featuredIndex+1} of ${FEATURE_POOL.length} possible features`;
        };

        if(!animate || window.matchMedia("(prefers-reduced-motion: reduce)").matches){
          apply();
          return;
        }
        slide.classList.remove("is-entering");
        slide.classList.add("is-leaving");
        window.setTimeout(()=>{
          apply();
          slide.classList.remove("is-leaving");
          slide.classList.add("is-entering");
          requestAnimationFrame(()=>requestAnimationFrame(()=>slide.classList.remove("is-entering")));
        },240);
      }

      function advanceFeature(){ renderFeature(chooseRandomFeature()); }

      function stopFeatureTimer(){
        if(featureTimer){ window.clearInterval(featureTimer); featureTimer=0; }
      }

      function startFeatureTimer(){
        stopFeatureTimer();
        if(featurePaused || featureHoverPaused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        featureTimer=window.setInterval(advanceFeature,FEATURE_INTERVAL);
      }

      function syncFeaturePauseButton(){
        const button=$("featurePauseButton");
        if(!button) return;
        button.setAttribute("aria-pressed",String(featurePaused));
        button.textContent=featurePaused ? "Play" : "Pause";
      }

      function viewerBreadcrumbHtml(item){
        return `<strong>Verve N Veda</strong><span>›</span><span>${escapeHtml(item.category)}</span><span>›</span><span>${escapeHtml(item.subgroup)}</span><span>›</span><span>${escapeHtml(item.title)}</span>`;
      }

      function openFeatureViewer(item){
        if(!item) return;
        viewerCurrentItem=item;
        viewerLastFocus=document.activeElement;
        const overlay=$("ecosystemViewerOverlay");
        $("viewerBreadcrumbs").innerHTML=viewerBreadcrumbHtml(item);
        $("viewerTitle").textContent=item.title;
        $("viewerDescription").textContent=item.desc;
        $("viewerFullLink").href=item.url;
        const frame=$("viewerFrame");
        const blocked=$("viewerEmbedBlocked");
        const nonEmbeddable=isKnownNonEmbeddable(item.url);
        frame.title=`${item.title} — Verve N Veda ecosystem viewer`;
        frame.hidden=nonEmbeddable;
        blocked.hidden=!nonEmbeddable;
        if(nonEmbeddable){
          frame.src="about:blank";
          $("viewerBlockedTitle").textContent=item.title;
          $("viewerBlockedLink").href=item.url;
        }else{
          frame.src=item.url;
        }
        overlay.classList.add("open");
        overlay.setAttribute("aria-hidden","false");
        document.body.classList.add("feature-viewer-open");
        stopFeatureTimer();
        window.setTimeout(()=>$("viewerClose")?.focus(),80);
      }

      function closeFeatureViewer({restoreFocus=true}={}){
        const overlay=$("ecosystemViewerOverlay");
        if(!overlay?.classList.contains("open")) return;
        overlay.classList.remove("open");
        overlay.setAttribute("aria-hidden","true");
        document.body.classList.remove("feature-viewer-open");
        $("viewerFrame").src="about:blank";
        $("viewerFrame").hidden=false;
        $("viewerEmbedBlocked").hidden=true;
        viewerCurrentItem=null;
        if(restoreFocus && viewerLastFocus instanceof HTMLElement) viewerLastFocus.focus();
        startFeatureTimer();
      }

      function printCurrentFeature(){
        const item=viewerCurrentItem || currentFeature;
        if(!item) return;

        const frame=$("viewerFrame");
        let sameOrigin=false;
        try{
          sameOrigin=new URL(item.url,window.location.href).origin === window.location.origin;
        }catch{}
        const canPrintFrame=Boolean(
          frame &&
          !frame.hidden &&
          frame.src &&
          frame.src !== "about:blank" &&
          sameOrigin &&
          !isKnownNonEmbeddable(item.url)
        );

        if(canPrintFrame){
          try{
            frame.contentWindow.focus();
            frame.contentWindow.print();
            return;
          }catch{}
        }

        const printWindow=window.open("","vnvFeaturePrint","width=820,height=720");
        if(!printWindow) return;
        const media=FEATURE_MEDIA[item.url] || null;
        printWindow.document.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(item.title)}</title><style>body{font-family:Georgia,serif;color:#18201c;margin:48px;line-height:1.6}small{font-size:11px;letter-spacing:.12em;text-transform:uppercase;color:#806a42}h1{font-weight:444;font-size:33px}img{max-width:100%;max-height:420px;object-fit:contain;border:1px solid #ddd}a{color:#21493d;word-break:break-all}.crumb{font:11px Arial,sans-serif;color:#756d60;margin-bottom:24px}

</style></head><body><div class="crumb">Verve N Veda › ${escapeHtml(item.category)} › ${escapeHtml(item.subgroup)}</div><small>Featured ecosystem destination</small><h1>${escapeHtml(item.title)}</h1>${media?.image?`<img src="${escapeAttribute(media.image)}" alt="${escapeAttribute(media.alt||"")}">`:""}<p>${escapeHtml(item.desc)}</p><p><a href="${escapeAttribute(item.url)}">${escapeHtml(item.url)}</a></p><script>window.onload=()=>window.print()<\/script>
</body></html>`);
        printWindow.document.close();
      }

      function initFeaturedShowcase(){
        if(!FEATURE_POOL.length || !$("featureSlide")) return;
        renderFeature(chooseRandomFeature(),{animate:false});
        syncFeaturePauseButton();
        startFeatureTimer();

        $("featurePreviewButton")?.addEventListener("click",()=>openFeatureViewer(currentFeature));
        $("featurePauseButton")?.addEventListener("click",()=>{
          featurePaused=!featurePaused;
          syncFeaturePauseButton();
          startFeatureTimer();
        });

        const showcase=$("ecosystemFeatureShowcase");
        showcase?.addEventListener("mouseenter",()=>{featureHoverPaused=true;stopFeatureTimer()});
        showcase?.addEventListener("mouseleave",()=>{featureHoverPaused=false;startFeatureTimer()});
        showcase?.addEventListener("focusin",()=>{featureHoverPaused=true;stopFeatureTimer()});
        showcase?.addEventListener("focusout",event=>{
          if(showcase.contains(event.relatedTarget)) return;
          featureHoverPaused=false;
          startFeatureTimer();
        });

        $("viewerClose")?.addEventListener("click",()=>closeFeatureViewer());
        $("viewerPrint")?.addEventListener("click",printCurrentFeature);
        $("ecosystemViewerOverlay")?.addEventListener("click",event=>{
          if(event.target===$("ecosystemViewerOverlay")) closeFeatureViewer();
        });

        document.addEventListener("keydown",event=>{
          const overlay=$("ecosystemViewerOverlay");
          if(!overlay?.classList.contains("open")) return;
          if(event.key==="Escape"){
            event.preventDefault();
            closeFeatureViewer();
            return;
          }
          if(event.key==="Tab"){
            const focusable=[...$("ecosystemViewer").querySelectorAll('a[href],button:not([disabled]),iframe,[tabindex]:not([tabindex="-1"])')];
            if(!focusable.length) return;
            const first=focusable[0],last=focusable[focusable.length-1];
            if(event.shiftKey && document.activeElement===first){event.preventDefault();last.focus()}
            else if(!event.shiftKey && document.activeElement===last){event.preventDefault();first.focus()}
          }
        });
      }

      $("destinationCount").textContent = String(SITES.length);
      $("year").textContent = String(new Date().getFullYear());
      validateSiteRegistry();
      renderEcosystemDirectory();
      buildMenu();
      renderCompletePageIndex();
      loadEcosystemPageCatalog();
      initFeaturedShowcase();
    })();
```

## Additional featured slideshow asset — full source, not loaded by current index

**Asset:** `assets/vnv-featured-slideshow.js`, blob `c8315139b66c346a7fb559106309f3e5885fd961`. Preserve for topology audit. Do not assume the separate file is the active homepage slideshow.

```javascript
/* Verve N Veda · portable Featured Ecosystem Slideshow v1.0.0.
   Read-only public registry. No browser storage, admin, STOS or global navigation changes. */
(()=>{"use strict";
if(window.VNVFeaturedSlideshow)return;
const SOURCE="https://vervenveda.com/ecosystem/master-ecosystem-directory.json";
const STYLE_ID="vnv-featured-slideshow-styles";
const mounted=new WeakSet();
function style(){
 if(document.getElementById(STYLE_ID))return;
 const el=document.createElement("style");el.id=STYLE_ID;el.textContent=`
.vnv-featured{max-width:1040px;margin:38px auto;padding:0 22px;font:400 16px/1.55 "Brandon Grotesque",Nunito,Arial,sans-serif;color:#26302a}
.vnv-featured *{box-sizing:border-box}
.vnv-featured__heading{text-align:center;margin:0 0 16px}
.vnv-featured__heading p{margin:0;color:#8c6c3b;font:400 16px/1.5 Cinzel,Georgia,serif;letter-spacing:.09em;text-transform:uppercase}
.vnv-featured__heading h2{font:400 clamp(25px,3vw,33px)/1.3 Cinzel,Georgia,serif;margin:5px 0 8px;color:#202824}
.vnv-featured__slide{display:grid;grid-template-columns:minmax(165px,27%) 1fr;min-height:240px;border:1px solid #cbbd9d;border-radius:7px;overflow:hidden;background:#f7f2e8;box-shadow:0 10px 30px rgba(0,0,0,.06)}
.vnv-featured__visual{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;min-height:240px;background:linear-gradient(145deg,#0d1713,#27382f);color:#f8f0df;padding:22px;text-align:center}
.vnv-featured__monogram{width:83px;height:83px;border:1px solid #bc9a60;display:grid;place-items:center;font:400 34px/1 Cinzel,Georgia,serif;letter-spacing:.02em}
.vnv-featured__visual-label{font-size:16px;letter-spacing:.07em}
.vnv-featured__content{padding:25px 30px;display:flex;flex-direction:column;justify-content:center;gap:11px;text-align:left;min-width:0}
.vnv-featured__category{font:400 16px Cinzel,Georgia,serif;color:#93703c;letter-spacing:.09em;text-transform:uppercase;margin:0}
.vnv-featured__title{font:400 clamp(23px,2.6vw,32px)/1.3 Cinzel,Georgia,serif;color:#202824;margin:0;overflow-wrap:anywhere}
.vnv-featured__description{margin:0;font-size:16px;color:#3e4a44}
.vnv-featured__actions{display:flex;gap:9px;align-items:center;flex-wrap:wrap;margin-top:6px}
.vnv-featured__actions button,.vnv-featured__actions a{font:400 16px/1.3 Nunito,Arial,sans-serif;border-radius:7px;border:1px solid #a89063;padding:10px 13px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;text-decoration:none;cursor:pointer}
.vnv-featured__actions a{background:#222c27;color:#fbf4e7}
.vnv-featured__actions button{background:#fffaf0;color:#222c27}
.vnv-featured__actions :focus-visible{outline:3px solid #b48b45;outline-offset:2px}
.vnv-featured__count{font-size:16px;color:#59665f}
.vnv-featured__preview{border:1px solid #bda77c;border-radius:7px;padding:0;width:min(94vw,1060px);height:min(89vh,820px);max-width:1060px;max-height:820px;overflow:hidden;background:#fff}
.vnv-featured__preview::backdrop{background:rgba(0,0,0,.67)}
.vnv-featured__preview-bar{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px;background:#25332b;color:#fff9ed;font-size:16px}
.vnv-featured__preview-bar a,.vnv-featured__preview-bar button{color:#fff9ed;background:#25332b;border:1px solid #d8bf8d;border-radius:7px;padding:8px 12px;font-size:16px}
.vnv-featured__preview iframe{height:calc(100% - 65px);width:100%;border:0;background:#fff}
@media(max-width:650px){.vnv-featured{padding:0 12px;margin:25px auto}.vnv-featured__slide{grid-template-columns:1fr}.vnv-featured__visual{min-height:125px}.vnv-featured__content{padding:18px}.vnv-featured__monogram{height:55px;width:55px;font-size:25px}}
@media(prefers-reduced-motion:reduce){.vnv-featured *{scroll-behavior:auto}}
`;document.head.appendChild(el);
}
const txt=(node,value)=>{node.textContent=value||""};
function mount(root){
 if(!root||mounted.has(root))return;
 mounted.add(root);style();
 const title=root.dataset.vnvFeaturedTitle||"Featured Across Verve N Veda";
 const label=root.dataset.vnvFeaturedLabel||"Public ecosystem";
 const categories=(root.dataset.vnvFeaturedCategories||"").split(",").map(s=>s.trim()).filter(Boolean);
 const keywords=(root.dataset.vnvFeaturedKeywords||"").toLowerCase().split(",").map(s=>s.trim()).filter(Boolean);
 const limit=Math.max(1,Math.min(150,Number(root.dataset.vnvFeaturedLimit)||60));
 root.classList.add("vnv-featured");
 const heading=document.createElement("div");heading.className="vnv-featured__heading";
 const eyebrow=document.createElement("p");txt(eyebrow,label);
 const h2=document.createElement("h2");txt(h2,title);heading.append(eyebrow,h2);
 const slide=document.createElement("article");slide.className="vnv-featured__slide";slide.setAttribute("aria-label","Featured public destination");
 const visual=document.createElement("div");visual.className="vnv-featured__visual";
 const mono=document.createElement("span");mono.className="vnv-featured__monogram";mono.setAttribute("aria-hidden","true");
 const visualLabel=document.createElement("span");visualLabel.className="vnv-featured__visual-label";visual.append(mono,visualLabel);
 const content=document.createElement("div");content.className="vnv-featured__content";
 const category=document.createElement("p");category.className="vnv-featured__category";
 const featureTitle=document.createElement("h3");featureTitle.className="vnv-featured__title";
 const description=document.createElement("p");description.className="vnv-featured__description";
 const actions=document.createElement("div");actions.className="vnv-featured__actions";
 const open=document.createElement("a");open.textContent="Open Full Page";open.target="_blank";open.rel="noopener noreferrer";
 const preview=document.createElement("button");preview.type="button";preview.textContent="Preview";
 const pause=document.createElement("button");pause.type="button";pause.textContent="Pause";pause.setAttribute("aria-pressed","false");
 const counter=document.createElement("span");counter.className="vnv-featured__count";counter.setAttribute("aria-live","off");
 actions.append(open,preview,pause,counter);content.append(category,featureTitle,description,actions);slide.append(visual,content);root.append(heading,slide);
 const dialog=document.createElement("dialog");dialog.className="vnv-featured__preview";
 const bar=document.createElement("div");bar.className="vnv-featured__preview-bar";
 const previewName=document.createElement("span");
 const previewLink=document.createElement("a");previewLink.textContent="Open Full Page";previewLink.target="_blank";previewLink.rel="noopener noreferrer";
 const close=document.createElement("button");close.type="button";close.textContent="Close";
 bar.append(previewName,previewLink,close);
 const frame=document.createElement("iframe");frame.title="Featured destination preview";frame.setAttribute("sandbox","allow-scripts allow-forms");frame.referrerPolicy="strict-origin-when-cross-origin";
 dialog.append(bar,frame);root.append(dialog);
 close.addEventListener("click",()=>dialog.close());dialog.addEventListener("click",event=>{if(event.target===dialog)dialog.close()});
 dialog.addEventListener("close",()=>frame.removeAttribute("src"));
 let items=[],index=0,paused=false,timer=null;
 function render(){
  if(!items.length)return;
  const item=items[index];txt(mono,item.title.split(/\s+/).slice(0,2).map(s=>s[0]).join("").toUpperCase());
  txt(visualLabel,(item.category||"Ecosystem").replace(/-/g," "));txt(category,item.category);
  txt(featureTitle,item.title);txt(description,item.description||"Explore this free public resource across Verve N Veda.");
  open.href=item.url;txt(counter,(index+1)+" of "+items.length);
  previewLink.href=item.url;txt(previewName,item.title);
 }
 function stop(){if(timer){clearInterval(timer);timer=null}}
 function start(){stop();if(!paused&&items.length>1&&!matchMedia("(prefers-reduced-motion: reduce)").matches)timer=setInterval(()=>{index=(index+1)%items.length;render()},8000)}
 pause.addEventListener("click",()=>{paused=!paused;pause.textContent=paused?"Resume":"Pause";pause.setAttribute("aria-pressed",String(paused));start()});
 preview.addEventListener("click",()=>{if(!items.length)return;stop();frame.src=items[index].url;try{dialog.showModal()}catch{window.open(items[index].url,"_blank","noopener")}});
 dialog.addEventListener("close",start);
 root.addEventListener("mouseenter",stop);root.addEventListener("mouseleave",start);
 root.addEventListener("focusin",stop);root.addEventListener("focusout",event=>{if(!root.contains(event.relatedTarget))start()});
 const fail=()=>{txt(featureTitle,"Verve N Veda public directory");txt(description,"The featured directory is temporarily unavailable. You can still visit the main public gateway.");txt(mono,"V");txt(visualLabel,"Public ecosystem");txt(category,"Directory");open.href="https://vervenveda.com/";preview.disabled=true;pause.disabled=true;txt(counter,"")};
 fail();
 fetch(SOURCE,{cache:"no-store"}).then(r=>{if(!r.ok)throw Error("Registry unavailable");return r.json()}).then(data=>{
  if(!Array.isArray(data.entries))throw Error("Invalid registry");
  const seen=new Set();
  items=data.entries.filter(e=>{
   if(e.access!=="free-public"||e.status!=="active"||e.directoryVisible!==true||!e.title||!e.url)return false;
   if(categories.length&&!categories.includes(e.category))return false;
   const hay=(e.title+" "+(e.description||"")+" "+e.category+" "+(e.repository||"")).toLowerCase();
   if(keywords.length&&!keywords.some(k=>hay.includes(k)))return false;
   try{const u=new URL(e.url);if(u.protocol!=="https:"||!["vervenveda.com","vervenveda.github.io","artist1970.github.io"].includes(u.hostname))return false}catch{return false}
   if(seen.has(e.url))return false;seen.add(e.url);return true;
  }).slice(0,limit);
  if(!items.length){fail();return}
  render();start();
 }).catch(fail);
}
window.VNVFeaturedSlideshow=Object.freeze({version:"1.0.0",mount,mountAll:()=>document.querySelectorAll("[data-vnv-featured-slideshow]").forEach(mount)});
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>window.VNVFeaturedSlideshow.mountAll(),{once:true});
else window.VNVFeaturedSlideshow.mountAll();
})();
```

## Source integrity

- `index.html` blob: `de6ef4b1b860e051a965de0401843f8d668ea5d0`
- Current active feature interval in the inline engine: 4000ms.
- Preserve safe link handling, iframe sandbox restrictions, and public-only directory boundaries.
