# Hydraulic lifter internals — implemented construction view

Researched and implemented September 24, 2026 UTC. Original dimensions and operating calibration are not accepted by this note.

The downloaded adjacent-year GM 1986 service manual was rendered and inspected directly:

- 6A2-16/17, PDF 333–334: the 2.8L V6 lifter section refers inspection/overhaul to General Engine Mechanical, section 6A.
- [6A-20, figure 46, PDF 292](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=292): **flat-tappet** lifter, nine identified entries: body, plunger spring, ball-check retainer, ball-check spring, ball check, plunger, oil-metering valve, pushrod seat and retainer ring.
- The same page's figure 47 is a different **roller-tappet** construction. Do not copy its roller into the original L44 flat-tappet model.

All twelve lifters now have nested nine-selection scopes. Eight new internal selections per lifter add 96 entries. Each remains under its own intake/exhaust valve and physical cylinder identity. Hollow bodies have a closed cam-contact foot, open radial feed, annular oil groove and retaining groove. The plunger has a matching radial feed and a lower check-ball passage. The separate metering disc and concave pushrod seat have open central passages. A split retaining ring and two springs complete the construction view.

Actual-mesh checks in `scripts/audit-engine-internals.mjs` cast rays through the body bore, body/plunger radial openings and seat/disc passages; they check internal containment and ball contact with the inlet edge for every lifter. The existing timing audit checks cam contact, pushrod seating and guide clearance. These are reconstructed static fits, not production tolerances.

Selectable pieces include a reconstructed three-leg check-ball retainer. Its exact cage shape, spring turns, retaining-ring section, finish and all machining dimensions remain unverified. Sharp machined edges and cylindrical surfaces use separate normals so the render does not inflate the ends.

The source establishes general component relationships, not original 1985 L44 machining dimensions or interchangeability. Confirm original-year application before attaching service values. Do not convert the drawing into fabricated spring rates, preload, leak-down times, bore clearances or oil-hole diameters. The manual also warns against rebuilding a lifter with parts mixed from other unserviceable lifters; nested viewer selections must not be presented as a parts-interchange recommendation.
