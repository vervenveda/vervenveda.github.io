from pathlib import Path

license_text = """# Verve N Veda Proprietary License

**Effective Date: July 19, 2026**

Copyright © 2026 Jennifer Pearl. All Rights Reserved.

Verve N Veda and the materials in this repository are privately owned and are not open source.

## Permission to Visit the Official Website

Visitors may access and use the officially published Verve N Veda website for lawful, personal, noncommercial, informational, and educational purposes.

This limited permission allows visitors to:

- view the official website in a web browser;
- use its intended buttons, tools, and public resource links; and
- print or save information for their own personal use when the website expressly provides that option.

No other permission is granted.

## Rights Reserved

Unless Jennifer Pearl gives prior written permission, no person, business, organization, institution, campaign, developer, automated system, or other party may:

- copy, reproduce, modify, edit, translate, adapt, or rearrange the code or content;
- create a derivative work, competing version, imitation, template, application, website, course, database, or product based on the project;
- republish, redistribute, upload, transmit, mirror, frame, embed, rehost, sell, license, sublicense, or commercially exploit any part of the project;
- remove or alter copyright, ownership, attribution, watermark, branding, or provenance notices;
- use the Verve N Veda name, logo, visual identity, layout, slogans, or branding in a way that suggests authorization, partnership, sponsorship, or endorsement;
- scrape, harvest, bulk-download, archive, or systematically extract the code, content, structure, links, or data;
- use the materials to train, fine-tune, test, evaluate, ground, or improve an artificial-intelligence or machine-learning system;
- place the materials in an AI dataset, vector database, prompt library, code-generation system, retrieval system, or automated content service; or
- claim ownership or authorship of the project or any protected portion of it.

Attribution does not create permission. Noncommercial, educational, nonprofit, charitable, governmental, or political use is not automatically permitted.

## Covered Materials

This notice applies to the original materials in this repository, including:

- HTML, CSS, JavaScript, Markdown, and other source files;
- written content, documentation, educational materials, resource descriptions, and curated collections;
- original page layouts, interface designs, navigation structures, graphics, artwork, icons, and visual arrangements;
- project names, logos, slogans, branding, and source-identifying materials; and
- original project architecture, feature designs, workflows, research, and unpublished materials.

Third-party materials remain the property of their respective owners and may be governed by separate terms.

## Public GitHub Repository Notice

Public access to this repository does not place its contents in the public domain and does not make the project open source.

GitHub users may have limited rights to view and fork a public repository through GitHub as provided by GitHub’s own Terms of Service. Those platform rights do not grant permission to publish the project elsewhere, modify or commercialize it, remove ownership notices, create derivative works, or use it outside the rights supplied by GitHub’s platform terms.

## Ideas, Facts, and Public Resources

This notice does not claim ownership of public facts, public-domain materials, government information, independently created work, or abstract ideas that applicable law does not protect.

No permission is granted, however, to copy Verve N Veda’s original expression, code, artwork, written materials, branding, selection and arrangement of content, or other legally protected work.

Nothing in this notice waives any rights that may exist under copyright, trademark, patent, trade-secret, contract, unfair-competition, misappropriation, or other applicable law.

## Requests for Permission

Any use beyond visiting and interacting with the official public website requires advance written permission from Jennifer Pearl.

Silence, public availability, a link to the project, attribution, or failure to object does not constitute permission.

## Informational and Safety Notice

Verve N Veda provides general educational and informational resources. It is not a substitute for emergency services, medical care, legal advice, mental-health treatment, crisis counseling, financial advice, law enforcement, or professional case management.

Users should verify time-sensitive information directly with the responsible agency, organization, or qualified professional.

## Disclaimer

The website and repository are provided “as is” and “as available,” without warranties of any kind.

To the fullest extent allowed by law, Jennifer Pearl is not liable for loss or harm arising from use of, inability to use, or reliance on the website, repository, linked resources, or third-party services.

## Enforcement

Unauthorized use may result in removal requests, platform complaints, copyright or trademark notices, and any other remedies available under applicable law.

Failure to enforce a right on one occasion does not waive that right.

---

**Verve N Veda — Copyright © 2026 Jennifer Pearl. All Rights Reserved.**

**No open-source license is granted. No permission is granted to copy, modify, redistribute, commercialize, train AI on, or create derivative works from this project.**
"""

path = Path("/mnt/data/LICENSE.md")
path.write_text(license_text, encoding="utf-8")
print(f"Created {path.name} — {len(license_text):,} characters")
