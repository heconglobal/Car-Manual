# Body R6 — 1985 SE rear combination lamps

The owner rejected the R5 tail-light appearance and requested continued factory-dimensional work. The revised geometry remains a reconstruction; the published vehicle/bulb datums below do not supply a complete lamp tooling surface.

## Sources inspected

- [1985 Pontiac MVMA, PDF 26 / printed 24](1985-86-specifications.pdf#page=26): outside tail bulb 678 mm from centerline; rear directional bulb 538 mm from centerline; highest tail bulb 716 mm above ground at curb mass. The existing explicitly estimated curb-to-design-load conversion remains separate from those published values.
- [GM 22P, illustration 2P02-002, PDF 72](fiero-parts-cd.pdf#page=72): original 1984–85 housings 16500453/454, clear outer lenses 16500461/462, separate red inner lenses 16500457/458 and clear reverse insert 16500460. The socket callouts distinguish outer tail (13), stop/turn sockets (14), and reverse (15). Three retaining screws and access caps belong to each assembly. [Public primary scan](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=72).
- [1985 Pontiac DIY, PDF 34 / printed 2-25](1985-fiero-diy.pdf#page=34): inner rectangular optical pattern, rolled outer cover, upper mounting edge and three top-access retaining screws. Its illustration is not a dimensioned lens drawing. [Public primary scan](https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=34).
- [First-hand photographs of an opened original notchback assembly](https://www.ebay.com/itm/126335210305): secondary shape/construction corroboration. The photographed original parts show a smooth outer cover over separate patterned red/clear inserts, three red reflector chambers, one reverse chamber and a blind inboard portion. The seller's broad year-fitment label does not establish wiring functions for every year. Downloaded photographs and factory-page renders are retained under `artifacts/tail-lamp-reference-r6/`; none are used as model textures.
- Owner IMG_5461 remains an assembled-car appearance reference, subordinate to the model-specific published datums.

The search found reseller “item dimensions” of roughly 34 × 6 × 6 inches. These are not dimensioned GM lens/tooling drawings and may include packaging; they are not adopted as exact lens dimensions. No complete dimensioned 1985 SE outer-lens, inner-optic or rear-fascia tooling drawing has been obtained.

## Defects corrected

R5 had a nearly opaque dark outer cover (opacity 0.94), with a coarse black grid placed outside it. That hid the inner colored optics and made the rear resemble a solid grille. Its rectangular cover and triangle-deleted fascia aperture also produced an incorrect perimeter.

R6 separates a smooth, lightly tinted outer cover with a tapered, rounded perimeter/lip from the rectangular optical pattern on the inner inserts. The red insert occupies the outer portion and the wider clear reverse insert occupies the inboard portion. Prism facets and grid bands are native geometry behind the cover. Material values approximate an unlit assembly; they are not measured optical transmission or photometric certification.

The previous housing also omitted one red chamber and bulb/socket pair on each side. R6 models four chambers: outer tail, two stop/turn positions, and an inboard reverse bulb. The outer tail is no longer described as a third 1985 stop lamp. Existing selectable part IDs remain, and the additional inner stop/turn bulbs and sockets are independently selectable. Local inner-stop/reverse positions are reconstructed, not published measurements. Their inferred 140 mm pitch extends the difference between the published 678 and 538 mm centers and is identified as such.

The rear fascia opening is clipped to the curved lamp perimeter; crossing triangles are split and their new vertices reprojected onto the panel. This replaces the old whole-triangle deletion along a rectangular hole. Vehicle and detail explorers use the same builders.

## Verification and remaining dimensional limits

Final source: `8db945773c72a68ebf2a66bbce0de6757274e59a18acb9e50f6a107aa8e25177`. The production build and all 15 aggregate geometry audits pass. The unchanged published body envelope passes 18 selected dimensional comparisons; the expanded rear audit passes 13 groups, with 24 optical samples and 12 lamp-datum rows. These include the missing chamber, clear-cover behavior, inner-optic ownership and fitted aperture. The aperture implementation shares vertices before recomputing normals, avoiding the first iteration’s faceted fascia highlights; its curved-surface clipping unit test passes.

Three targeted browser scenarios pass: the focused lamp review, six complete-car exterior views, and lighting/charging interfaces. Coverage is 3/39 current scenarios, not a complete regression. All ten resulting captures were opened and inspected. See [browser records](../artifacts/browser-verification-notes.md), [visual observations](../artifacts/visual-review-findings.md), [geometry evidence](../artifacts/geometry-verification.json) and [source changes from R5](../artifacts/body-r6-source-review-20260924T222308Z.patch). The live manual was checked to serve BODY R6. Existing files and earlier evidence remain preserved.

Cover width/height, taper, corner radii, grid pitch/depth, reflector sections, seal dimensions, glass/plastic optical properties and fastener locations remain reconstructed. A numerical mesh measurement of those reconstructed values is not a factory measurement. Full-body factory-dimensional and owner visual acceptance remain open.
