# Four-speed speedometer drive gear — source correction

On 2026-10-02, the original GM parts drawing and tables were independently inspected in `fiero-parts-cd.pdf`, PDF pages 128–130 (GM04-238, headed 1985–1986 P four-speed manual transaxle, MY8/M17). The retained page renders are in `service-source-review-20261001/parts-cd-pdf-128.png`, `parts-cd-pdf-129.png` and `parts-cd-pdf-130.png`.

PDF 130, drawing item 80, explicitly identifies a 35-tooth speedometer **drive** gear. The existing `tx-speed-drive` mesh had 38 teeth. Its procedural gear count is now 35. The part's inspector cites this original parts-table item separately from the adjacent-year service drawing's different callout numbering.

`scripts/audit-factory-datums.mjs` counts the radial tooth peaks in the constructed mesh. The added assertion failed on the preserved 38-tooth model and passed after correction. The original source, catalog and audit were retained in `preserved/2026-10-02T23-53-14.798Z-e8b8c355-before-factory-speedometer-drive-tooth-correction/`.

This does not establish tooth profile, helix, diameters, shaft fits or calibration. PDF 129, item 51, lists four separate speedometer **driven** gear alternatives: 29 teeth GRN (10041031), 30 teeth NAT (10041032), 30 teeth BLU (25519845), and 31 teeth WHT (25519846). Root and the source-review agent independently inspected the higher-resolution page on 2026-10-03 and corrected the earlier note that had mislabeled the two 30-tooth entries as 29-tooth entries. The installed driven gear is not identified. The existing driven-gear shape remains illustrative and needs a source-backed variant implementation; it is not certified by the drive-gear correction. No interchangeability between service years or transmission variants is inferred.

The other explicitly unmatched GM04-238 register rows remain open. The differential assembly heading is an aggregate of components, not an additional missing one-piece part. A nominal tooth-count correction does not finish full transaxle source reconciliation.
