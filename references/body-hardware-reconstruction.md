> Historical hardware pass. The owner rejected the body appearance on 24 September 2026; prior references to accepted contours below are superseded by [the full exterior revision](exterior-reconstruction-20260924.md).

# Body panels and attachment reconstruction

Target: 1985 Fiero SE notchback, US LHD. This pass keeps the accepted exterior surfaces and adds a native 3D construction explorer. It is not a certified body alignment or tooling model.

## Inspected references

- GM 22P CD PDF 237–238: 1985 SE front hood, mechanical support, hinge pair, fascia/fender/liner and attachment identities.
- GM 22P CD PDF 300–302: door hinge straps, pins, lower hinge spring, latch, striker, rods, glazing and manual/power regulator distinctions. The current pass covers hinge/latch/rod relationships; regulator and detailed lock internals remain open work.
- GM 22P CD PDF 336–338: 1985–88 P37 exterior panels, early grille and retainer applications, rocker covers, roof and sail appliques. Later fastback panels are not imported.
- GM 22P CD PDF 343–344: rear-compartment weatherstrip, lock, cylinder/shaft, hinges, torque rods and retainers. Torque rods vary with deck equipment; a single reconstructed pair is shown, not a validated spring selection for every spoiler.
- 1986 Pontiac service PDF 1208–1209, printed 4-4 / 4-5: forward hood hinges, slotted mechanical stay, rear-edge hood latch, striker and release cable.
- 1986 service PDF 1214–1215: door trim/clip arrangement; PDF 1248–1252, printed 7-2 through 7-6: decklid hinges, crossed torque rods, latch/striker, notchback lock cylinder and rear trunk weatherstrip. Explicitly adjacent-year evidence.
- Public 1985 factory service sample, printed 6-9, Fig. 6-15: rear roof panel attachment groups (four side-rail bolts, six frame bolts, three fuel-pocket bolts, two pillar bolts, three roof nuts). The locally saved sample is in `references/brakes/`; see original source URL below.

Primary source links:
- https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=336
- https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=1208
- https://cdn11.bigcommerce.com/s-ragx7opcj4/content/files/1985-pontiac-fiero-service-manual-sample3.jpg?t=1663030449

## Implementation

111 selections include 24 shared panel/glazing/trim groups and 87 hardware/structure sets. The whole vehicle now exposes six additional groups: driver/passenger rocker covers, door interior trim and side glass. They use the original accepted vertices; they are no longer attached to the door exterior or windshield selection.

Hardware adds open hood/deck reinforcing frames, forward hood hinge pair, slotted closed-position stay, hood latch/striker/cable/seal, rear deck hinge pair, crossed torque rods/hooks/pins/sleeves, rear lock and striker components, trunk weatherstrip, vent supports/fasteners, four wheelhouse liners, door hinge straps/pins/spring, inner door reinforcement, latches/rods/strikers, trim clips, rocker retainers and roof/fascia/quarter attachment sets.

Geometry is shared between the body explorer and whole vehicle. Panel painting, removable roof states and other visible options follow Configure in both views. Exploded skins and bonded reinforcements illustrate construction; they are not an order of disassembly. Headlamp assemblies remain in Electrical rather than being treated as hood sheet material.

## Remaining accuracy limits

Accepted outer contours are reconstructed from period documentation and owner images; detailed panel cross sections, bonded returns, material thicknesses, fastener lengths, flange profiles and body datum coordinates are not measured. The door inner frame and latch are static reconstructions. Window regulators, lock tumbler/lever internals, power releases, full weatherstrip sections, remaining trim and fastener inventory, optional roof latch hardware and functional door/hood motion remain incomplete. The body understructure is still approximate.

The mechanical stay’s local placement and closed pose need direct vehicle dimensional confirmation. The torque rods have no calibrated rate/preload or verified spoiler-specific selection. No loaded-spring procedure, body adjustment specification or repair torque is supplied.

## Verification

Geometry audit verifies every selection has finite native geometry and matching picking identity, shared surface ownership, independent rocker/trim/glass entries, forward hood hinges, forward deck hinges, crossed rods below the backlight, driver-side release/fuel-pocket attachments and lock-retainer/barrel alignment. Desktop/mobile interactions and close-up visual findings are recorded in `artifacts/UAT-readiness.md`.

Cabin filter integration: the separately owned driver/passenger door trim groups belong to the Interior system, so hiding exterior body panels in the cabin view retains the trim. Their Body-explorer surface IDs and door child scopes are unchanged.
