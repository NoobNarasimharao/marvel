# Security policy

## Model and scope

This is a static, single-user browser application. There is no server account, database, analytics, remote application code, or credential storage. It uses no runtime third-party JavaScript dependencies. Hosting and browser extensions remain outside the application's trust boundary.

Treat user text, imported JSON, and localStorage as untrusted. Records use known catalogue IDs and a fixed set of fields. All title, note, and imported text is rendered with DOM APIs and `textContent` or form-control `value`, never HTML execution sinks. No eval, dynamic functions, inline event handlers, or user-controlled navigation is used.

## Stored data and deletion

The `marvel-watchlist-v1` localStorage key contains personal statuses, favorites, 0–10 rating values (0 means unrated), notes, planner selections, and four UI preferences. Notes can contain 2,000 characters per record. No other browser data is exported. Data is not encrypted; people with access to your browser profile or scripts on the same origin may read it. GitHub project Pages under the same account domain share an origin, so another site on that origin can technically access the key. Use a dedicated origin if stronger isolation is needed.

Use **Backup & settings → Export backup** to download data, then **Reset all progress** and confirm to remove all personal records from the active app state and stored key (an empty preferences record remains). To delete the key itself, clear this site's browser storage. Clearing cookies/site data, changing origin, private browsing, or browser cleanup can erase progress. Export files are plaintext; store and delete them as personal files.

## Import and storage controls

- Imports require file selection and a preview/confirmation before replacement. Cancellation preserves existing data.
- File and UTF-8 text sizes are limited to 1 MB. Collection sizes are bounded by the catalogue.
- Root, record, and preference objects reject unexpected properties. Field types, enums, integer ratings, IDs, note lengths, planner uniqueness, and schema version are validated. Only known fields are copied into new objects.
- Prototype-related properties are rejected by the allowlist. No arbitrary object merging is performed on unvalidated input.
- Invalid localStorage is not automatically overwritten; automatic saving pauses. Export the current session, then explicitly reset or import to recover. Storage-write failures are surfaced and current session data remains exportable.
- There is no automatic migration. New schema versions or title-ID migrations need an explicit, tested migration path before release. Keep old exports until recovery is verified.

## Content Security Policy and headers

`index.html` applies a supported meta CSP: `default-src 'none'`, same-origin scripts and styles, no `unsafe-inline` or `unsafe-eval`, `connect-src 'none'`, `object-src 'none'`, `base-uri 'none'`, and `form-action 'none'`. Fonts are local system fonts. Images are restricted to same-origin and the HTTPS domains actually used in `data.js`: Wikipedia uploads, Disney's image CDN, and Sony's website. URL validation independently rejects other schemes, hosts, and credentials. Image failures fall back to local CSS artwork. A supported referrer meta policy and image `referrerPolicy` suppress referrer information.

External artwork requests expose the visitor's IP address and ordinary request metadata to the hosts. Personal statuses and notes are not sent to these hosts. Image rendering requests are an unavoidable consequence of optional remote artwork; use the app offline for no external requests.

**Ordinary GitHub Pages cannot configure arbitrary response headers.** In particular, `frame-ancestors` is ignored in a meta CSP. Neither `X-Content-Type-Options` nor `Permissions-Policy` can be enforced by HTML meta tags. Do not interpret the local preview server's headers as headers on GitHub Pages. This app does not claim to control GitHub's supplied HTTP headers.

On a configurable host/reverse proxy, set at least:

```text
Content-Security-Policy: frame-ancestors 'none'
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer
Permissions-Policy: camera=(), microphone=(), geolocation=()
```

The additional header CSP applies alongside the document meta policy; alternatively move the complete policy into the HTTP header. Test after configuring. HTTPS and cache headers are also host responsibilities. The app requests no device permissions and uses safe file-download object URLs solely for user-triggered backups.

## Dependencies and CI

Playwright and html-validate are development-only exact-version dependencies with an integrity-pinned lockfile. CI uses `npm ci --ignore-scripts`; Playwright browser installation is a separate explicit step. npm advisory checking fails on high/critical known vulnerabilities. There are no runtime CDN scripts requiring SRI.

Official GitHub Actions are pinned to verified full commit SHAs. Validation jobs have read-only contents permission; packaging additionally reads Pages metadata; only the deployment job has Pages write and OIDC token permissions. Pull requests cannot deploy. Checkout credentials are not persisted. Artifact staging uses an explicit production directory allowlist and excludes tests, dependencies, Git, local files, and backups.

Dependabot proposes monthly npm and Action updates. Review release notes, full SHA provenance, lockfile changes, and passing tests before merging. Repository owners should enable Dependabot alerts, GitHub secret scanning/push protection, branch protection requiring quality checks, and private vulnerability reporting where available. These repository settings cannot be enabled by the static files themselves.

`npm run validate` runs HTML validation, JS syntax checks, internal-link/asset checks, unit tests, dangerous source-pattern checks, common token/private-key pattern checks, and action-pin checks. Browser tests exercise hostile HTML-like notes and full user flows. The source scans are deliberately narrow and are not comprehensive static analysis or a full security audit; they do not scan Git history or prove the absence of secrets. No vulnerabilities reported by an advisory service means none known to that service for those versions at the time queried.

## Report a vulnerability

Once the repository is created, enable **Settings → Advanced Security → Private vulnerability reporting** where available. Report through the repository's **Security → Advisories → Report a vulnerability** flow. If it is unavailable, open a minimal issue asking the maintainer for a private reporting channel; do not include exploit details, private backups, credentials, or personal notes in a public issue. Include the affected commit, browser, reproduction steps, and expected/actual behavior privately. No monitoring inbox or response-time guarantee is implied by this template.
