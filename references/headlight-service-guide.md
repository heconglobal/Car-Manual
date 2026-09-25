# Headlamp replacement guide evidence

Original source inspected locally: `1985-fiero-diy.pdf`, PDF 37–39, printed 2-28–2-30. [Pontiac factory DIY scan](https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=37).

The nine UI stages condense the 19 numbered factory steps while retaining the order of electrical isolation, access, removal, refitting and motor reactivation. The UI distinguishes the blue motor connector from the three-cavity lamp socket, bezel screws from the four retainer screws, and both from the untouched aiming adjusters. It does not instruct users to open the sealed lamp envelope. The factory's 8 N·m / 6 lb·ft value is applied only to the four bezel screws, not the aiming or retainer screws.

Critical order cross-check: with the unit raised, disconnect the blue lead before turning lamps off; disconnect the lamp socket before mechanical work. At completion, reconnect the lamp socket while the blue connector remains disconnected, turn lights on, reconnect blue, turn lights off and verify that both units retract.

Tools and the warning about powerful electrically operated mechanisms come from printed 2-28. Printed 2-29 supplies the spring release, counterclockwise release from adjuster tabs and two-piece retainer. Printed 2-30 supplies tab seating, bezel fastening and reconnect order. No aiming procedure, motor rebuild procedure, measured removal path or electrical diagnostic is inferred from these pages.

`src/service-guides.js` contains the source-linked stages. `tests/service-guides.spec.js` checks part navigation, backwards/jump navigation, correct final ordering, desktop/mobile layout and restoration of the prior vehicle or detail view. Its existence is not a claim that it has passed; consult the current execution report.

The viewer keeps the assembly together and highlights each referenced part. Its generic explode control remains a construction view, not the procedure's actual removal sequence. Physical workshop validation remains outstanding.

The expanded browser regression passed on the corrected guide implementation at the run begun 2026-09-22T06:48:25.060Z. It covers isolated spring inspection, preservation of the factory reconnection sequence, return from vehicle/detail scopes, cross-scope part selection, temporary-pose persistence and home navigation cleanup. The raw report is archived with its exact source manifest. A subsequent full build adds distribution notices and normalizes mobile screenshot scroll position; its regression is recorded separately.

September 23: the deactivate/reconnect steps now select `hl-left-disconnect`, the separate C101 plug pair. The former `hl-left-motor-leads` selection now represents only the protective loom sleeve. The browser guide scenario checks isolation of the actual disconnect before continuing the original factory sequence.
