# Engine component explorer

The vehicle now has a second level of exploration: **Explore engine components** opens the engine by itself. The engine's explosion amount is independent of the vehicle slider. Ten primary subassembly views plus nineteen nested service views filter the engine to their own components and separation offsets. Selecting a mesh or a list entry opens its description, source reference, focus and isolation controls. Back to vehicle restores the previous selection, search, camera and whole-car explosion amount.

## Coverage

315 selectable mesh groups, comprising individual parts and explicitly grouped sets:

- Block / rotating assembly: open cylinder bores, crankshaft, four main caps, paired main-bearing shells, six pistons, ring sets, wrist pins, connecting rods, rod caps and rod-bearing shells.
- Two cylinder-head assemblies: head castings, gaskets, covers, representative bolt sets, twelve valves, twelve springs, separate retainers/keeper pairs/stem seals, twelve stamped rockers with separate studs/nuts, six paired guides, twelve pushrods and twelve lifters, plus exhaust manifolds and gasket sets.
- Induction: lower manifold, middle runners, upper plenum, gasket set, throttle body, fuel rail / regulator and six injectors.
- Timing: camshaft, bearing sleeves, two sprockets, chain, cover/gasket, front seal, chain guide, timing pointer and harmonic balancer.
- Lubrication: open pan, side gaskets, early rear end seal, separate bolts/drain plug, oil pump/drive, pickup/strainer, filter/fitting/bypass, dipstick scope and early oil-pressure sender A/C scope.
- Ignition: 39 selectable parts/sets, including a separate 18-part distributor/ICM breakdown, coil and primary/EST harnesses, tach filter, six plugs and six plug leads plus the coil HT lead.
- Engine controls: 21 selectable sensors, valves, gaskets, fuel tubes and vacuum lines. See `ignition-reconstruction.md` for source pages and limits.
- Cooling/accessories: thermostat scope, water-pump housing/pulley/fitting/gasket/hardware, alternator and belt representation.
- Manual-engine flywheel and rear crank seal.

The model uses local engine coordinates and is a dedicated inspection model; it is not used to change the accepted exterior. Assembly entry builds the meshes on demand. Existing whole-vehicle assembly IDs remain unchanged; four new entries expose ignition and engine controls. These entries reuse the inspection geometry at the vehicle engine envelope.

## Sources

[GM Pontiac 22P, November 1990 edition](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_P22.pdf): printed **H-19** (PDF page 14) for the lower engine, rotating parts, timing and oil-pan relationships; printed **H-22** (PDF page 17) for the heads, valve gear, intake and ignition relationships. Both exploded illustrations were visually inspected from the local reference PDF. H-23 distinguishes the earlier upper plenum from later variants; this mixed-year catalog is not a dimensioned 1985 casting drawing.

[1985 Fiero 6E3](https://fieroinfo.com/manuals/1985_Fiero_6E3_Emissions_and_Drivability.pdf) establishes the L44 / VIN engine-code-9 context already recorded in the vehicle references. Diagnostic procedures have not been imported into the explorer. The separate 1985 Pontiac DIY manual supplies the verified six-cylinder spark-plug reference in each plug inspector (printed 2-22 and 3-3).

## Limits

The part relationships are based on factory illustrations. Local shapes, heights, bore sizes, fastener geometry and explosion offsets are reconstructed. No operating-engine motion, firing order, machining template, tightening sequence, interference-free removal path or interchangeability is implied. Cylinder-position numbers identify viewer instances, not factory cylinder numbering.

This first engine breakdown is not every item in the factory catalog. Several fasteners, gaskets, ring packs and small hardware remain grouped. Spring retainers, keeper pairs and stem seals are now separate service selections. The complete seal / clip inventory, harness and hose routing, internal alternator / lifter / pump pieces and unmodeled distributor variant details and detailed brackets remain incomplete. Individual fastener counts and unverified service values are withheld rather than inferred from geometry. The source-linked spark-plug reference is explicitly verified separately.

Verification: `tests/engine.spec.js` covers independent explosion, nonempty modeled parts, direct mesh picking, scoped search, isolation, nested subassembly navigation, reassembly, vehicle restoration and mobile navigation. `scripts/engine-review.mjs` captures assembled and exploded engine, head, block and timing views. Results are recorded in `artifacts/UAT-readiness.md`.

The 2026-09-21 ignition and engine-control follow-up is documented in [ignition-reconstruction.md](ignition-reconstruction.md). Global vehicle search also finds internal engine parts.


The September 21 service increment adds thermostat, water-pump, dipstick, A/C sender and twelve individual valve-gear scopes. The 105 additional entries include repeated valve hardware and grouped sets, not 105 unique designs. Source/shape limits are recorded in `engine-service-reconstruction.md` and `valve-gear-reconstruction.md`.

### Shared explorer and vehicle frame update

Engine part IDs, source references and service sections remain available after generalizing the explorer for transmission and cooling. Engine geometry and explosion vectors now receive the same US LHD correction as the complete car (-X driver, nose -Z); earlier positive-X-left references are superseded. Existing engine-only counts remain 315, while the combined detail catalog contains 446 entries. `inspection-catalog.js` owns cross-family navigation and `vehicle-frame.js` owns final handedness. An assembly return preserves the original complete-vehicle context even after switching explorer families.
