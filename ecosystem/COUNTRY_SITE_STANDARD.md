# Verve N Veda Country Site Standard

## Purpose

Country sites are public, source-led educational gateways inside the Verve N Veda **World & Diplomacy** ecosystem. They may grow as cultural, educational, research, language, heritage, civic-understanding, and diplomacy resources.

They are not campaign pages, diplomatic representations of a government, or substitutes for an embassy or consulate unless explicitly and lawfully designated as such.

## Required public structure

Each country gateway should include:

1. **Country identity**
   - Country name in English.
   - Local-language name where appropriate.
   - A short, neutral description of the site's educational purpose.
   - A clear statement that the site is an independent educational resource unless an official institutional relationship exists.

2. **People, land, and regions**
   - Geographic overview.
   - Major regions, cities, landscapes, and environmental context.
   - Population/cultural information sourced to appropriate current or historical authorities.

3. **Historical timeline**
   - Distinguish geography, population, identity, political authority, state sovereignty, and administrative control.
   - Use exact dates or defensible date ranges.
   - Place evidence close to contested or consequential claims.

4. **Living culture**
   - Language.
   - Literature and oral traditions.
   - Music, dance, food, clothing, architecture, crafts, holidays, and family/community traditions.
   - UNESCO or museum records where useful, without treating any one institution as infallible.

5. **Cities and local life**
   - Major cities and regional centers.
   - Education, commerce, agriculture, industry, arts, science, public institutions, and everyday life.
   - Avoid reducing a country to conflict, tourism, government, or religion alone.

6. **Documentary image standard**
   - Historical claims must use genuine photographs, maps, scans, documents, or clearly labeled archaeological/site imagery.
   - Do not use AI-generated or digitally illustrated imagery as if it were historical evidence.
   - Record creator/photographer, date or date range, collection, rights holder, license/public-domain status, and source URL when available.
   - If two images are used as a Then/Now comparison, state whether they show the exact site/camera position or are representative views.
   - Keep image date separate from current-context date.

7. **Trusted research sources**
   - Maintain a repository-level `SOURCES.md`.
   - Prefer primary sources, national archives, museums, UNESCO, UN agencies, academic scholarship, libraries, statistical agencies, and clearly attributed current reporting.
   - Preserve disagreement where credible sources conflict.
   - Do not turn advocacy language into unattributed fact.

8. **Khaemenes Academy bridge**
   - Provide a prominent **Free Khaemenes Academy** doorway near the top of the page.
   - Provide a country-specific **Research Notebook / Academic Evidence** pathway.
   - The evidence packet should support:
     - student name and date;
     - grade/level;
     - research question;
     - source/citation log;
     - vocabulary/language connections;
     - observations, calculations, notes, or writing;
     - claims/reasoning/limitations;
     - cross-subject reflections;
     - next goals;
     - parent/teacher review.
   - Printable/exportable evidence should follow the Khaemenes Academy evidence convention.

9. **Language and accessibility**
   - Provide local-language support where practical and reliable.
   - Preserve correct text direction for RTL languages.
   - All meaningful images require alt text.
   - Controls require keyboard access and visible focus.
   - Respect reduced-motion preferences.
   - No essential information may exist only in animation, color, or hover states.

10. **Current political and legal context**
    - Separate historical description from current political/legal status.
    - Date current claims.
    - Attribute contested positions to identified governments, courts, institutions, scholars, or organizations.
    - Avoid collective blame based on nationality, ethnicity, religion, or identity.
    - Update high-change current sections independently from stable historical sections.

## Repository minimum

Recommended root files:

- `index.html`
- `README.md`
- `SOURCES.md`
- `CITATION_POLICY.md`
- `CONTRIBUTING.md`
- `updates/changelog.md`

Optional as the site grows:

- `research/`
- `primary-sources/`
- `cities/`
- `culture/`
- `language/`
- `education/`
- `maps/`
- `data/`
- `methodology/`

## World & Diplomacy registry contract

A country repository does not become a live ecosystem destination merely because it exists.

New repositories begin as **under review** and become publicly discoverable only after explicit approval in:

`ecosystem/master-ecosystem-directory.json`

Approved country gateways use:

```json
{
  "id": "country-example",
  "title": "Example Country · People · Heritage · Horizon",
  "repository": "vervenveda/Example_Country.github.io",
  "path": "index.html",
  "type": "gateway",
  "category": "diplomacy",
  "access": "free-public",
  "status": "active",
  "directoryVisible": true,
  "url": "https://vervenveda.com/Example_Country.github.io/",
  "developmentStatus": "live"
}
```

The protected `vervenveda/index.html` should not require hand-coded country cards for normal operation. The canonical master directory drives the live category. Emergency fallbacks may be updated surgically for resilience.

## Naming pattern

Preferred repository naming:

`Country_Name.github.io`

Preferred public page title pattern:

`Country Name | People · Heritage · Horizon`

A historically focused page may use a more appropriate subtitle, such as:

`Palestine | Land · People · Memory`

## Release checklist

Before a country gateway is approved:

- [ ] Canonical public URL resolves.
- [ ] Repository is public and intentionally publishable.
- [ ] No credentials or private records are present.
- [ ] Historical claims have nearby sources.
- [ ] Current political/legal claims are dated and attributed.
- [ ] Image provenance and rights are documented.
- [ ] No graphic creation is presented as documentary history.
- [ ] Internal anchors and navigation pass.
- [ ] External links are reviewed.
- [ ] New-tab links use `noopener`.
- [ ] JavaScript syntax passes.
- [ ] Mobile and RTL behavior pass where applicable.
- [ ] Academy doorway is prominent.
- [ ] Research Notebook / Academic Evidence pathway exists or is clearly marked as the next implementation step.
- [ ] Repository is approved in the master ecosystem directory.
- [ ] Emergency fallback parity is checked.

## Current approved country gateways

As of October 24, 2026:

- **Saudi Arabia · People · Heritage · Horizon**
- **Palestine · Land · People · Memory**

This list should grow only through explicit review and approval.
