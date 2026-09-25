# Oil pump and pickup construction

Implemented September 24, 2026. Open **Engine → Oil pan & lubrication → Oil pump & pickup**, or search for **relief piston**.

The native Three.js model replaces the former pump block and solid pickup proxy. Twelve selections retain the existing housing, pickup and intermediate-shaft identities and add nine entries: drive gear/shaft, driven gear, lower cover, relief piston, relief spring, retaining pin, four-screw cover set, mounting bolt and strainer screen. The engine inventory now has 429 selections.

## Inspected source

The locally retained original GM [1986 Fiero service manual](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=338), printed **6A2-21**, PDF page **338**, was rendered and visually inspected. Its figure 23 establishes the two-gear pump construction: housing (1), gear pair (2), cover/pickup construction (3), relief piston (4), spring (5), retaining pin (6), and four cover screws (7). The accompanying text identifies the drive extension and pump attachment at the rear bearing cap. This is adjacent-year L44 evidence, not proof of every original 1985 production detail.

The pickup screen is separated for construction inspection; figure 23 does not give it a separately orderable callout. Likewise, the two gear selections share callout 2. The mounting bolt and intermediate shaft have no invented numbered callout in this figure. No pump overhaul procedure or service calibration has been added.

## Geometry and checks

The housing has one open twin-gear pocket, a machined upper shaft passage and an idler journal. The drive shaft has a hollow hexagonal socket around the existing intermediate shaft. The independently removable lower cover has a pickup inlet and open relief sleeve. The pickup uses an annular extrusion with open ends and a formed shell; the separate screen uses intersecting metal wires with physical gaps.

`scripts/audit-oil-pump.mjs` checks the actual generated meshes for complete selection/callout coverage, pocket and axial gear containment, static tooth separation, open shaft/socket bores, relief-part containment, pin/spring separation and cover/pickup/screen openings. A ray checks the screen above the reconstructed sump. These checks apply to the authored static geometry only.

`tests/oil-pump.spec.js` covers the nested selection inventory, independent explosion offsets, isolated gear inspection, restored vehicle context, mobile search into the relief piston and viewport fit. The complete engine and existing service-part tests provide adjacent regression coverage. Current results are in the generated audit and regression reports.

## Still unverified

All local dimensions, finishes, ten-tooth count, rounded tooth profiles, original involute geometry, backlash, pumping clearance, journal fits, casting galleries, relief lands, spring dimensions/rate/preload and pressure setting remain reconstructed. The mounting ear, screw thread/length, pickup joint/route, woven-screen construction and sump placement need original 1985 measurements. The displayed static gear separation does not establish correct engagement through a revolution or oil delivery. Oil-filter media, valves and gallery plugs remain future work.

Externally visible pump/pickup pieces share their native geometry with the installed engine. Hidden gears and pressure-relief internals remain in the detailed explorer to avoid adding their render cost to the complete car. US left-hand-drive coordinate conversion is applied by the existing engine/vehicle builders.
