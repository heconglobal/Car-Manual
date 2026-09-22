# Early suspension and manual steering

The explorer adds 216 selectable parts or grouped sets for the owner-confirmed 1985 SE / V6 / four-speed / WS6 configuration. It replaces the earlier vehicle suspension proxies with shared component geometry. Hubs, knuckles and brakes remain in the Brake explorer; their coordinates are used as connection references here.

## Inspected factory sources

[GM 22P parts CD](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf):

- PDF 193–194: 1984–87 front suspension and application table. Callout 17 distinguishes 1984 lower arms from 1985–87. Callout 2 identifies a 23 mm front stabilizer. Upper/lower pivot bushings, upper joint rivets, separate shock, coil insulator, jounce bumper, crossmember and braces inform the model.
- PDF 197–198: manual rack/pinion. The table distinguishes 1985 WS6 and non-WS6 pinions. Rack bar, pinion bearing/seal/ring, support bearing, adjuster spring/plug/locknut, passenger-end bushing, inner/outer tie rods, separate bellows, mounting grommets and steering damper are represented. Tooth counts and exact ratio are not inferred from the drawing.
- PDF 219–221: early rear suspension. The spring/strut stack, toe link, lower arm, cradle bushings/cushions/spacers and retaining hardware follow the illustrated architecture. The 1985–87 V6 strut reinforcement is distinguished from the 1984 listing. The 1988 multi-link rear suspension and rear stabilizer are not imported.
- PDF 189: 1984–85 wheel applications was inspected as a future wheel-detail source. This increment does not assert measured wheel-face accuracy.

[1986 Pontiac service manual](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf), adjacent-year geometry evidence:

- PDF 168–170, printed 3B2-2–4: rack assembly, tie-rod/bellows arrangement and the steering damper on the passenger half.
- PDF 192, printed 3C-4: front coil, stabilizer links and the separate shock outside the coil. This corrects the prior generic coil-over representation.
- PDF 198 and 201, printed 3D-2 / 3D-5: early rear cradle and toe links; strut body, seats, insulators, dust shield, jounce bumper, upper mount and reinforcement stack.

These pages support relationships and shapes, not blanket 1985 service-value or part-interchange certification. No adjacent-year torque values were published in the app.

## Implementation and remaining limits

Control arms have open stamped webs, raised flanges, strengthening swages and hollow bushing eyes. Ball-joint housings, studs, boots and retaining hardware are separate selections; their illustrative interiors do not imply a sealed factory joint is intended for rebuilding. Upper front studs point down toward the steering knuckle, while lower studs point upward. Front shocks are outside the coil envelopes. The early rear strut contains 19 selections per corner.

The rack is hollow with separate rack bar and pinion, bearing/seal/retainer, end bushing and adjuster. The damper, adapter and passenger bellows support are asymmetric. Final world coordinates remain -X left/driver, +X right/passenger. Front steering arms in the brake knuckles were redirected toward the forward rack to correct an earlier connection mismatch.

The nominal 23 mm stabilizer diameter is factory referenced. Spring wire sizes, loaded shapes, rates, spring codes, pivot coordinates, caster/camber/toe, frame stampings, knuckle interfaces, tooth geometry, rack ratio, dampers and manufacturing finishes remain reconstructed or unverified. Original options require RPO/build evidence beyond VIN and WS6. Suspension movement, collision clearance and repair removal paths are not simulated or validated.

Geometry audits and browser/render reviews are recorded in `artifacts/UAT-readiness.md`. A passing interaction test is not factory dimensional certification.
