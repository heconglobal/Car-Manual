# Heater, ventilation and optional C60 reconstruction

This increment adds 64 selectable parts or grouped sets. C41 and C60 choices overlap: the standard-heater preview shows 51 entries, and the air-conditioning preview shows 63. These are not a full HVAC bill of materials. Original C60 fitment is not decoded from this VIN.

## Factory evidence inspected

- [GM Pontiac 22P CD, PDF 252–255](https://fieroinfo.com/manuals/84-88_Fiero_Parts_%26_Illustrations_CD.pdf#page=254): C41 heater/defroster and heater/blower cases, core, foam, retaining strap, separate vent/defrost/temperature doors and shafts, wheel, motor, cover and cooling tube.
- Same catalog PDF 261: 1985–88 C41 control housing, illumination, blower switch, knob and retaining spring, temperature knob, applique and light pipe.
- Same catalog PDF 263–264: C60 heater/A/C module. The 1984–85 air-inlet case/cover is distinguished from 1986–88. Heater core 3052427 differs from C41 3052181. The blower motor/wheel identities are shared. The drawing identifies separate electric air-inlet and mode actuators, evaporator core, drain, fixed orifice, accumulator, bracket and pressure-cycling switch.
- Same catalog PDF 278–280: cabin distribution ducts, outlets, foam and attachments; the C60 resistor changes after 1985; 1985–88 C60 pushbutton control differs from C41 sliders.
- [1986 Pontiac service manual, PDF 48–51, printed 1B-2 through 1B-5](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=48): adjacent-year evidence for component function and airflow. The Fiero uses electrical mode selection rather than the general GM vacuum harness described on the same page. Temperature remains controlled by a mechanical cable. The evaporator and coolant heater core are separate heat exchangers. The typical accumulator drawing is not treated as a measured Fiero cutaway.

Local source-page renders are in `/tmp/fiero-body/`, backed by the downloaded factory-reference PDFs in `references/`. Images are research evidence only; the product loads native geometry, procedural materials and authored labels.

## Implemented

- Open main-case surfaces and fan-scroll passage; removable core cover and foam; two option-specific core/tank envelopes; mounting strap; tube bulkhead seal; blend door, shaft, cable bracket; upper distributor with open throats, vent and defrost doors and shafts.
- Centrifugal blower with curved vanes, open rims, hub, retaining hardware, motor shell/shaft/flange, cover, gasket, cooling tube, ground lug, connector, resistor-coil preview and high-speed relay exterior.
- Hollow windshield, dashboard and footwell ducts; independent outlet frames/vanes; seals and mounting sets.
- C41 slider controls and mechanical mode cables, or C60 pushbuttons and electric actuators; shared fan switch/knob, retaining clip, mechanical temperature linkage/cable and lamp.
- C60 evaporator, cover/seals, condensate drain, accumulator exterior and bracket, cycling switch, fixed orifice/screen and short connection tubes. This does not complete the refrigeration loop.
- Whole-car owners `hvac-module` (cooling), `hvac-ducts` and `hvac-controls` (interior). Interior ownership keeps the cabin outlets and controls fully visible under the cabin filter. Native core geometry is shared with the coolant explorer; the old duplicate core, coarse vent outlets and generic temperature control were removed from whole-car geometry.
- Catalog visibility, search results, nested scopes and 3D visibility all follow the A/C preview. Turning C60 off while inspecting its exclusive evaporator scope returns to the populated heater scope, clears a hidden selection and reframes the camera.
- US LHD: passenger-side core/blower/evaporator, driver-side blower knob and driver outlet; the baked handedness transform is applied once per completed model.

## Limits

The free diagrams establish architecture and identities, not manufacturing surfaces or dimensions. Core envelopes, blower vane count/profile, motor details, housing wall thicknesses, tabs, case partitions, duct sections, clearances and cable routes remain reconstructed. The C60 chamber is added to a shared provisional main-case envelope; the complete option-specific case tooling is not replicated. Some component callouts on shared entries link the C41 drawing; their descriptions identify option differences. Common illustration callouts are not proof of identical parts.

The controller graphics are reconstructed and require visual acceptance against the factory faceplate. Doors and controls are static construction views; no airflow or electrical operating simulation is supplied. No resistance, pressure, refrigerant charge, torque or service sequence is published. Blower/actuator/switch/accumulator internals and complete wiring remain grouped. Compressor, condenser and long A/C lines still use the earlier coarse preview. Exact mounting positions need measurement of the car and validation against the correct factory body datums.

This is an expanded visual review increment, not complete factory-dimensional or photorealistic acceptance.
