# 1985 headlight reconstruction

This pass replaces the previous whole-car-only headlight approximation with shared vehicle/detail geometry and 103 selectable parts or grouped sets. Each side has lamp/aiming, cover/linkage and motor subassemblies; relays/harness are separate. The same native mesh construction is used in the whole car. No source photographs are displayed as component substitutes.

## Evidence inspected

- [GM 22P CD, PDF 69–70](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=69): front-lamp diagram and application table. Covers, independent hinges/fillers, crank/link kits, bracket, lamp body, aiming hardware, capsule, two-piece retaining hardware, spring, bezels, harness and relays. Callout 35 distinguishes **1984–86 actuator LH 22039672 / RH 22039673** from 1987–88 motors. Callout 36 identifies **22038870** brush/switch assembly for 1984–86. The drawing also contains later-year equipment; its electronic module is not imported into the 1985 model.
- [1985 Pontiac DIY, PDF 37–38, printed 2-28 / 2-29](https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=37): independent spring-loaded upper cover, manual motor knob, one-cavity black connector on the blue wire, separate lamp connector, two top-corner and two side bezel screws, two-piece retainer secured by four Phillips screws, two aiming screws/tabs and bottom-corner retaining spring. The model's explode control does not reproduce removal order. Sealed glass/reflector separation is illustrative construction.
- [1986 Pontiac service, PDF 992–995, printed 8A-100 / 8A-102](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=994): adjacent-year evidence for dual-beam circuit, separate left/right actuator relays and driver-side isolation relay, internal endpoint contacts, grounds beneath each headlamp. Factory 22P confirms the early motor generation covers 1985. This does **not** certify every 1985 wire gauge, terminal, branch or harness option.
- [Rodney Dickman, early motor construction](https://www.rodneydickman.com/product_info.php?products_id=230): firsthand opened motor and gear photographs; early assembly application, four original-style cushions, plastic output gear, steel drive plate, metal intermediate gear and factory case rivets. The model retains original-style materials instead of the pictured replacement alloy gear and screws.
- [Brush reference](https://rodneydickman.com/product_info.php?products_id=360) and [side-cover reference](https://rodneydickman.com/product_info.php?products_id=359): two carbon brushes/contact arms and removable three-screw cover. Replacement-brush measurements and repair hardware are not treated as original GM dimensions.

Local factory PDFs were visually inspected. Working page renders and supplier images reside under `/tmp/fiero-headlights`; none are runtime application assets.

## Construction and pose decisions

- Preserve the accepted closed hood-cover surface and the low raised silhouette. The hood and headlight cover now share one surface function, preventing their contours from drifting apart.
- The lens is a convex fluted glass surface over a recessed reflector, with distinct retaining/mounting rings, two adjusters and their anchors, spring, socket, stamped bucket, bezel sections and pivot hardware.
- The cover uses its own hinge pose. The bucket, sealed lamp, aim hardware and bezel use one common rotation about the rear pivot for their closed endpoint. This corrects the old closed state in which only the exterior cover existed.
- Fixed motors, brackets and relays remain in place. Two endpoint crank/link poses are authored independently. Continuous linkage motion, contact load and interference are **not calibrated**.
- The output gear has a backing web beneath its four cushion pockets and an open shaft bore. The case has a gear-well back wall and separate shaft bores, not large through-holes. Duplicate tooth-root surfaces were removed to avoid close-up shimmer.
- The early motor breakdown includes separate case halves, rivets, field shell, armature/worm/commutator, bearing seats, hand knob, intermediate/output gears, drive plate/shaft, four individually selectable cushions, switch carrier, two brushes, side cover/screws and pigtails. Gear profiles, winding counts, bearings and switch details are reconstructed, not manufacturing drawings.
- Final world frame is **−X driver, +X passenger, −Z front**. Legacy +X driver authoring is converted once, with winding and explosion offsets corrected. The isolation relay remains on the driver side.
- Paint choices affect the painted headlight covers in both vehicle and detail views. Relay wiring uses separate wire materials, not body paint.

## Acceptance limits

103 selections include grouped fasteners and construction subdivisions; they do not constitute a complete factory BOM. Exact dimensions, original lamp optical tooling/markings, every connector/retainer, full 1985 circuits, gear ratios, brush/limit-switch geometry and travel clearances remain pending. No repair torque, aiming setting, wiring pinout or motor rebuilding procedure is certified by the 3D model.

See [remaining work](../REMAINING-WORK.md) for the vehicle-wide development backlog and [current UAT](../artifacts/current-UAT.md) for executed validation.

## September22 nominal-position and linkage correction

The newly inspected Pontiac1985 MVMA specification form, printed24 /PDF26, supplies a709 mm bulb-center height at curb mass and511 mm lateral offset. The lamp is now upright at those datums. Its independent cover is lower in the raised pose. The bucket moved rearward12 mm within the reconstructed aperture after a sweep audit identified bezel interference at35–55% travel. That fore/aft placement and all mechanism hard points remain reconstructed, not sourced production dimensions.

The crank and link now use a circle-intersection solution with fixed32 mm crank radius and86 mm connecting link through101 sampled poses. Those two lengths are reconstruction parameters, not GM dimensions. Bucket/hood clearance is checked at21 positions; gear-pocket support and the open shaft bore remain ray-checked. This supersedes the independently authored old crank endpoints above. The UI still shows raised/closed end states; full cover contact, actuator stop travel and manufacturing tolerance validation remain unfinished. Current headlight catalog:118 selections including the dash/column controls.
