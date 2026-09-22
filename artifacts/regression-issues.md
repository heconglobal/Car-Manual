# Regression findings and corrections

The run history below preserves earlier snapshots. Use [current verification](current-UAT.md) for the present source. Browser passes do not close the mechanical acceptance requirements.

## Earlier navigation corrections

The full run begun at 2026-09-22T06:04:39.179Z used snapshot `5419a853585bc2c09df44ee175f9c52ed3e3b6aae575138c05dd8788536c4161`. It recorded 11 passing scenarios, three failed assertions, one interrupted test and 16 unrun tests. It was intentionally stopped after code review found a service-guide navigation defect. The raw outcome and source manifest are retained in `regression-history/`; this is not a passing full regression.

- Configuration preview: the old test expected a >120 mm change in the total headlight envelope. Updated nominal lamp/cover geometry produces ~84.8 mm. The corrected assertion uses >80 mm and a stricter raised ceiling of 820 mm. Separate geometry checks verify the actual 709/511 mm bulb-center datums.
- Optional lamps: the test expected an empty scene after disabling an all-optional scope. Existing recovery correctly opens the populated lighting root. The assertion now checks that root and its standard members, with no optional courtesy members left visible.
- Wiring: flasher left/right assertions followed navigation to the instrument cluster. The viewer returns no bounds for out-of-scope parts. Those assertions now run in the flasher scope before explosion.
- Service guide: an added browser regression reproduced the real defect on 2026-09-22 at `service-guides.spec.js:50`: selecting the headlamp lens after starting from the radiator left the canvas in `cool-radiator` with a headlamp selection. That failing run is also archived. The selection handler now opens the selected detail part's own scope when necessary.
- Related guide cleanup: home/cabin/exterior navigation now clears the guide return snapshot. Configuration persistence excludes the guide's temporary raised-headlamp pose. Expanded regression assertions cover both paths and preservation of other preview edits.

Corrected source snapshot: `d873bc28c6914b707c14af6792d874756039ba44c53a80de7540588a775f2562`.
Application/dependencies/assets fingerprint: `292172a3382937628d9d30a086f1d1513d1c512337abf494891ec97edeb0aa6e`.

The focused corrected guide run passed. The final full run described below also passed every scenario. Raw failed and interrupted outcomes remain unchanged in the archive.

The earlier full verification run uses source snapshot `2e64d5ce13c48fabccadb6af0d09da1f041fea81f7b88f267f7791e2e9ad6029` and application/dependencies/assets fingerprint `d73b07f2c2d46cc732269bd3af23221bdd5fbc4cab040f2dd957f6ee419e791f`. It includes the packaged notices and mobile screenshot scroll normalization. The full run started at 2026-09-22T06:54:53.439Z and finished with 31 passed, 0 unexpected, 0 flaky and 0 skipped scenarios. The raw run and exact manifest are archived as `regression-history/2026-09-22T06-54-53.439Z-2e64d5ce13c4.json`. This passes software interaction regression; the open dimensional-consistency defect and remaining physical/model/manual acceptance requirements are separate.

## Current shared powertrain and timing findings

Source `b2019702353965532ff3dcd7d8016da9555acf341514d85704bcced93b67718c` removes the nonuniform installed/detail engine scaling and uses shared exterior surfaces. The [shared-geometry audit](cross-view-scale-review.json) checks actual vertices and selected interfaces.

The independent [engine-timing audit](engine-timing-audit.json) **fails**: actual shaft-end circles give 131.000 mm centre separation versus the GM nominal 159.03 mm. Bearings and the cam sprocket agree with the incorrect shaft location. Shaft, bearings, sprocket, chain, cover and valve-gear relationships require a coordinated correction; the current implementation is not dimensionally accepted. Timing tooth profiles, chain pitch and operating kinematics also remain unverified.

Startup performance is still unacceptable for final acceptance: the limited native Windows hardware session needed approximately 97 seconds to reach readiness during concurrent regression. That is not an isolated performance benchmark. The follow-up all-family native capture was interrupted, so it supplies no broad hardware pass.

The current full browser run (`b2019702353965532ff3dcd7d8016da9555acf341514d85704bcced93b67718c`) completed: 31 passed, zero failed, skipped or flaky scenarios, with no report errors. Runtime was approximately 86.6 minutes. Its exact source manifest and raw outcomes are archived in [2026-09-22T09-05-41.350Z-b20197023539.json](regression-history/2026-09-22T09-05-41.350Z-b20197023539.json). The separate engine-timing failure and remaining acceptance requirements still apply.
