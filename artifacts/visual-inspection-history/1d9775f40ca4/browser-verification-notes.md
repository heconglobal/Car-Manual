# Browser verification — timing correction

Current source: `1d9775f40ca423ba7f27b8d3daad507711fa128b9d9160a10a2bf1e038f70ca7`.

The engine/cooling increment passed all five targeted scenarios in 7.3 minutes from `engine.spec.js`, `engine-service.spec.js`, `valve-gear.spec.js` and `transmission-cooling.spec.js`, using the existing assertions/timeouts and one Linux Chromium/SwiftShader worker. The consolidated [regression summary](regression-summary.json) and exact archived raw report determine completed results; this document does not substitute for them.

An earlier targeted attempt on source `4ea9c02d2012` was deliberately interrupted after native review exposed cam lobes too large to pass through the bearing bores. It recorded one interrupted scenario and four unrun scenarios, not passes. The raw report is retained at `regression-history/2026-09-24T02-47-43.852Z-4ea9c02d2012.json`. Its geometry run was also stopped, and the full geometry audit was subsequently rerun on the corrected source.

The first native capture helper could not navigate from timing directly into a nested valve scope because the parent head scope had not been opened. Its error report and three captures remain in `visual-inspection-history/55adeacca9d5/`. The helper now opens the parent first. The current native timing review completed eleven captures with zero application exceptions; all eleven were actually opened and inspected. A native capture session is separate from automated browser regression.

The prior application `267f7ce33b67` had all 31 scenarios passing across archived batches/reruns. Those historical results do not certify this changed engine application. See [prior execution notes](visual-inspection-history/267f7ce33b67/browser-verification-notes.md). A full current-source suite and the unfinished modeling/manual requirements remain necessary before final all-items UAT acceptance.

Completed raw report: `regression-history/2026-09-24T02-51-27.037Z-1d9775f40ca4.json`. Current full-suite coverage is 5/31; the other 26 scenarios require a new run on this application before final full-suite acceptance. No timeout or assertion was relaxed.
