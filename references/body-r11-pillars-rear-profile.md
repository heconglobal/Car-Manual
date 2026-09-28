# Body R11 — pillars and rear bumper profile

Target: the 1985 SE 2M6 **non-aero notchback**, with bumper pads. This revision addresses the owner's rejection of the pillars and rear-bumper angles. It does not certify exact factory panel tooling.

## References actually inspected

| Publication | Use and limits |
| --- | --- |
| [1985 Pontiac MVMA specifications](1985-86-specifications.pdf#page=22), PDF22–23/26 | Retain 2373 mm wheelbase, 4082 mm length, 1752 mm width, 1192 mm height, 924/785 mm overhangs and the other selected dimensional anchors. Lamp heights retain the explicitly estimated conversion between stated load conditions. |
| [1985 Pontiac full-line catalog, p12](pontiac-1985-full-line-12-r11.jpg) | High-resolution original Pontiac photographs of the non-aero SE and coupe. Inspect A-post width, roof turn, B-post, triangular sail applique and rear body slope. Perspective photos establish appearance, not local dimensions. |
| [Same catalog, p13](pontiac-1985-full-line-13-r11.jpg) | Original bare-frame, factory assembly and detached-panel photographs. Steel pillars follow the opening perimeter; the model's second exposed bar inside the glass was wrong. |
| [Pontiac Performance Plus production profile](pontiac-super-duty-guide-r7.pdf#page=37), printed46 | Dimensioned production-car packaging illustration, not the racing body or the generic MVMA sedan key. Compare roof/buttress and rear fascia outline. Local line angles are hand-read reconstructions. |
| [1984 Canadian Fiero brochure](1984-pontiac-fiero-canadian-r11.pdf#page=2), PDF2 | Independent GM CAD side silhouette, saved as [a PDF crop](gm-1984-cad-profile-r11.png). Supports rearward-rising underside and raked rear panel. Adjacent-year illustration; do not import its deck ventilation or substitute its rounded brochure dimensions for the 1985 MVMA table. |
| [GM 22P early notchback](fiero-parts-cd.pdf#page=336), PDF336–338 | Assembly identities and original-year applications; exploded diagrams are not scale surface templates. |
| Owner IMG_5459 / IMG_5461 | Additional views of the target car; checked against the original publications above. |

New catalog scans were downloaded from the [Crittenden Automotive Library's original 1985 Pontiac catalog](https://www.carsandracingstuff.com/library/p/pontiac_85pontiac.php). The [1984 brochure scan](https://xr793.com/wp-content/uploads/2021/01/1984-Pontiac-Fiero-CN.pdf) is original GM of Canada material hosted by an archive. GM's [Heritage Archive](https://www.gm.com/heritage/archive) and downloadable-kit index were also checked; a dimensioned local pillar/fascia surface-coordinate set was not obtained. The downloaded 1985 catalog **cover car has an aero bumper** and was explicitly excluded from this SE bumper reconstruction.

## Corrections

- Moved the reconstructed A-post head 44 mm forward in authored coordinates and opened a painted land between the windshield and side-window seals. The windshield and A-post sweep are specified in installed coordinates and inverted through the shared datum correction, preventing that correction from bending the posts. Glass and seals continue to share the same boundary. The movement is a modeling correction, not a GM published dimension.
- Derived the steel A/B/roof members from the opening perimeter, moved the transverse front header behind the roof, and eliminated the detached upright visible through the pane.
- Shortened the rear buttress run onto the quarter, replaced the pinched fourth-power crown correction with a shared-boundary loft, and projected a rounded triangular applique from its physical elevation onto that loft. Its edge no longer bows with the loft parameterization.
- Increased the forward rake above the rear bumper crown. The deck, quarters, fascia, lamps and fittings share that correction. The impact extremity and published overall envelope remain anchored.
- Replaced the uniformly deep rear skirt with a lower side return rising toward the bumper. The shield and its nuts were moved behind the return. The 315 mm reconstructed apron minimum **is not an interpretation or verification of H104** (333 mm).
- Added pillar and bumper profile cameras and an original-publication selector to [the comparison workspace](http://localhost:5185/body-review.html). Source photographs use contain sizing so their complete outlines remain visible.

## Evidence and limits

The new [profile audit](../artifacts/pillar-profile-audit.json) checks actual steel-frame sightlines and the rear-panel angle. The [preserved R10 comparison](../artifacts/pillar-profile-r10-baseline.json) fails: 178 obstructed sightlines, approximately 14.3° rear-panel rake from vertical, and zero rise of the rear lower quarter. R11's reconstructed rake is approximately 34.6°, versus approximately 32.9° hand-read from the GM production drawing. The ±8° comparison allowance covers a coarse scan/line interpretation; **it is not a factory manufacturing tolerance**. R11 also checks the installed A-post sweep; maximum side-elevation deviation is approximately 2.73 mm. This is a reconstruction straightness bound, not a factory tolerance. The old and new sightline sample counts differ because their window contours differ; both use the same sampling rule.

The old rear audit's requirements for a minimum below 260 mm and an 80 mm strip beneath the pads encoded the rejected flat skirt. Those assumptions have been replaced with the documented rising-return reconstruction, while the unresolved bumper-reference measurement surface remains open. Other physical checks—lamp openings, plate visibility, optics, shield clearance and published bulb locations—remain required.

See [current verification](../artifacts/current-UAT.md) for final source hashes, completed checks and inspected captures. Exact pillar cross-sections, glazing templates, bumper tooling, local radii, gaps, hard points, physical sealing, original installed identifiers and owner sign-off remain unverified. A passing numerical or visual regression is not proof that those open requirements are complete.

The contact audit retains exact boundary probes, with a submicrometre inward retry only after a miss. A standalone seal-mesh check showed the two leading belt-corner rays changing from miss to hit after just 1.36 nanometres of displacement: Float32 triangle-edge ownership, not a physical gap. Retry displacement is capped at 0.5 micrometre and reported separately; no millimetre-scale misses are waived.
