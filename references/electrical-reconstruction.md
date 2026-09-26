# Electrical and lighting source / acceptance record

Continuation started 2026-09-22. This records evidence and open acceptance gaps; it does not certify a complete vehicle.

## Primary sources inspected

- GM 22P Parts and Illustrations CD, PDF 69–70, front lamps (2P02-001); PDF 72, **1984–85** rear lamps (2P02-002). PDF 73 is the later 1986–88 PG97 rear assembly and is not used for this SE.
- Pontiac 1985 Do-It-Yourself, PDF 32–36, printed 2-23 through 2-27: marker, front turn, dome/map, compartment, rear combination, console and cluster bulb access.
- Same manual PDF 61, printed 3-4: H6054 headlamp; 2057 park/turn and stop/tail/turn; 1156 reverse; 194 marker/license/cluster; 906 dome; 168 courtesy/front compartment; 561 rear compartment; 70 console; 37 heater/A/C control.
- Same manual PDF 39–40, printed 2-30/31: original maintenance-free Delco Freedom battery; passenger-side location, side terminals, heat shield, hold-down and access cover. Hold-down bolt 18 N·m; cable bolts 12 N·m. These are source values, not yet a validated interactive battery-replacement procedure.
- GM 22P PDF 67: 1984–87 battery tray, retainer, heat shield and cables. The L44 positive cable is catalogued as 35 inches; the L44 negative as 25 inches. Drawings do not specify all bend or clip coordinates.
- GM 22P PDF 56–57: starter service exploded diagram and applications. Notes distinguish service motor 10455023 from motors stamped 1998533/1998503/1998504/1998429. A service replacement number must not be presented as this car's original installed stamping.
- GM 22P PDF 58–59: 1984–87 generator internal architecture; PDF 61: 1985–87 L44 bracket and 66 A / 94 A alternatives. Rating is not decoded from the VIN.
- GM 1986 Service Manual PDF 886 and 992–993: adjacent-year illumination control, headlamp breaker, column-mounted beam dimmer and component locations. This is **not** sufficient to certify 1985 pinouts or wire lengths.

Primary documents: https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf and https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf . Adjacent-year source: https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf .

## Construction changes

Headlight-control additions distinguish the dash light switch, panel dimming wheel / remote transistor and column high/low-beam switch / actuating rod. Contact and connector models remain illustrative.

Lighting replaces previous surface-only rear/front lamp proxies with separate housings, optics, bulbs and sockets. R6 corrects the previous missing red chamber: rear lamps have three 2057 bulbs and an inboard 1156 per side (outer tail plus two stop/turn bulbs in the 1985 arrangement); no later fastback lettering or center high-mounted stop lamp is added. The cabin overhead module has four lamps. Manual ashtray lighting has two bulbs, without an automatic shift-indicator lamp. Optional courtesy/compartment lighting follows the lamp-group preview setting.

Opaque front/rear fascia and bumper-pad surfaces are opened at the lamp apertures. Optical flutes are authored geometry; no photographic stand-ins are served.

## Remaining evidence / acceptance

No source inspected provides measured mold surfaces, all lens prism angles, original wire cut lengths, switch-contact coordinates or full vehicle collision/travel measurements. Catalog callouts establish identity and arrangement, not manufacturing dimensions. Local geometry therefore remains reconstructed. Every related backlog task stays open until its listed modeling, dimensional, procedural and test requirements are all satisfied.

The public fieroinfo 1985 owner-manual download returned a 9,442,792-byte PDF with a header declaring 33,867,178 bytes; PyMuPDF recovered zero pages. The alternate Boomtastic URL returned 404. Neither download is accepted as a valid locally inspected manual.

## Subsequent verification and source recovery

The charging browser review passed on 2026-09-22 at 04:36:42 UTC, covering battery/starter/generator selection, assembled/exploded states, isolated rotor/rear frame and mobile layout, with no browser errors or image requests. Screenshots are named in `artifacts/charging-review.json` and were visually inspected. The refined overhead lamp and the corrected hood clearance were also inspected in that run.

The owner’s manual was recovered from Boomtastic’s reorganized file center: `references/1985-owners-boomtastic.pdf` is an intact 107-page copy (33,867,178 bytes). Printed 6-4 / PDF 92 corroborates the bulb identities. The earlier 9,442,792-byte FieroInfo file remains a failed, truncated download, not evidence. See `wiring-reconstruction.md` for the working URL and fuse/ECM additions.

The radiator package was moved downward by 52 mm to eliminate the upper support and filler cap protruding through the accepted hood. The adjacent hose endpoints were adjusted with it. `artifacts/front-clearance-audit.json` records a minimum modeled hood gap of 6.3906 mm. This resolves a visual interference; it is not a claim to have measured the production radiator mounting datum.

## R6 correction after owner rejection

The earlier three-chamber model and nearly opaque outer cover were incorrect. The original GM rear-lamp diagram, 1985 DIY drawing and opened original-assembly photographs were reopened. Four chambers, separate inner optics, a smooth clear outer cover and a fitted fascia opening now replace that construction. See [R6 source and dimensional limits](body-r6-tail-lamp-review.md). Earlier lighting-review reports/captures retain their original source and do not establish current acceptance.
