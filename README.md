# Marvel: The Ultimate Watchlist

A responsive, browser-local Marvel archive built with HTML, CSS, and vanilla JavaScript. Track 186 unique films, seasons, collections, and specials across the requested Marvel libraries. No account, paid API, build process, or application server is required.

## Run immediately

Open `index.html` in a current Chrome, Edge, Firefox, or Safari browser. Keep the `css`, `js`, and `assets` directories beside it. The classic scripts deliberately avoid module imports and fetched JSON so the app works with `file://`.

Alternatively, install Node.js 24 LTS and run:

```text
npm start
```

Open **http://127.0.0.1:4173/**. No npm installation is required for this preview server. Stop it with Ctrl+C. The preview also supports **http://127.0.0.1:4173/marvel-watchlist/** to check repository-relative hosting.

Browser storage belongs to its origin. A local file, a localhost preview, and a GitHub Pages URL have separate storage. File-origin persistence behavior can vary between browsers; use the fixed localhost URL for a stable local origin and keep JSON backups.

## Use the tracker

- Use Release order, Universe order (the initial default), or Doomsday essentials. Collections and years/universes are collapsible. Universe order shows MCU film phases separately.
- Search titles, series aliases, and characters. Filters for type, collection, phase, universe, character, year, personal/release status, and importance combine. Clear filters restores the full library.
- Check **Mark completed**, or open a card to choose Not started, Watching, Completed, or Skipped. TV seasons are independent records, with expandable season navigation and an entire-season completion action. Episode tracking is intentionally not included.
- Open a title for its synopsis, continuity, related viewing, a 1–10 rating, and personal notes (up to 2,000 characters).
- Hearts add favorites. The **+** control adds a title to the persistent session planner; **✓** removes it. The planner is a selection list, without invented runtime estimates.
- Resume progress scrolls to the next released, incomplete, unskipped entry in the selected watch order and universe. Pick my next movie chooses an eligible released film across the full library.
- The progress breakdown includes movies, TV, and each universe. Crossover titles count once overall and contribute to each applicable universe. Skipped and pending records remain in the denominator and are not considered completed.
- Theme, density, watch-order mode, and Hide completed are saved. Search and temporary filters are session controls.

### Back up and transfer progress

1. Open **Backup & settings** in the sidebar (use the menu on mobile).
2. Choose **Export backup (.json)**. Store the download outside this repository.
3. On another browser or origin, choose **Import backup**, select the JSON, and review the record/completion/planner counts.
4. Confirm replacement, or cancel. Export your current state before replacing it; imports replace rather than merge.

Imports are limited to 1 MB and validated against the exact schema and known title IDs. Malformed or incompatible imports leave the current state intact. If existing storage is corrupt, automatic saving pauses without overwriting it; a deliberate reset or valid import restores saving. If storage is blocked or full, export the current in-memory session before closing the page.

## Library accuracy and artwork

The data review date is **October 15, 2026**. `js/data.js` contains the full catalogue and source references. The library has **81 films and 105 television entries**, including **85 individually tracked seasons** and seven Marvel Rising collections/specials. “Marvel Super Hero Squad” is an alias for The Super Hero Squad Show, rather than a duplicate record. Titles listed without season counts in the brief are retained as whole-series records; this is the requested catalogue, not a claim to include every Marvel adaptation ever produced.

The **17 Doomsday essentials** count Loki's two seasons separately. They are fan recommendations, not official prerequisites or predictions about characters appearing in Doomsday. Optional older Spider-Man films and Daredevil: Born Again remain available in the full catalogue.

The countdown targets **December 18, 2026 at 00:00 UTC**, a date-only convention, not a worldwide cinema opening time. It clamps to zero after that date and displays “Scheduled release date reached.” [Disney's official Doomsday page](https://movies.disney.com/avengers-doomsday) lists the date.

Release metadata is editorial, never inferred from the browser's clock and never used to complete titles. Unverified seasons and VisionQuest stay unconfirmed until availability is verified. Spider-Man: Brand New Day remains in the requested release-watch collection, with its released status supported by [Sony's official available-at-home page](https://www.sonypictures.com/movies/spidermanbrandnewday). This distinction prevents a dated brief from silently becoming a false release claim. Exact release dates are left blank when unverified; year-only records are ordered by year, with the curated order as a tie-breaker, so their within-year ordering is approximate.

Poster and promotional image URLs are recorded from observed publisher or Wikipedia pages. Some artwork is a promotional crop. Remote images are optional: the app provides illustrated text-based fallback artwork on network failure and works offline when its local files are available. External providers can change or remove images; no availability guarantee is made. No third-party JavaScript or fonts load in the application. Artwork is not bundled or relicensed; Marvel and the respective rights holders retain their rights. This is an independent fan project.

## Project structure

```text
index.html                  Accessible app shell and meta security policy
css/style.css               Dark/light themes and responsive layouts
js/data.js                  Unique title records, categories, and sources
js/security.js              Strict backup validation and image URL allowlist
js/storage.js               Safe localStorage loading and persistence
js/core.js                  Filtering, sorting, progress, and next-title logic
js/app.js                   DOM rendering, navigation, and interactions
assets/icons/mark.svg       Local favicon
assets/images/              Reserved for legally distributable local artwork
scripts/serve.cjs           Optional local preview server
scripts/validate.cjs        HTML, links, syntax, and targeted source checks
scripts/package.cjs         Production-only artifact packaging
tests/                      Unit and real-browser functional tests
.github/workflows/deploy.yml Quality/security gates and GitHub Pages deployment
.github/dependabot.yml      Dependency and workflow update proposals
SECURITY.md                 Threat model, controls, and hosting limitations
LICENSE                     MIT for original code; artwork excluded
```

## Test before publishing

Development tools need Node.js 24 LTS and internet access for the initial installation. These dependencies do not ship with the website.

PowerShell (Windows):

```powershell
Set-Location 'E:\Marvel'
npm ci --ignore-scripts
npm run validate
$env:BROWSER_CHANNEL = 'msedge'
npm run test:browser
Remove-Item Env:BROWSER_CHANNEL
npm audit --audit-level=high
npm run package
```

If Edge is unavailable, run `npx playwright install chromium`, omit the `BROWSER_CHANNEL` assignment, and run the browser tests again.

Bash (Linux/macOS):

```bash
cd /path/to/marvel-watchlist
npm ci --ignore-scripts
npx playwright install --with-deps chromium
npm run validate
npm run test:browser
npm audit --audit-level=high
npm run package
```

Tests cover compound filtering, deduplication, season independence, progress, storage recovery, strict imports, literal text rendering of HTML-like notes, confirmations, backups, navigation, favorites, planner, theme/density, random picking, mobile overflow, `file://`, and repository subpaths. Browser functional tests block remote artwork deliberately to test graceful failure. `.qa/desktop.png` and `.qa/mobile.png` are local-only screenshots. Source/credential scans are targeted checks, not a comprehensive security audit. `npm audit` reports known advisories at execution time and needs registry access.

## Publish on GitHub Pages

This project includes the complete workflow. **A live deployment has not been performed or verified.** A GitHub account, repository, and authenticated push are still needed. Do not add access tokens to files, scripts, remotes, or shell history; use Git Credential Manager or GitHub's supported authentication flow.

1. On GitHub, choose **New repository**. Name it `marvel-watchlist`, choose **Public**, and create it empty (do not initialize README, license, or gitignore remotely). The local folder can remain named `Marvel`; the repository name controls the URL path.
2. Install Git, open a terminal in this project, and run the appropriate commands below. Replace `YOUR-USERNAME` with your GitHub login. If this checkout already has an initial commit, `git init` is harmless; skip the first commit if Git reports nothing to commit. Inspect `git status` before staging; backups and local test outputs are ignored.

PowerShell:

```powershell
Set-Location 'E:\Marvel'
git init -b main
git add index.html css js assets scripts tests .github .gitignore package.json package-lock.json README.md SECURITY.md LICENSE
git commit -m "Build Marvel watchlist tracker"
git remote add origin https://github.com/YOUR-USERNAME/marvel-watchlist.git
git push -u origin main
```

Bash:

```bash
cd /path/to/marvel-watchlist
git init -b main
git add index.html css js assets scripts tests .github .gitignore package.json package-lock.json README.md SECURITY.md LICENSE
git commit -m "Build Marvel watchlist tracker"
git remote add origin https://github.com/YOUR-USERNAME/marvel-watchlist.git
git push -u origin main
```

If Git requests an identity, configure your chosen name and email with `git config user.name "Your Name"` and `git config user.email "YOUR-EMAIL"` in this repository. If `origin` already exists, inspect it with `git remote -v` and use `git remote set-url origin https://github.com/YOUR-USERNAME/marvel-watchlist.git` only when it should point to this new repository.

3. In **Settings → Pages → Build and deployment → Source**, select **GitHub Actions**. The workflow reads existing Pages configuration; it does not use a privileged personal token to enable Pages automatically. Keep the `github-pages` deployment environment restricted to `main`.
4. In **Actions → Validate and deploy Marvel Watchlist**, inspect the run. If the first push preceded Pages configuration, rerun the failed jobs or use **Run workflow** on `main`.
5. The quality job must pass HTML validation, local asset/fragment checks, JS syntax, unit tests, targeted source/credential checks, dependency advisories, and browser tests. Pull requests run the same checks without deployment. Only `main` pushes and manual `main` runs can package and deploy.
6. The build job copies only `index.html`, `css`, `js`, and `assets` into `dist` and uploads the Pages artifact. `.git`, tests, dependency tools, configuration, and personal backups are excluded. The deployment job uses the official Pages action and `github-pages` environment with `pages: write` and `id-token: write`; other jobs do not have these write permissions.
7. After the **Publish GitHub Pages** job succeeds, its environment link and **Settings → Pages** show the actual URL, normally `https://YOUR-USERNAME.github.io/marvel-watchlist/`. Open that link and check assets, a status change, and a reload. A workflow file alone is not evidence of successful publishing.

### Troubleshoot deployment

- **Pages not found / configure-pages failed:** choose GitHub Actions as the Pages source, then rerun. Confirm repository/account Pages eligibility.
- **Environment approval or branch restriction:** review Settings → Environments → github-pages. Approve the deployment if you enabled required reviewers; permit `main`.
- **Validation failure:** expand the failing step and run that same command locally. Fix the source, import schema, library fixture, or test instead of disabling validation. When adding titles, update deliberate catalogue-count assertions.
- **npm audit failure:** review the advisory, update the affected development package and lockfile, then rerun checks. Do not blindly run `npm audit fix --force`.
- **Browser download/network failure:** rerun a transient failure; inspect runner connectivity. Do not bypass browser checks to publish an untested change.
- **404 or unstyled page:** use the environment's complete repository URL. Keep relative links and the production allowlist. Check that the correct `main` commit deployed.
- **Workflow does not start:** confirm Actions are enabled and permitted to run the pinned official actions. New Dependabot versions need reviewed SHA updates.

### Make updates

Edit the relevant source files, validate locally, then:

```text
git add index.html css js assets scripts tests .github package.json package-lock.json README.md SECURITY.md
git commit -m "Update Marvel watchlist"
git push
```

Each push to `main` repeats validation and deployment. Keep stable title IDs to preserve existing backups. Changes to release status should include updated primary-source evidence. For a schema or ID migration, add an explicit migration and tests before changing the version; unknown schemas are currently rejected without overwriting data.

## Security

The app uses safe DOM creation/text rendering, strict JSON validation, a 1 MB import limit, a narrow HTTPS image allowlist, and a restrictive meta Content Security Policy. Progress stays in localStorage; exported backups contain only intended app data. There is no analytics, login, database, or network write API. External image requests still disclose ordinary request metadata to image hosts, so avoid sensitive personal notes and keep backups private.

GitHub Pages does not let this project set arbitrary HTTP response headers. `frame-ancestors`, `X-Content-Type-Options`, and `Permissions-Policy` require a proxy or configurable host; a meta tag cannot provide those guarantees. See [SECURITY.md](SECURITY.md) for exact controls and limitations. Enable GitHub Dependabot alerts and secret scanning/push protection where available in **Settings → Advanced Security / Code security**. The checked-in Dependabot configuration proposes monthly npm and Action updates; a repository owner must enable account-level services and review updates.
