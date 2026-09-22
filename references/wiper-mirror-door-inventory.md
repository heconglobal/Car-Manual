# Next mechanism inventory — primary catalog review

Reviewed September 22, 2026 against the locally inspected [GM Fiero Parts & Illustrations CD](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf). These are service-catalog identities and construction references, not proof of the original installed stampings or measured component dimensions. The pending mechanism details have not been added to the frozen application build.

## Windshield wipers — PDF 284, 286–287

PDF 284 separates right and left wiper transmission assemblies and the arms/blades from the motor and its output crank. The two transmission assemblies are catalogued as RH 22039336 and LH 22039337. The motor application distinguishes the 1984–85 non-CD4 unit (22062915) from the 1985–87 CD4 unit (22062913); the broader exploded-figure year range does not override this application table.

PDF 286 shows the pulse motor housing, separate board and cover kit, output crank and nut: 22062913 motor, 22102002 circuit board, 22039315 cover kit and 22039338 crank. Those numbers do not establish board population, component values, wire pinouts or delay calibration.

PDF 287 shows the non-pulse motor internals separately: cast enclosure and cover, output seal, crank/nut, mounting grommets, two washers, reduction gear assembly, shaft bearings, brush holder, bearing straps, armature/worm, permanent-magnet field and park-switch actuator. Relevant identifiers include 22029826 brush holder, 22030808 armature, 22038937 cover kit, 22030807 field and 22029824 park-switch actuator. It notes reassembly screw package 22029895. Tooth counts and all gear profiles remain unverified; no counts should be inferred by simply drawing plausible teeth.

Remaining scopes under 16.1: separate LH/RH pivots and transmission links; blade/arm construction; correct manual/pulse variants; complete motor internals and park switching; source-linked routing, sweep calibration and glass/hood clearance. Nominal 18-inch blade information is separately recorded in the 1985 Pontiac specification form; it does not define every blade holder or arm dimension.

## Exterior mirrors — PDF 288

The drawing distinguishes D35 manual control and DG7 electric units. Its application table separates 1984–85 electric mirror assemblies from 1986–88 assemblies, and also distinguishes 1984 glass from 1985–87 glass/carrier parts. An undifferentiated 1984–88 electric mirror cannot be claimed from this drawing.

It shows the left manual remote cable/knob, right manual housing and convex glass, electric glass/carriers, motor packages, mounting pads, nuts/washers, control and separate harnesses. Remaining requirement 15.3 needs those internal pivots/drive elements and actual attachment interfaces, plus factory-year electrical verification. The current electric-mirror preview changes controls but does not supply those internals.

## Door glass, regulators and locks — PDF 300–302

Figure 2P10-004 has 54 callout types, including left/right and option alternatives; it is not a quantity list for one door. The current door scopes already represent glass/outer skin/trim, hinge straps and pins, spring, latch/striker, selected rods, inner reinforcement, seal and grouped attachments. Those meshes do not cover all 54 callouts or establish every part's exact form.

Unfinished window mechanisms (15.1):

- Glass-mounted regulator cam, rear glass stops and inner-panel stops.
- Manual scissor regulators RH 20302330 / LH 20302331; separate electric regulators RH 20311752 / LH 20311753 and motor 22082528.
- Forward/rear guide cams, inner-panel cam, guide-run retainers and supports, regulator-stop bumpers and belt glass stabilizers.
- Glass retainer/bushings/buttons: the catalog explicitly distinguishes the 1984 steel-type bushing from 1985–88 bushing 20562754.

Unfinished lock mechanisms (15.2): latch internal pawls and springs; key cylinder internals and retainer; over-center spring; inside/outside control rods and clips; inside lock control; striker anchor plate; electric lock relay, actuator/bracket, bell-crank plate and actuator rod. The grouped latch model is not a complete mechanism.

Unfinished seals and attachments (15.4): 1984–85 belt trim retainers RH 20352606 / LH 20352607 differ from the later pair; outer belt sealing strips include different attachment types. Inner belt strips, inner shields, channels/felts and all attaching hardware require source-matched profiles and quantities.

The motor line's option annotation should be cross-checked against the full option application table before publishing an RPO compatibility rule. None of these service-catalog numbers establishes the user's original build options from the VIN.

## Wiper construction and circuit follow-up

The adjacent-year original Pontiac service manual, PDF 1131–1134 (8E2-1–4), supplies a useful construction breakdown: permanent-magnet field, armature, three brushes, drive gear, cam-operated park actuator, brush-holder circuit breaker, molded cover, die-cast housing and separate pulse board. It describes seven cover rivets and a grounding/suppression strap at a mounting grommet. These are 1986 references; catalog application must establish use on the 1985 original unit before marking that variant verified.

The washer pump mounts beneath the bottle, with a separate check valve, hose branches and nozzles. Do not substitute a generic inline pump. The service text explicitly says the motor terminal letters in its explanation are illustrative; a connector face view is needed before publishing a physical pinout. Neither the schematic nor the exploded drawing establishes wire lengths, motor gear tooth count or pivot coordinates.

Original 1986 body-electrical sheet 8A-90-0 (PDF 984) and the 1985-indexed [standard](https://charm.li/Pontiac/1985/Fiero%20V6-173%202.8L/Repair%20and%20Diagnosis/Wiper%20and%20Washer%20Systems/Diagrams/Electrical%20Diagrams/Without%20Pulse/) and [pulse](https://charm.li/Pontiac/1985/Fiero%20V6-173%202.8L/Repair%20and%20Diagnosis/Wiper%20and%20Washer%20Systems/Diagrams/Electrical%20Diagrams/With%20Pulse/) sheets were inspected. The indexed standard drawing specifies 20 A, while the pulse drawing specifies 25 A; this conflict with the general owner fuse table remains unresolved. No fuse value was changed from these secondary-indexed sheets.
