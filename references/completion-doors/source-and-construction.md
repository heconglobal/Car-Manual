# Door mechanism construction pass — updated October 2, 2026

The original GM Parts & Illustrations CD was inspected directly from the local `fiero-parts-cd.pdf`, PDF pages 300–302. Page renders retained in this folder show figure 2P10-004 and its application table. They are source evidence, not runtime image assets.

The Body explorer now adds 76 independent selections in six nested door scopes. Both sides include the glass cam, manual/electric regulators, electric window motor, vertical guide and fixed cam, guide retainers/supports, glass stops, belt stabilizers, bushings/buttons/retainers, external lock springs/clips/control rods and striker anchor. The latest additions distinguish the belt trim retainer, inner belt sealing strip and two outer-panel attachment blocks on each side. The AU3 preview adds the electric-lock actuator, bracket, rod and bell-crank plate. Item 34 is a window-regulator stop bumper and now belongs to the window scope without an unsupported power-lock option restriction; its regulator variant and installed position remain unverified. Existing shared glass, latch, striker, hinges, outer handle, key cylinder and associated rods remain their original selections.

The window switch chooses the manual or electric regulator and changes the cabin controls. A separate power-lock switch controls only the optional electric-lock construction. Neither switch establishes this car's original equipment or a validated conversion.

| Catalog fact | Implementation |
| --- | --- |
| Item 11: 1984–85 LH 20352607, RH 20352606; 1986–88 LH 20350877, RH 20350876 | Separate belt trim retainer using the early-year identity; later identities preserved without substitution |
| Item 13 inner belt strip: LH 20320535, RH 20320534 | Separate inner strip, distinct from item 12 outer seal |
| Items 23/40: outer-panel blocks 20505072 / 20505073 (front) | Separate panel-hardware scope; reconstructed outlines and positions |
| Item 29 manual regulators: LH 20302331, RH 20302330 | Separate manual geometry, absent in electric-window preview |
| Item 36 electric regulators: LH 20311753, RH 20311752 | Separate electric mounting/regulator geometry |
| Item 35 motor 22082528 | Separate selectable motor; W/AU3 annotation remains explicitly unresolved |
| Item 54 distinguishes 1984 steel bushing from 1985–88 20562754 | The 1985–88 service identity is used |
| Items 26/27 identify AU3 bell-crank plates/actuator rods | Those components belong to the power-lock preview |
| Item 33 lists actuator 22020256 and bracket 22049760 | Separate actuator and bracket selections |
| Item 34 names regulator stop bumper 20269755, without AU3 annotation | Window scope with unverified regulator application; compatibility ID retained; no powerLocks gating |

The independent review and its opened cover, drawing and table renders are preserved in [the October 2 findings](2026-10-02T23-50-24Z-independent-callout-review/findings-and-implementation.json). Relay item 19, AU3 service identity 20306058, remains the one door-figure row with no mapped selection. The parts drawing alone does not establish its installed location, wiring or per-car quantity. The other 53 mapped rows include grouped and provisional identities; that count does not establish complete factory inventory.

Open channels have actual mouths and backs; regulators include crossing arms, roller ends, pivots, mounting plates and drive sectors. Sectors have no guessed tooth count. The motor exterior has a can, gear enclosure and mounting ears. Internal gears, coils and terminal topology are not inferred from an exterior service drawing. Static rod shapes illustrate relationships; they do not certify travel or a service adjustment.

`scripts/audit-completion-doors.mjs` checks nonempty native geometry, selection identity, option tags, side/mirror placement, packaging envelope, open glass-cam geometry and independently transcribed original-year catalog identities. It creates a new dated evidence folder on each run. The browser scenario in `tests/completion-doors.spec.js` checks nested scopes, option exclusion, source details, left/right placement and mobile selection; results must be associated with the final source fingerprint.

Outstanding requirements remain explicit: exact dimensions and attachment quantities; glass lower tail/actual guide attachment and lowering; full motion/contact/clearance; motor and latch internal mechanisms; key-cylinder internals; electrical switches, relay and harness completion; factory adjustment/service steps; physical validation and owner review. The current additions do not close all of requirements 15.1–15.4.
