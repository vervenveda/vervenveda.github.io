# Upload Order

## 1. Career portal repository
Upload the contents of:

`Khaemenes_Higher_Learning.github.io/Career/`

into the existing `Career/` folder of:

`vervenveda/Khaemenes_Higher_Learning.github.io`

This adds/replaces:
- `Career/index.html`
- `Career/assets/career-directory-agi.js`
- `Career/directory-agi/index.html`
- `Career/README_DYNAMIC_PORTAL.md`

Existing `Career/apps/` files remain untouched.

## 2. Verve N Veda central federation repository
Upload the matching paths under:

`vervenveda.github.io/`

into:

`vervenveda/vervenveda.github.io`

The workflow file replaces the existing `.github/workflows/mentor-resource-index.yml`.

After commit, you can either:
- let the existing six-hour schedule run, or
- manually run the **Mentor Resource Index** workflow from GitHub Actions.

## 3. Verify
After the registry refreshes, open:

`https://vervenveda.com/Khaemenes_Higher_Learning.github.io/Career/`

The Career Directory should report a federation timestamp and automatically populate categories.

New eligible files added later to the approved folders will enter the registry on the next scheduled index run without editing the Career page.
