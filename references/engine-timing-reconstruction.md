# L44 timing-drive and follower correction

September 24, 2026 UTC (September 23 local workshop date).

The previous shaft meshes measured 131 mm between crank and cam axes. The engine now uses the **159.03 mm production-family nominal** shown in GM's [Chevrolet 60-degree V6 Power Manual, figure 11, printed 3-5 / PDF 6](https://fieroinfo.com/manuals/Chevrolet_60V6_Power_Manual.pdf#page=6). The downloaded `chevrolet-60v6-power.pdf` drawing was rendered and inspected directly. This is a family blueprint, not full original L44 casting CAD.

The coordinated change covers shaft/lobes, four journals and annular bearings, locating nose, sprockets, pin-connected chain plates, guide, open-backed cover, matching flange gasket, twelve flat tappets, twelve pushrods and six paired pushrod guides. The shared installed-engine builder receives these same surfaces without nonuniform scaling. The crank axis, accessory pulley and water-pump datums remain fixed.

GM [22P H-19, PDF 14](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_P22.pdf#page=14) establishes component relationships. The adjacent-year [1986 service manual 6A2-20, figure 19/20, PDF 337](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=337) was inspected in the local scan: sprocket web, three mounting bolts, locating dowel relationship and chain layout. Local bolt-circle, hole and shell dimensions remain reconstructed. Do not infer a timing-setting procedure or original 1985 tolerance from the display pose.

The old two sets of 32 repeated blocks are replaced by 40/20 tooth outlines. Those quantities follow previously inspected Melling S506/S511 replacement specifications in [the lookup record](timing-replacement-followup.json). They restore a 2:1 tooth-count relationship. The old 2015 Melling catalog download still returned HTTP 404 in this pass; original 1985 VIN-9 application equivalence is **not** established. The current manufacturer Y/M/M lookup was followed through its official page to `melling.mypartfinder.com`; the provider returned HTTP 403 to this lookup attempt. No application claim was inferred from that blocked response. Melling's current [chain identification chart](https://melling.com/wp-content/uploads/2025/05/Stock-Replacement-Timing-Chain-Identification-Chart.pdf) does not list 373, so it cannot close the missing chain-specific evidence.

The chain uses 64 reconstructed connected plate/pin units along analytic external tangents and circular wraps. It is not a solved silent-chain plate stack, pitch, slack or tooth-engagement simulation. The cover has a front seal aperture, a rear cavity and a matching gasket seated against its rear flange. The roof envelope was expanded after actual mesh rays found the relocated chain crossing it; this proves local model containment, not a measured production casting.

Each flat tappet is placed on the support plane of its own reconstructed cam lobe. Pushrods connect the lifter seats to the retained rocker sockets; fork slots follow their actual sloping paths. Lobe phases, axial stations, lifter sizes, hydraulic internals, preload and working valve lift are not supplied by this model. Journal and lobe envelopes were revised when review found lobes too large to pass through the previous bearing bores. The resulting insertion envelope is checked but is not a machining specification.

## Executable checks

`node scripts/audit-engine-timing.mjs` measures actual mesh shaft-end circles, concentric bearings/sprocket, bearing/journal surfaces, every chain-vertex cross-section against the open cover, gasket seating, twelve cam/tappet contacts, twelve pushrod/lifter connections, 96 guide-fork clearance probes, axial journal/lobe separation, cam insertion envelope and both sprocket tooth counts. See [the current report](../artifacts/engine-timing-audit.json).

Remaining work includes original dimensions/materials, oil passages and bearing holes, crank keyway, locating-dowel detail, complete fastener/retainer breakdown, silent-chain construction, lifter internals, full casting interference and documented 1985 procedures. No requirement is marked complete solely because these checks pass.
