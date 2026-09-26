# Lifter and water-pump development inspection

Sixteen native Windows Edge captures of source `384321b7a77e6ee906c6132c53274724dbc755ea030d4d2121df3cdec45efe9e` were opened and inspected. See the hashed [visual manifest](visual-inspection-manifest.json) and [hardware capture record](native-windows-internals-review.json). The renderer used Intel UHD graphics through ANGLE/D3D11; initial readiness was 23.1 seconds on this workstation. No application exceptions were recorded. This is a bounded development review, not a complete hardware regression or final photorealistic acceptance.

The nine-piece lifter scope assembles into a continuous body and separates along its inclined axis. Small springs, check ball and retaining cage remain individually selectable. Focused views show the body/plunger radial opening; the top view shows the concave pushrod seat and its central passage. The explosion is intentionally spacious; tiny pieces require selection and focus. Original machining dimensions, cage profile and operating calibration remain unverified.

The pump scope shows ten selectable units/sets. The new hub, shaft/bearing, seal and impeller separate from the body and pulley. A driver-side impeller view exposes the curved vanes and open shaft bore. The default perspective views its back face, so orbiting is needed to see the vane side. The illustrated six-vane count and all original internal supplier details remain unverified. Bearing and seal are still grouped units.

Review prompted corrections to lifter edge normals and hub rim/face shading. The final hub face is planar under the studio reflections; its rim and bolt bores no longer show the earlier coarse faceting. Small remaining surface and finish differences are not accepted as original tooling. The whole-vehicle capture preserves the prior exterior and US LHD layout; it does not revalidate every panel profile.

Earlier images and an interrupted preliminary capture were retained separately. A smoothing routine initially used a hash scale unsuitable for tiny metre-sized parts; it now calculates in millimetres before returning to metre geometry. The browser run interrupted for the final hub correction is historical, not passing evidence.

The current Chromium/SwiftShader mobile dipstick capture was also opened and inspected: the short-screen layout has no horizontal overflow, controls and inspector remain reachable, and the exploded geometry is visible. This adds one software-rendered mobile image to the sixteen native desktop views; it is not mobile-hardware performance evidence.
