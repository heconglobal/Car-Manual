> Work resumed at the owner's request. Loading and missing electrical geometry are being corrected; current integration status is in [CAR](CAR.md). The local review app is available at http://localhost:5185/.

# Fiero / Workshop 85

Interactive 3D manual under development for the owner's 1985 Pontiac Fiero SE 2M6, with the owner-reported original four-speed manual and WS6 package. The current exterior is Body R12; the cabin is Interior I1. The working catalog has 166 vehicle assembly records and 2,278 detail selections across 16 families. Counts include hardware sets, optional alternatives and shared contexts, not a factory bill of materials.

The current work covers verification, source accounting, headlight geometry, mechanical interfaces, service guides and missing assemblies. The loading correction restores the complete vehicle and retains opened detail models so navigation does not repeatedly reconstruct them. Mobile controls remain compact, including landscape phones and tablets. Integrated verification is in progress; see [remaining requirements](REMAINING-WORK.md) and the [evidence ledger](references/acceptance-evidence.json).

The complete native vehicle is delivered as a verified, losslessly packed model and decoded in small batches before interaction. Geometry is not quantized; the decoder avoids retaining a second complete inflated transport buffer. Full-precision Body and Engine detail payloads download up front and decode on first opening; other detail families are constructed once, then kept for reuse. This restores persistent navigation and trades higher resident memory for fewer repeated pauses. The [loading and memory report](references/browser-loading.md) separates current measurements from earlier loading implementations; physical-phone performance remains unmeasured.

## Run

Requires Node.js 22.12+ or 24+.

```sh
npm ci
npm run dev
```

Open http://localhost:5185/. The server binds to all interfaces for another device on the same accessible network. Feedback and configuration stay in the browser; there is no backend or authentication.

```sh
npm run build
npm run preview
```

Builds preserve the previous distribution and retain existing hashed assets. Runtime assets are local. Factory scans stay in the research library; only allowlisted authored reference notes are copied into the distribution. External reference links open on request.

## Available content

- Sixteen component explorers support selection, search, nested scopes, isolation, focus and exploded construction views. The [component inventory](COMPONENT-COVERAGE.md) maps them to the development checklist.
- Headlights include both early mechanisms, separate rigid covers, aiming hardware, motors, relays and terminals. [Construction and clearance limits](references/completion-headlight-rigid-cover.md).
- Door additions include manual/electric regulators, guides, stops, lock linkages and optional AU3 actuators. [Source record](references/completion-doors/source-and-construction.md).
- Wipers include standard and controlled-cycle motor alternatives, linkage and washer components. [Source record](references/completion-wipers.md).
- The spare and tool explorer includes the catalogued 15 × 4 spare wheel, tire, jack, wrench and retaining hardware. [Source record](references/completion-spare/source-and-construction.md).
- C60 refrigeration adds compressor/clutch/mounting, condenser and refrigerant-loop selections to the existing heater and ventilation explorer. [Source record](references/completion-hvac-refrigeration.md).
- Thirteen source-checked service guides cover headlamp and coolant work plus oil, air filter, manual transmission fluid, brake/clutch fluid checks, spark plugs, battery and wiper servicing. Three additional tours explain assembly layout. Physical workshop validation remains pending.
- Option controls cover appearance and equipment previews, including power windows, power locks and controlled-cycle wipers. They preserve the selected vehicle identity and do not establish conversion compatibility.

## Sources and future model years

The [year library](references/year-library/README.md) preserves manuals for other Fiero years as well as this car. Its catalog records origin, stated model year, page count, file hash and inspection limits. The usable collection includes 1986, 1987 and 1988 service manuals, owner/maintenance documents and the shared GM parts catalogs. A complete original 1984 or 1985 service manual is still missing; damaged downloads are retained and explicitly excluded from usable sources.

[Cross-year application findings](references/completion-multiyear-applicability.md) preserve model-year and option differences without applying them automatically to the 1985 car. [Factory research](references/completion-factory-research.md) and the [independent callout register](references/completion-callout-register.json) distinguish checked drawings from unresolved rows. A page link alone does not establish every part's original identity or shape.

## Accuracy and acceptance

This is a reconstruction for interactive review. Published dimensions and selected factory service information are recorded separately from approximate contours, routes, fit and motion. The owner will validate against the car later. Original tooling, measured interfaces, complete hidden construction, all vehicle options and physically validated procedures remain open wherever evidence is absent.

Exploded views illustrate construction; they do not certify a removal path. Service guides carry applicability, prerequisites, original references and workshop-validation status. Historical fluid or part designations are identified as such. New detail and passing browser tests do not close a requirement that also asks for measurements or physical acceptance.

[Geometry provenance](references/geometry-provenance.md) · [Asset credits](ASSET-CREDITS.md) · [Owner review instructions](UAT.md)

## Verification

```sh
npm test
```

Browser runs preserve prior artifacts and use fresh report directories. On this workstation, Playwright uses cached Chromium with software WebGL. This provides reproducible interaction evidence, not physical-phone or native-GPU speed certification.

For a complete resumable verification pass after source changes stop:

```sh
npm run build
node scripts/verify-geometry.mjs
node node_modules/@playwright/test/cli.js test --list --reporter=json > /tmp/fiero-test-inventory-current.json
node scripts/run-browser-batches.mjs --inventory /tmp/fiero-test-inventory-current.json
node scripts/audit-completion-sources.mjs
node scripts/acceptance-status.mjs --inventory /tmp/fiero-test-inventory-current.json
```

The browser runner discovers the current inventory, uses at most two scenarios per batch and resumes from compatible archived passes. Changed application inputs invalidate prior browser evidence. Geometry verification records per-audit checkpoints; its resume checks both the source and audit code. Interrupted, stale, skipped and flaky runs cannot satisfy the acceptance gate.

Saved captures must be opened and inspected before they are recorded as visual evidence. Isolated diagnostic captures support construction review but do not replace main-application screenshots. The [current review report](artifacts/current-UAT.md) and [machine-readable status](artifacts/acceptance-status.json) identify eligible evidence and remaining acceptance work.

## Project layout

- `src/data.js`, `src/inspection-catalog.js`: vehicle records, guides and component-family catalog.
- `src/*-catalog.js`, `src/*-detail.js`: component identities, references and native geometry.
- `src/model.js`, `src/viewer.js`: whole-car construction, rendering and interaction.
- `src/main.js`, `src/style.css`: interface, local state and responsive layout.
- `src/service-guides.js`: source-checked service sequences and applicability.
- `references/`: original source library, inspected pages, reconstruction notes and evidence registers.
- `tests/`: browser behavior, component inspection, guides and performance measurements.
- `scripts/`: geometry/source/distribution audits, preservation, resumable browser verification and evidence accounting.
- `artifacts/`: recorded reports and captures; `preserved/`: earlier versions retained before edits.
