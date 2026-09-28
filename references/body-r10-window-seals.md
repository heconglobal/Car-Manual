# Body R10 — window seal correction

The owner rejected the R9 window seals. This pass addresses the fit and appearance of the side-glass weatherstrips, belt wiping lips, windshield/backlight moldings and removable-roof seal.

## What was wrong

R9's outer A/roof seals were flat ribbons offset vertically, rather than formed sections oriented to the glass. The rear strip did not form a common corner with the upper piece. The belt lip stopped short and below the glass. A separate old inner door-opening gasket followed a seven-point loop across the upper/rear clear pane. The sunroof contact tube followed the painted aperture instead of the smaller glass perimeter, leaving gaps.

The previous audit only measured distance from a few glass-edge samples to some seal vertices. A nearby vertex could pass that check while the seal missed the contact line or another gasket crossed the pane. R10 tests the actual triangles for edge contact and clear-pane obstruction.

## Corrections

- A-pillar, upper and lock-pillar profiles use one shared boundary and local glass orientation. Their corner vertices meet. The retaining channel sits behind the rubber; the small glass stop follows the rail plane.
- Both belt wiping lips use the actual lower glass edge, including its endpoints. The upper glass tessellation includes the A-pillar/roof junction.
- The inner door-opening weatherstrip follows the same upper aperture, recessed and offset outside the clear pane, then returns around the lower jamb.
- Windshield and backlight moldings are continuous formed loops with closed cross sections, instead of four separately ended round tubes.
- The sunroof bed/contact lip follows the actual glass boundary and bridges its clearance to the roof aperture. It remains with the body when the panel is removed.
- Exposed window retainers, windshield belt fillers and the lock-pillar surround use satin black. The previous clear-coated black surround reflected almost white in a side view despite having no geometric hole.

The shared body builder supplies the vehicle and Body explorer. Existing part identities and option ownership are retained.

## References and evidence

GM 22P [PDF300](fiero-parts-cd.pdf#page=300) supplies the door/glass relationships; [PDF330](fiero-parts-cd.pdf#page=330) supplies the removable-roof components; [PDF336–338](fiero-parts-cd.pdf#page=336), figure 2P12-012, identifies the opening retainers, stops and corner/backlight fillers. The original [1985 brochure](1985-fiero-brochure.pdf#page=3) and the owner's side/rear photographs support appearance. These illustrations are not measured extrusion drawings.

The [R9 baseline audit](../artifacts/window-seal-r9-baseline-audit.json) detects 26 obstructed samples among 1,066 side-glass interior sightlines; 314 misses among 606 outer side/belt contact samples; and 189 misses among 244 sunroof glass-edge samples. Windshield/backlight coverage already passed the baseline contact test; their R10 change addresses section form and corner continuity.

The [current seal audit](../artifacts/window-seal-audit.json) records all final-source results, including an additional 32 sunroof-clearance samples and an open-centre check. [Focused verification](../artifacts/window-seal-verification.json) also checks shared exterior/sunroof geometry and the sixteen selected nominal body dimensions. [Browser notes](../artifacts/browser-verification-notes.md) and [visual findings](../artifacts/visual-review-findings.md) identify completed runs and actually inspected captures.

The original pre-R10 source is preserved in `preserved/2026-09-26T21-12-49.971Z-dd9c7519-before-r10-window-seal-correction`. Intermediate renders and the interrupted pre-finish main-app check remain preserved; they are not final passing evidence.

## Review

Open [Body review](http://localhost:5185/body-review.html) and choose Driver window, Passenger window, Window corner, Windshield seals, Rear-window seal or Sunroof seal. The Side glass and Roof panel controls expose the seals with the panes lowered/removed. Main-app configuration retains its existing controls.

Seal cross sections, local widths, rubber compression, water management and factory tooling remain reconstructed. Visible cabin/structural trim is still simplified. This correction does not assert exact physical sealing performance, complete hidden hardware or owner acceptance.
