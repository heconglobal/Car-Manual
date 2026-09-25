# Current development review — Body R8 complete exterior pass

**Paused at the owner’s request after the BODY R8 update.** [Saved state and unfinished verification](r8-user-pause.json).

[Open the workshop](http://localhost:5185/) · [Shared workstation](http://100.122.225.61:5185/)

**Not ready for final UAT under the requested all-items-complete criterion.** 0/109 requirements are accepted; 37 are partial and 72 remain open. The [checklist](../REMAINING-WORK.md) retains the full scope and evidence gaps.

## This pass

- Side and wraparound moldings follow the installed panel skin across their entire cross section. The side line no longer bows at the rear quarter.
- The driver intake sits below the molding, with accurately cut intake/fuel apertures. The front deflector sits below the lower nose return.
- The roof return and rear pillar share their upper boundary. Hood/deck seams, wheel faces, tire sidewalls and tread, carrier/wing support contacts, sail appliques, paint reflections and lamp covers were refined and checked in close views.
- The deeper R7 rear apron, curved bumper ends, exhaust scallops, recessed plate and softened lamp corners remain.
- The [R8 exterior specification](../references/body-r8-specification.md) covers every exterior region and separates published dimensions from reconstruction. Sixteen selected nominal comparisons remain; H102/H104 bumper ground-reference interpretations remain unresolved.
- [Body comparison](http://localhost:5185/body-review.html) includes wheel, roof and front close views. [Rear-lamp review](http://localhost:5185/tail-review.html) uses the same layered geometry. The manual identifies **BODY R8**. Factory tooling accuracy and owner sign-off remain open.

## Verification

**Full browser regression is not yet passing on the current source.** 4/40 scenarios have eligible passing evidence; an unfinished or interrupted run does not count as a complete pass.

[Browser execution notes](browser-verification-notes.md) distinguish this targeted run from archived earlier applications. The latest raw report may cover only one batch; the consolidated browser evidence accounts for every current scenario.

Aggregate geometry checks require a current-source refresh. All five targeted body/clearance audits pass on this source. [Focused results](body-geometry-verification.json). This is a focused exterior verification, not a current full-vehicle aggregate pass. The rear-body surface audit has 16 check groups covering pad separation/height, plate recess/visibility, license-housing concealment, outer/inner lens ordering, rear apertures, the lower nose, factory lamp datums/load conventions, four-chamber inventory, cover clarity and fitted lens ends. These are shape regression checks, not factory acceptance. The body audit separately measures 16 selected nominal dimensions on actual triangles and checks bilateral/axle anchors. Its numerical tolerances are software comparison tolerances, not manufacturing tolerances. The exterior audit has fifteen checks covering shared panel vertices, apertures, wheel lips, mirror fit, pad tessellation, fuel-door clearance, wiper span, the 1,752 mm body-width datum, distinct separation offsets and option ownership, plus sunroof panel/body hardware ownership, open trim/latch cavities and glass thickness. The new exterior-fit audit adds actual-mesh checks at 78 trim/paint sightlines, molding straightness, nine clear intake sightlines the road-tire tread envelope, 234 carrier-support contacts and 130 wing-pedestal contacts. The internal audit has 38 checks covering all twelve lifter inventories, oil passages, containment and ball-seat interfaces plus pump alignment/chamber fit. The oil-pump audit adds six checks for its twelve selections, static tooth separation, shaft/socket fits, relief containment and open pickup/screen geometry. The existing timing audit remains separate. Other geometry checks cover catalogs, installed/detail agreement, selected factory datums, electrical cavities, wiring, hood clearance and distribution. These tests do not establish every factory dimension or operating clearance.

Hardware captures require a current-source refresh.

The last recorded reference audit reached 14/16 documents and found 99 PDF page references within their downloaded editions. Blocked secondary lookups remain in the [link report](reference-link-audit.json). Reachability and page bounds are separate from content verification.

The production build passes with its existing bundle-size advisory. Distribution checks found no manual scans, component photographs or downloaded car meshes shipped as viewer substitutes. Component geometry is native; the licensed studio HDR provides lighting.

## Coverage and remaining acceptance work

The app has 152 vehicle assembly records and 1780 selections across 13 detail families. Counts include grouped sets and overlapping views; they are not a complete physical bill of materials.

| Explorer | Selections / grouped sets |
| --- | ---: |
| Wiring & controls | 99 |
| Starting / charging | 62 |
| Lighting | 112 |
| Headlights | 189 |
| HVAC | 64 |
| Body | 169 |
| Exhaust | 44 |
| Fuel | 53 |
| Suspension | 216 |
| Engine | 429 |
| Transmission | 95 |
| Cooling | 36 |
| Brakes | 212 |

Engine timing requires a current-source audit.

Measured casting/panel profiles, production hard points, complete internal fits/routing, door/window/lock/mirror mechanisms, wipers/washer details, seats/restraints, column internals, full A/C refrigeration and validated procedures remain incomplete. The VIN does not establish original paint/trim, spring codes or every installed option. No free complete factory CAD/dimensional drawing set has been obtained. These gaps remain open.

[Acceptance status](acceptance-status.json) · [Browser evidence](regression-summary.json) · [Latest raw run](full-regression.json) · [Geometry verification](geometry-verification.json) · [Model audit](model-audit.json) · [Headlight electrical checks](headlight-electrical-audit.json) · [Cross-view geometry](cross-view-scale-review.json) · [Engine timing](engine-timing-audit.json) · [Lifter/pump internals](engine-internals-audit.json) · [Oil-pump construction](oil-pump-audit.json) · [Component inventory](component-coverage.json) · [Geometry comparison](indexed-geometry-comparison.json) · [Native hardware](native-windows-internals-review.json) · [Visual manifest](visual-inspection-manifest.json) · [Checklist/test mapping](checklist-test-matrix.md) · [Walkthrough](../UAT.md)
