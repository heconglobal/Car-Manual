# Engine callout gap audit

Checked against the November 1990 GM 22P L44 tables on 2026-09-21. This is a targeted audit of missing or simplified service items, not a complete bill of materials. Table callout numbers refer to their own drawing and cannot be combined across figures. The catalog covers multiple model years; its later replacement designations do not establish the parts installed on this VIN.

## Lower engine

Drawing H-19 and tables [H-20 / H-21, PDF 15–16](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_P22.pdf#page=15).

| Callout | Component | Current coverage / needed work |
| --- | --- | --- |
| 18, 26 | Oil-filter fitting and bypass valve | Filter exterior plus separate fitting and bypass-valve representation now exist. Exact pad passages and valve calibration remain unverified. |
| 20–23 | Starter, shims and mounting bolts | Starter construction is now available as 22 selections in the charging explorer and shared in the vehicle. Original casting, shims, mounting fits and exact drive geometry remain unverified. |
| 24–25 | Oil-pressure / fuel-pump switch and fitting | Early sender, A/C pipe, adapter and support bolt now have a dedicated scope. Non-A/C routing remains missing; dimensions are reconstructed. |
| 36 | Distributor-to-oil-pump intermediate shaft | Distinct hex drive shaft now selectable. Exact distributor/pump alignment and engagement lengths remain unresolved. |
| 37–39 | Oil pump, inlet screen and fastener | Twelve-selection pump/pickup construction now includes two gears, cover, relief piston/spring/pin, cover screws, mounting bolt and separate screen. Adjacent-year GM figure 23 establishes internal relationships; original 1985 profiles, tooth count and calibration remain unverified. |
| 40–43 | Dipstick, attachment, tube and tube seal | Four selections now exist: flat dipstick, hollow guide tube, attachment and entry seal. Route, length and calibration marks remain approximate. |
| 44–47 | Pan rear seal, pan and fasteners | Separate side strips, early rear end seal, flange bolts and drain plug added. Exact early-pan flange/end-seal fit and front sealing remain incomplete. |
| 54–59 | Crank pulley, washers, bolts and key | Separate crank pulley and damper groups now exist with a reconstructed common belt envelope. Washers, key and small attachment components still need independent identities and verified geometry. |
| 70–77 | Timing pointer, water-pump fitting, pump gasket, front seal and cover gasket | Separate pointer, front seal, pump/cover gaskets and early heater fitting added. Pump exterior/pulley refined; hub, unitized shaft/bearing, seal and reconstructed impeller now separate. Original outlines, attachment map, vane geometry, weep passage and internal variants remain unverified. |
| 79 | Timing-chain guide | Separate formed guide and wear surface added; exact guide profile remains unmeasured. |
| 88–90 | Later oil-pan reinforcement, studs and gasket | Marked 1987–88 in this table; do not add them to an original 1985 configuration. |
| 97–98 | Clutch cover and driven plate | Now independently inspectable in the transaxle clutch scope, with a shared engine/transaxle flywheel builder. Production tooth profile, release travel and all fits remain unverified. |

## Upper engine

Drawing H-22 and tables [H-23 / H-24, PDF 18–19](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_P22.pdf#page=18).

| Callout | Component | Current coverage / needed work |
| --- | --- | --- |
| 7–12 | Throttle-cable brackets, idle-air tube/hose and control lever | Throttle, TPS and IAC exist; these supporting parts still need separate geometry. Keep manual/automatic lever applications distinct. |
| 17–18, 39, 110 | Coil shields and brackets | Coil and a folded bracket are represented. Actual upper/lower shields, rear support and holes remain incomplete. |
| 23 | Spark plug | Six individually selectable plugs. Table lists R42TS; the original 1985 DIY manual lists R42CTS. The UI labels the DIY value as a **period manual reference**, not a current replacement recommendation. |
| 24–25, 111 | Wire supports and boot shields | Comb representations and boots exist; actual bracket/shield profiles and installation routes need verification. |
| 26–28 | PCV valve, grommet and oil-fill cap | PCV/grommet are modeled together; oil cap is grouped with a valve cover. More independent service identities are needed. |
| 29–35 | Fuel-line seals, pipes, clips and bracket | Fuel tubes/fittings are represented; precise seals, mounting clips and bracket geometry are incomplete. |
| 42–47 | Valve keepers, spring caps, stem shields/seals and springs | Retainers, split keeper pairs, stem O-rings, intake retained seals and exhaust shields are separate. Profiles/heights remain reconstructed. |
| 52–58 | EGR/exhaust gaskets, manifold hardware and lift bracket | Main EGR tube and manifold paths exist; correct gaskets, shields and lift hardware need further work. |
| 65–69 | Pushrod guide, rocker stud, rocker and nut | Hollow stamped rocker and grouped spherical fulcrum refined. Studs, nuts and paired pushrod guides are separate; twelve individual valve scopes added. |
| 73–76 | Intake bolts, gaskets and splash guard | Manifold layers and port-gasket representations exist; correct gasket plates and valley splash guard are missing. |
| 77–85 | Oil-pressure piping, fan switch, cold-start switch and MAT sensor | Cold-start switch and ECM coolant sensor exist. Other distinct sender/switch bodies and option-dependent oil piping remain incomplete. |
| 86–90 | Thermostat housing, gasket, thermostat and cap | Five service selections now share geometry between vehicle and engine. GM rating and explicitly labeled replacement thermostat dimensions are linked. Housing/cap outlines remain reconstructed. |
| 97–103 | Throttle-body coolant hoses, tubes, clamps and bolts | Missing as individually resolved factory parts. |
| 105–109 | Crankcase breather tubes, connectors, grommet and heater-hose shield | Generic PCV hose exists; the complete breather/heater arrangement is incomplete. |

The current 43 ignition selections and 429 engine selections are counts of selectable modeled parts or sets, not a claim that these table rows are all covered. Geometry completeness requires checking shape, material, attachment, orientation and variant as well as merely creating a catalog entry.


## Added internal-detail reconciliation

The twelve hydraulic lifters now each map all nine callouts of adjacent-year GM 1986 General Engine Mechanical figure 46 to a nested selection. These callouts belong to figure 46, not H-22, and must not be merged into the upper-engine numbering. See [implemented lifter construction and remaining dimensional gaps](lifter-internals-followup.md).

The water-pump internals are a different evidence class: general manufacturer construction identifies the units, while GM H-19 identifies the complete pump. No original internal callout numbers are assigned to the reconstructed hub, bearing, seal or impeller. Original internal variants remain checklist item 13.4.

The [whole selectable inventory](../COMPONENT-COVERAGE.md) now exposes 1,718 selections. Complete GM callout reconciliation is still open under 20.6; the inventory does not silently convert a modeled group into verified coverage of every physical piece.

The oil-pump internal figure 23 reconciliation is documented separately in [oil-pump-reconstruction.md](oil-pump-reconstruction.md). The two gear selections share that figure’s callout 2, and the pickup/cover share callout 3. No new part number or original 1985 measurement is inferred from those adjacent-year callouts.
