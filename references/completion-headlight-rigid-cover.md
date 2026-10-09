# Rigid headlight cover correction — October 1, 2026

The previous closed cover followed the curved hood, but its raised endpoint used a separately authored straight surface. Its filler offsets and hinge arm endpoints also changed between states. That changed the apparent construction of the same cover even though the bucket used a consistent linkage.

The cover now begins with the unchanged closed hood surface and rotates rigidly about the existing independent cover-hinge axis. Underside ribs, pads, fasteners and hinge arms use the same transform. The reconstructed rotation is 0.62 radians from the closed surface; the former 0.305 parameter described the independently drawn final slope. This is a consistency correction, not a newly discovered factory stop angle. The raised silhouette remains below 870 mm in the authored frame.

An initial 0.48-radian reconstruction retained too little clearance: an opened diagnostic image showed bezel and aiming hardware protruding through the painted lid. That version and its diagnostic images were preserved. The corrected endpoint clears the actual raised lamp/bucket/bezel/aim vertices by at least 5 mm; this software packaging margin is not a sourced factory clearance.

`scripts/audit-completion-headlight-cover.mjs` checks 1,001 poses per side, 25 surface points per pose, all point-pair distances, local underside depth, stationary hinge points and the existing bucket-link lengths. It additionally compares actual raised hardware vertices with the underside of the cover and ray-checks each part's critical point against the generated cover triangles. It writes a new dated evidence folder for each run. The existing geometry and browser headlight audits still need to pass against the final source.

Primary construction evidence remains the original 1985 Pontiac DIY guide, PDF 37–38, which identifies an independent spring-loaded headlamp cover. No source was found here establishing the original pivot coordinates, production stop angle or contact loading. Full cover/bucket contact, spring force, motor stops, source-exact 1985 circuitry, physical dimensions and owner acceptance remain open.
