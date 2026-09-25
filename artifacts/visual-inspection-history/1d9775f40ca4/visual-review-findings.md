# Development visual review — timing correction

Current source: `1d9775f40ca423ba7f27b8d3daad507711fa128b9d9160a10a2bf1e038f70ca7`.

Eleven native Windows Edge / Intel UHD Direct3D11 captures were opened and inspected: whole vehicle, assembled/exploded timing drive, assembled/exploded cabin-bank intake and trunk-bank exhaust valve gear, and isolated camshaft, cam sprocket, chain and timing cover. The [manifest](visual-inspection-manifest.json) records exact file hashes and review times. The capture report recorded zero application exceptions and 48.192 seconds to initial readiness. That time includes this workstation's concurrent test load; it is not a performance target or broad hardware regression.

Observed improvements:

- Four bearing sleeves wrap the larger journals; reconstructed lobes now fit inside the bearing-bore envelope. The earlier oversize-lobe finding was corrected before the current captures.
- The cover is visibly open at the rear, with a separate rear flange gasket and front crank-seal aperture. The chain fits inside the reconstructed cavity; the prior roof collision was corrected.
- Cam sprocket has an open web and three attachment positions; the chain has connected pins and plates, with straight runs and curved wraps instead of disconnected rings.
- Both sampled valve scopes show seated pushrod ends, distinct retainer/seal hardware and usable assembled/exploded views. The intake and exhaust stem-seal variants remain different.
- The whole-car default appearance is retained. No new component image assets were added.

Still open:

- The timing-cover body remains a simplified smooth envelope. Original ribs, bolt bosses, coolant passages, wall sections and surface tooling are not complete.
- Sprocket holes show faceting at close magnification. Original tooth form, edge machining, hub contours, dowel and crank keyway are not verified.
- The chain has a simplified plate/pin layout, not a verified silent-chain plate stack or pitch/tension/engagement simulation.
- Hydraulic lifter interiors remain missing. The next source-backed breakdown is recorded in [the lifter follow-up](../references/lifter-internals-followup.md).
- Static valve gear does not establish preload, cam phase, running motion or all engine casting clearances. The guides are checked geometrically but their production contours are unmeasured.
- These eleven views do not constitute all-part photorealistic acceptance. Earlier broader review and its unresolved findings are preserved in [baseline history](visual-inspection-history/267f7ce33b67/visual-review-findings.md).

The current software-rendered `engine-mobile.png` was also opened and inspected: the timing explosion, controls and inspector fit at 390 px without horizontal overflow. Twelve current-source images are now explicitly recorded, eleven native and one software-rendered.
