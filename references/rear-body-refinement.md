# Rear-body refinement — September 18, 2026

The owner identified the engine lid, rear glass, C-pillars, taillights and remaining angular body lines as inaccurate. The four supplied views were compared with the model, especially IMG_5460 for the small sail applique / painted C-pillar relationship and IMG_5461 for the rear window and lamps.

## Evidence

- [1985 Pontiac Fiero brochure](https://xr793.com/wp-content/uploads/2018/10/1985-Pontiac-Fiero-Cdn.pdf), PDF page 3: SE notchback body and carrier arrangement.
- [GM 22P catalog](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_P22.pdf), printed H-8: distinct roof clip, sail appliques and body panels; H-7: carrier; G-19: rear fascia. This is a mixed-year catalog. Its generic body explosion is not used as evidence that a flat earlier decklid is the correct 1985 contour.
- [1985 DIY manual](https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf), printed 3-2: overall SE dimensions, wheelbase and track; 1-4 through 1-6: structure and panel relationships.
- Owner-supplied four-angle references: appearance only, retained outside runtime assets.

## Geometry changes

- Extended the rear roof header and recessed a smaller, rounded backlight beneath it. Moved the optional defroster to the rear-glass assembly.
- Separated the small framed opaque sail appliques from the broad painted C-pillars. Closed the inner pillar / glass reveals and matched the pillar roots to the curved quarter-panel shoulder.
- Replaced the flat engine lid with a raised forward center and a wider rear trunk section. Added two separate selectable louvred vent grilles with open spaces between their blades.
- Reduced the taillight panel from approximately 1.557 × 0.153 m to 1.496 × 0.128 m in the reconstruction's horizontal / vertical coordinates; resized the paired lenses, reverse sections and optical grids together. These are model controls, not verified replacement-part dimensions.
- Coordinated fender / fascia shoulder sections, broadened the front corner sweep and increased the hood and upper-door crown.
- Shortened the carrier's longitudinal strips to clear the raised deck center. Preview mounting details remain approximate.
- Added six assembly IDs: rear clip, rear glass, left/right sail appliques and left/right deck vents. Existing IDs remain stable; the current total is 63.

## Review limits

The full vehicle remains mesh geometry with physical materials. Photographs are used only to compare appearance. The broad exterior envelope is anchored to factory data; the local curves are inferred from perspective references, not measured tooling, scans or factory CAD. The reduced glass and lamp sizes require owner visual review and do not establish service or replacement dimensions. Exploded offsets are illustrative, not verified removal paths.

`scripts/rear-body-review.mjs` captures rear, close rear, side, perspective and top views, recording browser errors and separate assembly bounds. Browser interaction results are recorded in `artifacts/UAT-readiness.md`.

## Roof and lower-tail follow-up

Following the owner's next review, the front was retained and the rear roof / tail were refined again:

- Removed the second crown in the rear roof extension. Its surface now continues the main roof's descending tangent into a lower, shorter rear header. The shared seam has matching positions; a numerical surface check verifies that the extension never rises toward the rear.
- Reduced the rearward span and outward bulge of the painted C-pillars, while preserving the small sail-applique footprint. The shortened pillars still meet the quarter-panel shoulders and connect to the recessed glass reveals.
- Added a shallow upward sweep behind the rear wheels, shared between the quarter skins and rear fascia. Raised the rear black pads and associated recesses / license area together.
- Enlarged the four exhaust tips and replaced flat end representations with hollow sleeves, recessed dark bores and rolled chrome lips.

The roof, pillar, pad and exhaust dimensions remain inferred appearance controls. The user-supplied rear-quarter and side photographs and the previously cited factory references guide this pass; no measured exhaust diameter or aerodynamic performance is claimed. `node scripts/rear-body-review.mjs --roof-tail` saves this revision's views separately from the preceding pass.
