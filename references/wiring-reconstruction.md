# Electrical distribution and ignition circuits — 2026-09-22

The vehicle is the owner-described original US LHD 1985 Fiero SE 2M6, L44, four-speed manual, WS6. The wiring family now has 99 selections: the initial 52 wiring/electronics entries plus 47 instrument selections. Four independently selectable EST leads belong to the engine family. All geometry is authored locally. No manual scan or vehicle photograph is loaded into the viewer.

## Primary evidence actually inspected

- [1985 Pontiac owner’s manual, printed 6-5 / PDF 93](https://www.boomtastic.com/files/?serve_file=Service+Manuals%2C+Guides%2C+and+Tips%2FOwners+Manuals%2F1985%2F1985+Fiero+Owners+Manual.pdf#page=93): numbered 17-position fuse/breaker layout, fuse colors/ratings, spare storage. The intact local copy is `1985-owners-boomtastic.pdf`, 107 pages / 33,867,178 bytes. The earlier FieroInfo download has only 9,442,792 bytes and is truncated; it is not an inspected owner-manual source.
- [1985 Pontiac DIY, printed 2-32 / 2-33, PDF 41–42](https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=41): fuse block under the left instrument panel, paired release tabs and drop-down movement toward the seat; turn flasher on the left of the column; hazard flasher and horn relay under the right instrument panel.
- [1985 Pontiac 6E3, printed 6E3-68 / PDF 69](https://fieroinfo.com/manuals/1985_Fiero_6E3_Emissions_and_Drivability.pdf#page=69): ECM enclosure, calibration cover and separate PROM carrier. PDF 70 covers CALPAK. Figure 1, PDF 7, locates the ECM in the rear center console. Generic nearby prose says “behind the instrument panel”; the car-specific plan view takes precedence for placement.
- [1985 Pontiac 6E3 figure 38, printed 6E3-91 / PDF 92](https://fieroinfo.com/manuals/1985_Fiero_6E3_Emissions_and_Drivability.pdf#page=92): 24-cavity A/B and 32-cavity C/D connectors; ICM G/B/R/E functions. Cross-checked against figure 2, printed 6E3-5 / PDF 8. The earlier source link was off by one PDF page and has been corrected.
- [1986 Pontiac service, 8A-201-0 / PDF 1038](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=1038): supporting battery-junction and ground-location views. This is adjacent-year evidence, not proof of every 1985 terminal assignment.

## Verified EST transcription

| Distributor cavity | ICM marking | Circuit | Color | ECM terminal | Function |
|---|---|---|---|---|---|
| A | G | 453 | Black/red | B3 | Reference ground |
| B | B | 424 | Tan/black | D5 | Bypass |
| C | R | 430 | Purple/white | B5 | Distributor reference |
| D | E | 423 | White | B4 | Electronic spark timing |

The four visible wire segments have corresponding base colors and stripes. They terminate at the modeled engine loom; they are not claimed to be full measured ECM-to-distributor runs. The inspector links to the original connector view so wire-entry and mating-face orientation are not conflated. No electrical diagnostic flowchart has been validated by these visualizations.

## Construction and limits

The fuse carrier has actual openings and separate spring sockets, individual service fuses/breakers, visible fuse elements and test pads, rear housings, hinge/support, paired release tabs and empty five-position spare holder. The labels follow the 1985 owner layout, with adjacent-year molded-label spelling checked against 1986 8A-11-0. Optional breaker positions show the reference layout, not an assertion of the car’s original options.

The rear-console ECM has an open folded enclosure, removable lid and calibration access plate, separate calibration carriers/sockets, board substrate and two connector families. PCB traces, chip population, solder joints, PROM broadcast code and installed ECM identity are deliberately not fabricated. Connector cavity capacity is shown; full terminal population and wire assignments remain open.

The battery junction and ground eyelets use reconstructed local positions. The complete body/engine/dash loom, fusible links, switches, complete gauge movements and circuit boards, horn units and exact factory connector tooling remain outstanding.

The fuse block’s 45-degree displayed pose is a static reference pose. This model does not yet simulate calibrated drop-down travel or electrical operation. Numeric body/casting dimensions, wire lengths, contact forces and clearances are not certified.

## Source exclusions

The CHARM fuse-block location page claimed a right-side position. This conflicts with the explicit original 1985 DIY figure and was rejected. The directory’s `1985Schematics.pdf` is a Mitchell redraw; it is retained for research discovery but not used as primary verification. The ALldata two-page V6 schematic similarly does not replace the original Pontiac figure 38.

## Checks

- `scripts/audit-model.mjs`: all model identities, nonempty finite geometry, family membership and established handedness checks.
- `scripts/audit-wiring.mjs`: all 17 fuse/breaker ratings, distinct fuse envelopes in panel coordinates, left/right locations, ECM connector-axis placement and EST mapping.
- `tests/electrical.spec.js`: browser navigation, part selection, explosion, isolation, source data, mobile layout and no image requests. Current execution status is recorded in `artifacts/full-regression.json`; merely listing a test here does not claim it passed.

## Additional original instrument-panel evidence

Owner manual printed 2C-1 / PDF 32 was inspected after the wiring pass. It establishes the early instrument arrangement: 85 MPH speedometer at driver left, 6,000 RPM tachometer at right with the oil-pressure gauge in its lower sector, temperature above fuel in the center, and two adjacent vertical warning-lamp columns. This is concrete evidence for the still-open instrument-detail item (04.3); the cluster has now been rebuilt to that arrangement with separate selectable faces, pointers, housings, warning windows and lamp holders. See `instrument-reconstruction.md` for the 47-entry inventory and remaining dimensional/electrical limitations. PDF 34 is printed 2C-5, so the retrieved scan appears to omit printed 2C-3 and 2C-4. “Intact” above refers to a valid complete PDF download, not proof that every original printed page was scanned.

GM 22P PDF 289–290 is explicitly the 1984–85 instrument panel. The similar 1986–88 panel at 291–292 includes later separate rally gauges and must not be substituted. GM CD’s only dedicated cluster breakdown in the table of contents is the 1988 cluster at PDF 282; its application must remain distinct.
