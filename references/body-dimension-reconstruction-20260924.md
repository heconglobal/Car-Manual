> Historical dimensional-calibration pass. The owner subsequently rejected its body proportions and rear bumper. These nominal-dimension passes did not establish visual accuracy. See [Body R4 correction and review](body-r4-owner-review-20260924.md).

# Whole-body dimensional reconstruction — 24 September 2026

The visible body has been recalibrated against selected nominal dimensions in Pontiac's 1985 MVMA specifications. This is a native-mesh reconstruction, not factory CAD or certification of exact production panel surfaces.

## Evidence and interpretation

The local original scan `references/1985-86-specifications.pdf`, PDF pages 22–23, supplies the dimensional entries; PDF pages 29 and 31 define the reference points. The definitions use a generic sedan illustration, which is not used as a Fiero silhouette. The original lengths row was re-opened at high resolution: **L105 is 785 mm**, correcting the previous worksheet transcription of 783 mm. Consequently 924 + 2,373 + 785 = 4,082 mm.

The modeled cowl and deck points are the lower centreline daylight-opening points of the windshield and backlight. W103 includes body moldings and excludes mirrors/marker lamps; W117 measures the painted body at the front seating reference plane, excluding trim. Rocker bottom and painted closed-door bottom are measured separately. Heights refer to the source's design load of two front occupants and no cargo. Curb-load lamp heights are not treated as exact body-height constraints.

Source-page renders and the old bounds are preserved in `artifacts/body-specification-review-20260924/`. The source worksheet is [1985 MVMA research](1985-mvma-research.md).

## Actual mesh measurements

All dimensions below are millimetres. Values come from actual reconstructed triangles, not just configuration constants. Comparison tolerances (0.25 mm, or 0.30 mm for the tessellated seating section) are numerical software tolerances, not factory production tolerances. Displayed precision is not evidence of equivalent physical accuracy.

| Reference | Before | Current | Published nominal |
| --- | ---: | ---: | ---: |
| L103 — Overall exterior length | 4065.00 | 4082.00 | 4082 |
| L104 — Front overhang | 847.40 | 924.00 | 924 |
| L105 — Rear overhang | 844.60 | 785.00 | 785 |
| W103 — Exterior width excluding mirrors and marker lamps | 1752.85 | 1752.00 | 1752 |
| H101 — Solid-roof body height | 1192.00 | 1192.00 | 1192 |
| L125 — Cowl position aft of base grid | 346.50 | 197.00 | 197 |
| H114 — Cowl height at vehicle centreline | 829.00 | 832.00 | 832 |
| H138 — Deck point height at vehicle centreline | 840.00 | 875.00 | 875 |
| L123 — Cowl-to-deck upper structure length | 1382.00 | 1518.00 | 1518 |
| W117 — Painted body width at front seating reference | 1690.08 | 1750.94 | 1751 |
| H112-left — Front rocker bottom, left | 199.00 | 168.00 | 168 |
| H111-left — Rear rocker bottom, left | 199.00 | 171.00 | 171 |
| H133-left — Painted closed door bottom, left | 245.00 | 245.00 | 245 |
| H112-right — Front rocker bottom, right | 199.00 | 168.00 | 168 |
| H111-right — Rear rocker bottom, right | 199.00 | 171.00 | 171 |
| H133-right — Painted closed door bottom, right | 245.00 | 245.00 | 245 |

[Current mesh measurements](../artifacts/body-dimension-audit.json) · [Preserved baseline measurements](../artifacts/body-dimension-baseline.json)

## Scope across the body

| Area | Revision / retained construction |
| --- | --- |
| Front fascia, pads, rub strips, lower deflector | Front overhang corrected to 924 mm; attached trim and lamps follow the same local map. |
| Hood, headlamp covers, front fenders | Cowl end advanced to the documented reference; wheel openings and axle stations held fixed. Hardware follows the corrected panel. |
| Doors, outer handles, moldings, belt seals | Continuous curved door section replaces the localized bulge, widened at the seating plane; fender/quarter joins blended. Seams and side moldings recessed within the nominal body envelope. |
| Rocker covers | Front/rear bottom heights corrected to 168/171 mm, separate from 245 mm painted door bottoms. |
| Windshield, roof, AD3 glass/hardware, backlight and sails | Windshield lower point and backlight lower point positioned from cowl/deck definitions; roof height retained at 1,192 mm. All roof options remain independently selectable. |
| Rear quarters and fuel door/pocket | Quarters blended into door sections; filler neck/cap follows the driver-side body aperture. Intake frame and vanes recessed. |
| Decklid, vents, carrier and wing | Rear body lift follows the 875 mm deck point; deck hump reduced to avoid counting that lift twice. Separate option geometry retained. |
| Rear fascia, pads, lights | Rear overhang shortened to 785 mm; lamps and body attachments follow the same mapping. |
| Mirrors, wipers and antenna | Existing independent native geometry retained and mapped with the surrounding body where applicable. No new claim of exact internal construction. |
| Visible exhaust finishes | Tail ends and shields shortened to fit inside the corrected rear envelope. |
| Structure, hinges, latches and retainers | Reconstructed body hardware/structure mapped with the panels. Engine, transmission and axle positions are not globally rescaled. |

Body still exposes **169 selections**, including **58 exterior selections**. These include grouped sets and are not a complete physical bill of materials.

The datum adjustments are centralized in `src/body-datums.js`. Interpolation between sourced anchors is reconstructed. In particular, the cowl transition is monotone so that the front wheel opening is preserved. The geometry helper bakes affected meshes into shared coordinates before applying the map, keeping installed and detail views consistent.

## Verification and limits

The dedicated dimension audit measures 16 rows and checks bilateral bounds and fixed axle anchors. It joins the existing geometry audits, including shared panel identities, wheel openings, option ownership, lamp cavities and actual hood-to-cooling clearance. The hood hardware regression now checks front/rear thirds of the actual corrected panel; the previous absolute 900 mm gap described the old reconstruction, not a factory datum.

Current test results, source fingerprints and inspected captures are recorded in [current review](../artifacts/current-UAT.md), [geometry verification](../artifacts/geometry-verification.json), [browser evidence](../artifacts/regression-summary.json) and [visual findings](../artifacts/visual-review-findings.md). Historical runs retain their original snapshots and do not establish current-source passes.

**Exact factory appearance remains unverified.** Full panel cross-sections, tooling radii, production gaps, bumper profiles, hard points, hidden supports and hardware, weatherstrip sections and calibrated mechanism travel are still missing. Interpolation and the resulting highlights need further reference/owner review. Software-rendered captures show visible aliasing and bright reflections; no current hardware performance or photorealistic acceptance is claimed. Nominal-dimension agreement does not close the entire-body or full-manual acceptance requirements.

## Completed software review for this revision

On source `be55874c8a323a014be3039418a5c5df284e935828ebbebb99299e93bd46187f`, all 16 selected dimension rows and all 14 geometry audit groups passed. Eleven targeted browser scenarios completed with archived reports, and 24 captures were opened and recorded. The production build passed. Twenty-six other browser scenarios were not refreshed on this application; no full-suite or final owner acceptance is claimed. See the linked current review and browser execution notes for raw evidence and preserved interrupted runs.
