# Project constraints

- The owner authorizes project-local commands and continued work toward `REMAINING-WORK.md` acceptance. Do not ask again for routine project commands.
- Never delete existing files or data. Do not modify global system configuration or install system-wide packages.
- Preserve prior versions before changing existing source, reference or evidence files. Use `preserved/` with a new timestamped directory; do not overwrite or clean those archives.
- Browser tests must use fresh output and HTML-report directories, preserving existing reports and captures. Build into a fresh output directory or disable Vite's output-directory cleanup.
- Keep measured factory geometry, original-year application, workshop validation and owner sign-off open until supported by evidence. Model presence and passing software checks do not establish those facts.

## Verification

- Use `npm test` for browser runs; its wrapper preserves prior artifacts and archives completed reports. Prefer small batches: a long full-suite run has been externally terminated before producing its report. Do not count console-only passes from an interrupted run.
- In this sandbox, a Playwright inventory subprocess may return no output. Generate it directly with `node node_modules/@playwright/test/cli.js test --list --reporter=json > /tmp/fiero-test-inventory-current.json`, then run `node scripts/acceptance-status.mjs --inventory /tmp/fiero-test-inventory-current.json`. The inventory must match the current source fingerprint.
- `npm run build` preserves the old distribution and disables output-directory deletion.
- Only record screenshots that have actually been opened and inspected. The acceptance gate checks their saved hashes; re-rendered files require review again.
