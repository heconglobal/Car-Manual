# 1985 brake reconstruction

Owner configuration: 1985 Fiero SE 2M6, original four-speed, WS6. This increment adds 212 independently selectable parts or grouped sets, in 21 assembly scopes. The complete vehicle shares the new exterior brake geometry. Counts are inspection entries, not a certified bill of materials.

## Evidence actually inspected

- [1985 Pontiac DIY manual, PDF 59 / printed 3-2](https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=59): nominal disc diameter 9.72 inches at both ends, nominal front thickness 0.43 inches and rear thickness 0.50 inches. The actual friction-band geometry uses these dimensions. These are not discard or machining limits.
- [GM 22P parts CD](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf): PDF 166–167 tandem booster and application table; 170 composite master; 171 front integral rotor/hub and tapered wheel bearings; 172 rear separate rotor/hub unit; 177–178 1984–85 brake plumbing and pedal; 182 three-cable parking brake. Application tables were checked rather than assuming the illustrated year covers every model.
- [Actual 1985 Pontiac service page 5-27 / figure 5-42](https://cdn11.bigcommerce.com/s-ragx7opcj4/content/files/1985-pontiac-fiero-service-manual-sample1.jpg?t=1663030449): rear caliper piston, seals, actuator, balance spring, thrust washer, check valve, outside lever and return spring. This is a public sample of the licensed factory-manual reprint, hosted by The Motor Bookstore. The sample is stored only in `references/brakes/`.
- [1986 Pontiac service manual](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf): PDF 235–238 pipe/hose and parking-cable layout; 241–244 master internals; 245 front caliper figure with callouts 1–13; 252–256 rear caliper details; 259–264 tandem booster; 265 dimensions. This is explicitly adjacent-year evidence. It does not establish 1985 machining limits, torque values, original casting dimensions or complete interchangeability.

The 1986 table differs from the 1985 DIY nominal front disc thickness. The app uses the directly inspected 1985 nominal values and does not mix in the adjacent-year service limits. The 1986 49 mm front / 48 mm rear piston bores and 200 mm booster envelope inform reconstruction only; they have not been independently certified for this particular 1985 car.

## Geometry and relationships

Four distinct corners have solid early rotors, calipers, pads, sliders and upward bleeders. The front uses integral rotor/hubs with separately selectable tapered bearing cones/cups, seal, keyed washer, castellated nut, cotter and cap. The rear uses separate disc hats, sealed hub units, carriers and the mechanical parking actuator. No 1988 vented brake parts were introduced.

The master includes an open stepped body, divided reservoir, diaphragm, grommets, pistons, seals and return spring. The tandem booster has separate shells, two diaphragms/supports, divider, valve/reaction components, rods, springs and check valve. An optional vacuum switch shown in the catalog is omitted pending evidence of fitment.

Hard pipes, four distinct flexible hoses, banjo/washer sets, clips, vacuum supply, three parking cables and equalizer are modeled. The pedal, switch and input-rod attachment are independently selectable. Final world coordinates remain -X driver/left, +X passenger/right, -Z nose, +Z rear; the legacy builders convert once at their model boundary.

## Limits and remaining work

Casting contours, exact bolt seats, pad profiles, local mounting coordinates, tube bends and factory finishes are reconstructed. Rear piston clutch internals and sealed-hub internals remain grouped; combination-valve calibration and booster operation are not simulated. The rear actuator helix is illustrative; left/right internal screw details need direct confirmation. Hose travel and repair removal paths are not collision validated. No new repair sequence or unverified torque was published.

Factory drawings identify the components but are not measured CAD. Automated tests validate identities, nominal disc bands and interaction behavior; they do not certify factory tolerances or photorealism. Render review and test results are recorded separately in `artifacts/UAT-readiness.md`.
