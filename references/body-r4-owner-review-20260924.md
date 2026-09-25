# Body R4 — response to the owner's body rejection

The owner reviewed `http://localhost:5185/` and rejected the rear bumper and overall body proportions. The served `src/body-datums.js` was checked directly and contained the preceding calibration. The complaint was therefore treated as a model-quality failure, not dismissed as an outdated build. The earlier 16 nominal-dimension checks were too narrow to establish accurate appearance.

## Reference and actual changes

The four original owner photographs `IMG_5459.jpg` through `IMG_5462.jpg` were reopened. Three are preserved in `references/owner-body-review/` for the local comparison workspace. No reference photograph is used as a model surface or included in the production viewer bundle.

- **Rear bumper:** separate taller pads, revised bumper crown and painted bridge, raked lamp panel and a centre plate recess with tapered walls. The previous rear upsweep reduced the apparent pad height; the revised authored section accounts for that effect. Pad finish is matte instead of the glossy material that produced a misleading continuous white highlight.
- **Plate:** the prior 282 × 79 mm graphic had the wrong aspect ratio. It is now 300 × 150 mm within a taller recessed mounting area, between the independently owned pads. This is a reconstructed plate/bracket presentation, not a measured original bracket.
- **Rear lamps:** outer envelope height/width better follows the photographed strip. More importantly, the large outer face is subdivided before wrapping onto the curved rear surface. The previous cap triangulation cut behind inner optics at sampled locations. Horizontal/vertical grid strips are also sampled along the curve. Inner lenses, bulbs, housings and service IDs remain separate. Tint and material settings are visual approximations, not optical calibration.
- **Lower fascias:** reduced the excessive inward tuck at the lower front and rear. The old lower nose created a pointed wedge even though the tip-to-axle overhang matched a nominal dimension.
- **Doors and rockers:** less taper at the lower door, a lower transverse section crown, a longer shallow upper taper and broader formed rocker sections. Shared trim and adjoining panel functions retain the same coordinate relationships.
- **Windshield/roof:** a tapered photo-guided correction advances the upper forward roof region by up to 65 mm, while leaving the published lower windshield/backlight reference points and roof height fixed. This is not a sourced factory windshield-angle measurement.
- **Revision identification:** the manual header reads **BODY R4**, About this build describes the correction, and exported UAT feedback carries `bodyRevision: R4`.

## Comparison workspace

Open [the local comparison](http://localhost:5185/body-review.html). It uses the production body builder, wheel geometry, interior context, exterior lamps/headlamps and exhaust. Concealed service assemblies are omitted to keep inspection manageable. Its lighting is simpler than the main viewer, and its camera presets approximate the reference directions; the photographs and renders are not calibrated photogrammetric overlays. Neutral panel material helps inspect broad surfaces without paint reflections. Owner markings, weathering and registration are not copied onto the model.

The comparison page and its reference images are included in evidence fingerprints, so changing this inspection setup invalidates its old results. The page is a local development entry, not part of the standard single-entry production build.

## Verification basis

The new [rear-body surface audit](../artifacts/rear-body-surface-audit.json) checks five groups: rear pad separation/height, plate height/recess, outer/inner lens ordering at 24 face samples, clear rear lamp apertures, and the lower front profile. The [preserved baseline](../artifacts/rear-body-surface-baseline.json) fails four of those five groups, including three sampled lens interfaces. This demonstrates specific earlier defects; passing the new checks is not complete factory acceptance.

Selected nominal dimensions remain checked separately by [the body dimension audit](../artifacts/body-dimension-audit.json). The aggregate geometry report, completed browser scenarios and actually inspected capture hashes are in [current review](../artifacts/current-UAT.md), [browser execution notes](../artifacts/browser-verification-notes.md) and [visual findings](../artifacts/visual-review-findings.md). Earlier failed and timed-out comparison runs remain preserved.

## Remaining limits

The owner has not accepted this body. Full panel sections, bumper tooling radii, exact gaps, optical construction, greenhouse profiles, hidden hardware and physical mechanism motion remain unverified. Camera matching and software-renderer artifacts limit photo comparison. This revision corrects identified shape and mesh defects; it must not be described as an exact factory replica or as satisfying all manual acceptance criteria.

## Completed current geometry and build checks

Snapshot e56eb99c8af8893fcd972eb5d4d5805032387975477299a8cbb8e430e16f1b1d passed all 15 aggregate geometry groups, including the 16 nominal body-dimension rows and five rear-body surface groups with 24 lens samples. The production build completed with its existing bundle-size advisory. Direct inspection of the JavaScript served at port 5185 confirmed the BODY R4 header and exported feedback revision. Final comparison and six-view manual browser scenarios completed; the consolidated report records the final targeted interaction coverage separately.

The inspected renders still show differences in corner curvature, local trim/panel gaps and greenhouse outlines, plus strong paint highlights and software-renderer aliasing. Those observations remain unresolved appearance work.
