# Body R12 — exterior reassessment

The owner rejected R11's exterior. The current target remains the **1985 Pontiac Fiero SE 2M6, non-aero notchback**, with ribbed moldings and the bumper-pad fascias. This pass corrects visible construction and fit errors that the earlier envelope checks did not detect. It does not certify an exact factory surface model.

## Evidence used

- Original Pontiac 1985 full-line catalog, [p12 body photographs](pontiac-1985-full-line-12-r11.jpg) and [p13 frame/panel photographs](pontiac-1985-full-line-13-r11.jpg), preserved from the [Crittenden Automotive Library](https://www.carsandracingstuff.com/library/p/pontiac_85pontiac.php). These establish the non-aero body, slender window surrounds, sail applique and ribbed molding relationships.
- [Pontiac 1985 MVMA specifications](1985-86-specifications.pdf#page=22), PDF22–23 and lamp datums PDF26. Published anchors remain distinct from interpolated panel contours and the estimated curb/design load conversion.
- [GM parts catalog](fiero-parts-cd.pdf#page=336), PDF336–338: 1985–88 P37 body and trim application. PDF338 identifies the **1985 2.8 litre non-WU2 rear fascia as 10033958**; the four-cylinder and aero fascias are separate applications. The 1987 mounting-hole note is not a 1985 measured dimension.
- [Pontiac production packaging profile](../artifacts/body-reference-r7/production-profile-detail.png), from Performance Plus printed p46, and the [1984 GM CAD silhouette](gm-1984-cad-profile-r11.png). These support overall profile/rake comparisons, not exact 1985 V6 fascia tooling. The 1984 central deck vent is excluded.
- [Installed 1985 notchback grilles](1985-gt-original-engine-bay-r12.jpg), an original vehicle photograph from [RK Motors](https://www.rkmotors.com/vehicles/4297/1985-pontiac-fiero-gt), and a [removed original P37 grille](notchback-vent-original-r12.jpg), photographed for [listing 117049865486](https://www.ebay.com/itm/117049865486). The installed photograph resolves orientation: **transverse inclined vanes and two rear captive fasteners**. The GT photograph is used for the shared notchback grille construction, not SE bumper shape.
- The owner's three photographs remain the primary evidence for the pictured car's visible configuration. Additional photographed cars are comparisons, not original-application certification.
- A [reproduction supplier's description](https://fierogear.com/shop/windshield-molding-trim-seal-lock-strip-1-2/) distinguishes its wider replacement from an approximately 5/16-inch original windshield reveal. The reconstructed visible lip is approximately 8 mm; this is not a GM extrusion drawing or a water-sealing test.

The Hagerty car photographed in `hagerty-1985-se-*-r12.jpg` visibly has a side body kit, painted bumper pads, different wheels and other modifications. **Its lower body panels and front intake are excluded as factory templates.** Its unchanged window relationships only supplement the factory photographs. The secondary marketplace rear photo is a qualitative comparison only.

## Corrections

| Area | Defect found | R12 change |
| --- | --- | --- |
| Roof/window surrounds | Steel roof channels extended up to about 25 mm above the painted roof; clear-pane tests missed this. | Channels now sit below the roof. Steel A-pillars follow the actual sloping painted lands rather than a constant upward offset. |
| Seals and corners | Excess windshield reveal and a projecting upper glass-stop edge compounded the visible frame interference. | Slimmer windshield reveal, recessed stop support and unchanged continuous side/belt contact paths. The window and sunroof options retain their separate seals. |
| Engine-deck grilles | Shallow box bars, round perimeter rods, narrow openings, no perforated screen and wrongly placed hardware. | Wider matched lid/vent boundaries, flat cast frames, fourteen inclined transverse vanes per side, perforated screens and rear captive hardware. The lid's inner reinforcement follows the narrower raised centre. |
| Side moldings | Fixed strip ends left long bare-panel gaps beside the wheel openings. Small rib relief read as a thin line. | All ends follow the actual arch intersection across the molding's full height. A 28 mm reconstructed ribbed section, separated grooves and satin finish continue into the fascia returns. |
| Rear end | Broad plan-view rounding, a swollen impact face and bright sightlines through fascia joints obscured the distinct rear lines. | Tighter corner returns, a flatter impact region, defined bridge/return transitions and recessed joint backing. The upper lamp-panel rake and rising lower quarter remain tied to the earlier published-profile comparison. |
| Rear lamps | Strong independent prism highlights made the unlit lamps look like exposed checkerboards. | Reflection is concentrated on the continuous outer cover; darker inner optics have subtler ribs. Original bulb anchors and separate chambers remain. |
| Adjacent exterior fit | Parked wipers used unrelated coordinates after windshield changes; sail insert occupied too little of its painted pillar. | Blades now follow the shared windshield surface. Enlarged sail appliques retain the notchback triangular outline. |

During development, the loose grille's orientation was initially misread. The installed 1985 photograph corrected it before final verification. Interim captures and the earlier audit are preserved; they are not final appearance evidence.

## Verification and limits

The new [exterior reassessment audit](../artifacts/exterior-reassessment-audit.json) tests actual steel concealment, molding coverage at every arch end, inclined grille faces and perforated screens. It is also run against preserved R11 geometry. Existing dimension, clear-pane/contact, front/rear interface, shared vehicle/detail and exterior inventory checks remain separate.

The final source passes nine focused geometry audits and two focused browser scenarios; sixteen captures were opened and hash-recorded. The visible-parts inventory checks 84 entries without claiming an exhaustive physical bill of materials. The production build passes. Full-suite browser results were not refreshed.

Two earlier audit failures came from comparing whole-part bounding boxes at unrelated stations. The revised intake test measures 41 matching longitudinal sections and retains its original 8 mm clearance requirement: the actual minimum is 13.483 mm, while the misleading whole-part difference was 6.755 mm. The wing test now compares its face with the deck directly beneath it at nine positions, retaining the original 70 mm requirement; it no longer compares the rear wing with the raised forward engine hump. These changes do not relax local clearance thresholds.

The complete exterior is reviewed in front/rear quarters, side and rear elevations, plan view, hood/nose, rear bumper, glazing and grille close-ups, plus a neutral-material view and glass-removed states. Current results and source hashes are recorded in [the development review](../artifacts/current-UAT.md); interrupted runs do not count as passing browser scenarios.

Published nominal dimensions are anchors, not enough information to reconstruct every panel. No GM surface-coordinate set, original window-seal extrusion drawings, dimensioned grille casting or exact rear-fascia section has been obtained. Local dimensions, radii and hidden hardware remain reconstructed. Full factory dimensional acceptance, physical operation and owner approval stay open.
