# Roof, side skins, wheels and raised lamps

September 17, 2026. Follow-up to the owner's visual review of the pillar/roof area, side-panel convexity, rockers, wheels, rear wing and excessive raised-headlamp height.

## Evidence

- [1985 Pontiac Fiero brochure](https://xr793.com/wp-content/uploads/2018/10/1985-Pontiac-Fiero-Cdn.pdf), PDF pages 2–3: notchback roof and sail layout, window openings, Hi-Tech wheel faces, SE side skins and the optional pedestal wing. The GT's aero fascias and ground effects are not applied to this 1985 SE.
- [1985 factory DIY manual](https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf), printed 2-28/2-29: raised lamp cover, bezel and sealed-beam arrangement; printed 3-3: 14 × 6 aluminium wheel specification and wheel appearance.
- [GM Pontiac 22P catalog](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_P22.pdf), printed H-8: formed roof, rear clip, separate quarter-window/sail applique, door skin and sill panel layout; G-10: pedestal-wing outline; K-17/K-18: headlamp assembly and year-specific actuator applicability. The catalog covers several years; its illustration does not prove every pictured option was fitted to this VIN.
- [1985 SE owner-sale gallery](https://davidsclassiccars.com/pontiac/465757-1985-pontiac-fiero-se-v-6.html): supplementary full-side and oblique shape comparison, cross-checked against the factory publications. Seller-reported repaint means this is appearance evidence, not a factory build record.

- Owner-provided appearance references: `/home/hesh913/.codex/tmp/IMG_5459.jpg`, `IMG_5460.jpg`, `IMG_5461.jpg`, `IMG_5462.jpg` (reviewed September 17, 2026). The close rear-quarter view clarifies the smaller triangular dark insert, broad painted sail, rounded rear-window surround, belt-line handle position and wheel slots. The other angles clarify the carrier and raised-lamp silhouette. These images guide geometry; they do not independently establish VIN-specific equipment or measured dimensions.

All photographs remain reference material outside the delivered app. The vehicle, wheel windows, glass, lamp lenses and body contours are rendered meshes.

## Implemented geometry

- Used the supplied close view to reduce the dark sail insert, broaden the painted sail behind it, round the windshield/backlight corners, move the handles to the belt line and recess the wheel lugs into the spoke windows. Widened and closed the carrier end returns to better match its visible proportions.
- Replaced round A-pillar rods with curved, broad skin sections. Shared the side-window opening with the A-post and rolled roof shoulder; rounded the front/rear roof headers and roof crown.
- Sloped the rear edge of the door glass into the B-pillar applique. Rebuilt the notchback sail/buttress surfaces and recessed backlight relationship, with a separate curved dark sail insert. The visible sail is not represented as a separate structural C-pillar tube.
- Increased door-skin crown and lower inward taper. Used smooth height-based fender cross-sections to avoid pinching around the arch. Repositioned moldings, the fuel-door outline and the side intake onto those surfaces.
- Replaced rectangular rocker bars with rolled outer faces and an inward lower return. Kept the non-aero SE sill appearance.
- Rebuilt the 14-inch Hi-Tech wheel with five broad spokes, parallel fins, actual open windows, a dished face, stepped rim/barrel, center cap and recessed five-lug pattern. Wheel finish previews remain available; tire sizing and axle locations are retained.
- Reduced raised cover angle from 0.72 to 0.46 radians and lowered the lamp center by 55 mm in the reconstruction. Moved the lamp forward under the cover edge and reshaped its cheeks/linkage. The sealed-beam face dimensions and closed hood opening remain unchanged. These changes are model-coordinate corrections, not factory adjustment instructions.
- Refined the optional wing's thinner section, molded trailing edge, rounded downturned tips and blade-like tapered pedestal sections. The carrier remains a separate preview option.

## Accuracy limits and review

The publications establish the design and assembly layout. They do not supply production surface coordinates, exact local radii, wing sections or headlamp linkage pivot measurements. Those contours remain reconstructed and must not be labeled measured factory CAD. The VIN and owner-confirmed drivetrain/WS6 record do not establish every appearance option.

`scripts/contour-review.mjs` captures side, rear, roof-top, raised-lamp and wing views and records browser errors and visible bounds in `artifacts/contour-review.json`. Configuration regression verifies raised-lamp clearance, roof choices, wing preview, persistence and the unchanged vehicle identity. Acceptance of visual accuracy remains with the owner's UAT.

`scripts/reference-review.mjs` uses a temporary browser preset (glass roof, carrier, raised lamps and rear defrost) to compare the visible equipment in the supplied images. It captures four views and writes `artifacts/reference-review.json`. This does not change app defaults or assert those options from the VIN. No weathering, pictured decorative graphics or reference-photo texture is applied to the factory-new reconstruction.

Final detail pass: rounded the removable sunroof opening and glass, with painted corner returns and a continuous seal; gave the carrier spoiler closed, thicker edges and solid-sided curved end supports. These are mesh changes visible from above and below.

The final fender crown was calibrated against the documented 1,752 mm body-width target after a sampled mesh-envelope check found the earlier revision approximately 14 mm narrow. The final browser capture records the resulting visible fender bounds; this anchors the overall envelope, not every local surface radius.

The supplied side angle also exposed an overly short rocker trim. Its rolled surface now runs between the front and rear wheel openings, rather than ending at the door seams. The final side/rear check is recorded in `artifacts/reference-sills-final.json`.
