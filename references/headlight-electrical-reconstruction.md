# Early headlamp electrical construction — September 23, 2026

The headlight catalog now has **189 selections / grouped sets**, up from 118. The 71 additions are native geometry: three nested relay assemblies, individual terminal blades, motor conductors and disconnects, protective hardware, separate harness outputs and fusible-link construction. This is expanded coverage, not a complete physical bill of materials or dimensional certification.

## Sources actually inspected

- [Pontiac 1986 factory service manual, PDF 994 / 8A-102-0](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=994): original adjacent-year headlight-door circuit, inspected directly from `1986-service.pdf`. Establishes two actuator relays, the isolation relay, conductor colors, contact functions, diodes, motor endpoint switches, motor circuit breakers and independent C/D feeds.
- [Same manual, PDF 995 / 8A-102-1](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=995): component-location table. C/D are in the front lighting harness inboard of the brake master cylinder. The rear battery-junction link is B, not C/D.
- [Same manual, PDF 1047 / 8A-201-9 figure D](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=1047): front-harness location drawing, inspected directly. Figure E locates the isolation relay near the LH headlamp.
- [GM 22P, PDF 69–70](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=69): early 1984–86 motor architecture and original application, distinct from the later electronic module.
- [1985 Pontiac DIY, PDF 37–39](https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=37): the single-cavity black connector on the blue wire and the sealed-beam replacement sequence. The guide now highlights the separate disconnect geometry.
- [Headlamp-motor scan indexed under 1985](https://charm.li/Pontiac/1985/Fiero%20V6-173%202.8L/Repair%20and%20Diagnosis/Diagrams/Electrical%20Diagrams/Lighting%20and%20Horns/Headlamp/Headlamp%20Motor/): directly inspected local image; corresponding connection labels agree with the 1986 original. Its cropped image lacks the printed edition page, so the runtime retains the year qualification.

The latest web search also found reproduction-relay manufacturers and licensed printed 1985 manuals. A replacement relay's potted enclosure is not evidence of original internal tooling, and retailer product dimensions may include packaging. Neither was used as factory CAD. No paid material was purchased.

## What changed

Each actuator relay has a hollow cover, insulating base with open blade slots, coil bobbin and winding, magnetic core/yoke, armature and return spring, linked contact set, suppression diode, five individual blades, two distinct plug shells, open female contacts/crimps, latches and feed/control/ground leads. The isolation relay has six blades, two three-cavity shells and the additional control-steering diode. Shell removal and explosion illustrate construction; they are not validated servicing sequences for the sealed relay.

| Assembly | Schematic connector | Conductor / function |
| --- | --- | --- |
| Each actuator relay | C1 A / internal 3 | Red 2, independent battery feed |
| Each actuator relay | C1 B / internal 2 | Pink 113, coil control |
| Each actuator relay | C1 C / internal 1 | Black 150, ground |
| Each actuator relay | C2 A / internal 6 | Gray motor conductor |
| Each actuator relay | C2 B / internal 5 | Green motor conductor |
| Isolation relay | C1 A / internal 3 | White 103 from switch F / C100 J6 |
| Isolation relay | C1 B / internal 2 | Yellow 10 from switch D / C100 J9 |
| Isolation relay | C1 C / internal 1 | Black 150, ground |
| Isolation relay | C2 A / internal 6 | Pink 113 to both actuator coils |
| Isolation relay | C2 B / internal 5 | Dark blue/white 104 to RH C102 |
| Isolation relay | C2 C / internal 4 | Dark blue 110 to LH C101 |

These are schematic identities, **not a connector-face layout for probing**. Physical cavity orientation, terminal series and connector tooling are reconstructed.

The motor side now has separate white, green and gray conductors. White connects through C101/C102 to the blue or blue/white harness lead; it is not modeled as blue all the way into the motor. The one-cavity disconnect shells/contacts, lead grommets, short protective sleeve and illustrative motor breaker are separately selectable. Long output branches belong to the harness scope so they do not dominate the close relay view.

Each C/D link has separate insulation, copper conductor, end splices/sleeves and feed branch. The adjacent-year schematic's .35 mm² annotation sets the illustrated conductor cross-section. It does not establish replacement wire, original length, insulation diameter or complete 1985 bulkhead routing. The model places both links in the LH front harness, rather than confusing them with rear-junction link B.

## Checks and remaining work

`audit-headlight-electrical.mjs` checks the 16 terminal identities, 16 open connector/base cavities, hollow covers, containment of relay internals, motor conductor materials, blue/white stripe and front-harness/LHD placement. `audit-headlights.mjs` checks nonempty finite geometry, picking IDs, closed-hood clearance and the existing reconstructed linkage sweep. Browser tests exercise all three nested relay scopes, individual blade isolation, C/D inspection and the guide's new disconnect target. See the current [acceptance report](../artifacts/acceptance-status.json) for source-matched results.

Original case dimensions, terminal tooling, coil turns/resistance, diode ratings, contact travel, gear tooth profiles, full harness topology/lengths/clips, motor operating stops, aiming calibration and full diagnostic procedures remain unverified. No checklist requirement is closed merely by adding selectable geometry.

The reproduced [Pontiac bulletin 86-8-23, December 1986](https://workshop-manuals.com/pontiac/fiero/v6-173_2.8l/relays_and_modules/relays_and_modules_lighting_and_horns/headlamp_motor_relay/component_information/technical_service_bulletins/headlamp_door_motor_relays_correct_mounting/) explicitly applies to 1984–86 Fiero actuator relays. Its text calls for firm attachment and wires exiting downward to limit water entry. The modeled actuator orientation agrees with that instruction. The bulletin's additional taping instruction names Firebird; it has not been generalized to this Fiero. This cross-check establishes installation orientation, not bracket dimensions or original internal construction.

Hardware-rendered close-ups exposed a gap below the initial crimp tails. A continuous stamped spine now joins both crimp zones to each receptacle. The electrical geometry audit samples that spine on all 16 contacts; corrected contact, coil and relay images were inspected in native Windows Edge / Intel UHD Direct3D11. This fixes a construction defect and does not certify original connector tooling.
