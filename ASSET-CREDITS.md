# Asset and source credits

All vehicle meshes, procedural surface textures, lettering and interface graphics in this build are authored in this project. No downloaded vehicle mesh, car photograph or AI-generated car image is presented as 3D geometry.

## Lighting asset

- Asset: **Studio Small 09**, Poly Haven.
- Source: https://polyhaven.com/a/studio_small_09
- Local file: `public/assets/studio_small_09_1k.hdr`.
- Download: https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr
- License: **CC0**; https://polyhaven.com/license.
- Use: illumination and reflections on the live meshes. The environment is not displayed as the background.

## Factory references

- **1985 Pontiac Fiero Do-It-Yourself manual**, Pontiac / General Motors, hosted by FieroInfo: https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf.
  - Printed 1-4 through 1-6: structural layout and exploded body illustrations.
  - Printed 2-4, 2-14 and 2-16: front service compartment, clutch-fluid reservoir and V6 air-cleaner placement.
  - Printed 2-28 through 2-30: headlamp cover, black plastic bezel, sealed-beam lens, reflector, retainers and motor layout; replacement sequence paraphrased with direct part references. Physical removal paths and workshop validation remain outstanding.
  - Printed 3-2: overall dimensions, wheelbase and track widths.
  - Printed 3-3: wheel dimensions and exterior reference view. The pictured aero nose is GT; it is not used as the SE nose.
- **1985 Pontiac Fiero Canadian brochure**, Pontiac / General Motors, hosted by XR793: https://xr793.com/wp-content/uploads/2018/10/1985-Pontiac-Fiero-Cdn.pdf.
  - PDF page 2: GT exterior and WS6 package description / P215/60R14 tires.
  - PDF page 3: SE bumper-pad exterior, notchback profile and luggage carrier.
  - PDF page 4: cockpit, integrated headrests, speaker seats and V6.
  - PDF pages 5–6: construction, equipment chart and dimensions.
- **Pontiac 22P parts & illustrations**, General Motors Service Parts Operations, November 1990 edition covering 1984–88: https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_P22.pdf.
  - Printed H-19 and H-22: exploded L44 engine illustrations.
  - These two illustrations also guide the separate engine component explorer: reconstructed internals and grouped hardware, with coverage recorded in `references/engine-explorer.md`. No catalog scan or reference photograph is displayed as an engine component.
  - Printed H-23, item 6: 1985–86 upper-plenum catalog number 10033120; the 1987–88 plenum is listed separately.
  - Printed K-17 / K-18: exploded front lamps, headlamp covers, bezels, rings and actuators; K-18 distinguishes the 1984–86 actuators from the 1987–88 motors. The illustration index calls the front-lamp entry K-18; its illustration itself is printed K-17.
  - Printed G-13 / G-19: SE front and rear bumper-pad fascia contours and trim layout; G-10: pedestal spoiler; H-7: V56 carrier with longitudinal slats and integral rear wing.
  - Printed H-8: roof skin, rear clip, sail applique, door skins and sill-panel relationships.
  - Local development reference: `references/fiero-22p-parts.pdf`. This catalog is not a dimensioned CAD source or an interchangeability certification.
- **1985 Fiero service section 6E3**, Pontiac Service Department: https://fieroinfo.com/manuals/1985_Fiero_6E3_Emissions_and_Drivability.pdf.
  - Cover identifies the 1985 2.8L L44 / VIN engine code 9; fuel, sensor, EST and EGR illustrations inform the engine component detail.
  - Local development reference: `references/1985-fiero-6e3.pdf`. Diagnostic procedures have not been imported into the interactive guides.

Factory publications remain the property of their respective copyright holders. Local reference copies in `references/` support development; they are not included in `dist/` or displayed as the vehicle. A reference being listed does not establish permission to republish it, complete content coverage, or validated geometry.

VIN identity was checked through NHTSA vPIC. Four-speed manual, originality and WS6 are owner-reported. The VIN is not a paint, trim or complete option decoder.

## Libraries

- Three.js — MIT; installed package includes its license.
- Vite — MIT; development and bundling.
- Playwright — Apache-2.0; browser acceptance checks.

No paid model or service was used. See `references/geometry-provenance.md` for the distinction between documented dimensions and reconstructed shapes.

The supplementary owner-sale exterior-angle references and their limitations are recorded in `references/exterior-refinement.md`. No reference-car photographs are shipped as runtime assets.

Roof, side-panel, wheel and raised-headlamp reference details are recorded in `references/roof-side-wheel-refinement.md`.

The four owner-provided local photographs (`IMG_5459.jpg` through `IMG_5462.jpg`) were inspected only as appearance references. They are not copied into public assets or the production bundle.

The rear roof, sail-applique, rear-window, taillight and engine-deck revision is documented in `references/rear-body-refinement.md`, including the limits of mixed-year catalog illustrations.

## Ignition / engine-control reference additions (2026-09-21)

- GM L44 distributor K-13 / GM02-056, [parts CD PDF page 65](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=65), inspected for all 17 callout types and the two 1985 variants.
- [1985 6E3](https://fieroinfo.com/manuals/1985_Fiero_6E3_Emissions_and_Drivability.pdf): EST figure 38, MAP figure 9, throttle figure 25, fuel/cold-start figures 30–33 and EGR figure 42.
- [1986 service manual, figure 27A](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=395): separate-coil HEI/EST forms. Adjacent-year geometry reference only, not 1985 service/interchange certification.

All new ignition and control geometry is authored in the project. No product image was shipped or used as a mesh texture. Exact inspected pages, failed image-download attempts and remaining limits are recorded in `references/ignition-reconstruction.md`.

The spark-plug reference was transcribed from the printed six-cylinder entries in the 1985 Pontiac DIY manual, 2-22 and 3-3 (PDF 31 and 60). Handwritten annotations in the scanned copy were not adopted.

## Cooling, lubrication and valve-gear additions (2026-09-21)

GM 22P H-19–24 and the original Pontiac DIY thermostat illustrations (printed 2-39 and 2-41) support the new service scopes. The [MotoRad 211-195 manufacturer page](https://motorad.com/part/211-195/) provides explicitly labeled replacement-envelope dimensions, not original installed-part measurements. No manufacturer image was downloaded or imported. The housing, pump, dipstick, sender, seals, valve hardware and stamped rocker surfaces are authored geometry. See `references/engine-service-reconstruction.md` and `references/valve-gear-reconstruction.md` for exact identities and remaining limitations.

### Four-speed and cooling reconstruction

The transaxle, clutch, radiator, fan, coolant pipes, recovery bottle and heater circuit use locally authored Three.js meshes and procedural materials. Factory component references: GM 22P CD PDF 36, 40, 51–52, 128–130 and 263; adjacent-year 1986 Pontiac service manual PDF 802–804 and 343–345; 1985 DIY PDF 13 and 23. References are linked for attribution and applicability; scanned illustrations and photographs are not included as app assets. See `references/transmission-cooling-reconstruction.md` for source distinctions and geometric limits. No paid asset, external model download or AI-generated raster asset was used.

### Brake reconstruction

All brake surfaces, seals, pipes and cable assemblies are native Three.js geometry. Sources include GM 22P CD PDF 166–182, 1985 Pontiac DIY PDF 59, adjacent-year 1986 Pontiac service PDF 235–265, and the [public 1985 factory-service sample, printed 5-27](https://cdn11.bigcommerce.com/s-ragx7opcj4/content/files/1985-pontiac-fiero-service-manual-sample1.jpg?t=1663030449). Exact page uses and applicability limits are recorded in `references/brake-reconstruction.md`. Public reprint preview scans are development references only, not runtime assets. No paid asset or photographic stand-in was added.

### Suspension and manual steering

Native authored surfaces use GM 22P CD PDF 193–194, 197–198 and 219–221 for early front/rear suspension, WS6 pinion applicability and steering-damper arrangement. Adjacent-year 1986 Pontiac service PDF 168–170, 192, 198 and 201 clarify assembly relationships. No scan or photograph appears as a component or texture. See `references/suspension-reconstruction.md` for inspected evidence and unverified dimensions.

### Early V6 fuel supply

Native tank, pump/sender, filler, pipe, filter and canister geometry uses GM 22P CD PDF 79–80 and 115–117, with the explicitly typical pump/sender illustration at 1986 Pontiac service PDF 364 as adjacent-year evidence. No four-cylinder or later auxiliary vapor-tank application was silently adopted. See `references/fuel-reconstruction.md`. All rendered surfaces and material detail are authored geometry/procedural textures.

The early L44 exhaust uses native geometry informed by GM 22P CD PDF 122–123 and the adjacent-year 1986 Pontiac service manual, PDF 705–709. These distinguish early converter/front-pipe/muffler applications, single-bed pellet construction, spring supports, and black SE versus bright GT tailpipes. No source scans are displayed as parts. See `references/exhaust-reconstruction.md` for applicability and dimensional limits.

Body-panel hardware is native geometry referenced to GM 22P CD PDF 237–238, 300–302, 336–338 and 343–344; adjacent-year Pontiac service figures at PDF 1208–1209, 1214–1215 and 1248–1252; and the publicly available 1985 factory service sample of the rear roof attachments (printed 6-9). Exterior curves supplied in prior owner review are preserved. Sources and unresolved dimensional limits are recorded in `references/body-hardware-reconstruction.md`.

HVAC geometry: locally authored native meshes from GM 22P CD PDF 252–255, 261, 263–264, 278–280 and the adjacent-year Pontiac 1986 service manual PDF 48–51. The option previews distinguish standard C41 from C60; exact tooling/placement remains reconstructed. No manual illustrations or photographs are included as model surfaces. See `references/hvac-reconstruction.md`.

## Headlight detail pass

Original native meshes for the 1985 early headlamp assemblies, including cover/bucket poses, lamp optics, actuator construction and relays. Reference evidence and application limits: [headlight reconstruction](references/headlight-reconstruction.md). Factory illustrations and supplier photographs were inspected for structure only; no downloaded reference photograph is distributed as a rendered component, texture or background.

## Electrical, nominal specifications and instrument pass — 2026-09-22

The [original 1985 owner manual](https://www.boomtastic.com/files/?serve_file=Service+Manuals%2C+Guides%2C+and+Tips%2FOwners+Manuals%2F1985%2F1985+Fiero+Owners+Manual.pdf), GM 22P and the [Pontiac MVMA specification form issued September 1, 1984](https://www.boomtastic.com/files/?serve_file=Service+Manuals%2C+Guides%2C+and+Tips%2FMotor+Vehicle+Specifcations%2F1985-86+Pontiac+Fiero.PDF) support the new lamps, charging equipment, fuse block, early cluster and selected engine/transaxle/headlamp datums. See `references/electrical-reconstruction.md`, `wiring-reconstruction.md`, `instrument-reconstruction.md` and `1985-mvma-research.md` for inspected pages and exclusions. Native meshes and procedural text/materials remain locally authored; no scans or component photos ship in the app.

## Distribution notices

`public/THIRD-PARTY-NOTICES.txt` is copied into the production output. It contains the installed Three.js MIT text, Vite core notice for the runtime preload helper and the Studio Small 09 source / CC0 attribution. Poly Haven’s asset page and licensing page were checked on September 22, 2026; the asset identifies Sergej Majboroda as author. `scripts/audit-distribution.mjs` checks the built notice, identical lighting asset and exclusion of reference scans, photographs and imported vehicle meshes from `dist/`.
