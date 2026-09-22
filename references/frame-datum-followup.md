# Underbody datum evidence and model follow-up

Inspected primary source: [1986 Pontiac factory service manual](https://fieroinfo.com/manuals/1986_Fiero_Service_Manual.pdf#page=1200), body section printed 3-4 through 3-7, PDF 1200–1203. This is adjacent-year evidence. It has not been established as the exact 1985 SE body-alignment specification.

Figure 3-4 locates the physical points. Figure 3-5 supplies horizontal and vertical dimensions; 3-6 covers the front upper rails, 3-7 the rear upper rails and strut towers. The definitions table on printed 3-6 is essential: some references are bolt centers, others hole edges, flanges or lap-joint corners. They must not all be treated as interchangeable mesh centers. Printed 3-7 repeats the dimension values in metric and customary units.

Selected comparison data, in millimeters:

| Reference | Published value | Meaning / caution |
| --- | ---: | --- |
| A–A | 753 | Front lower outer-rail reference pair; A uses the trailing edge of the rectangular hole. |
| B–B | 740 | Front crossmember rear mounting-bolt centers, bolts installed. |
| C–C | 786 | Forward control-arm-bracket flange reference, aligned with installed mounting bolt. |
| D–D | 716 | Front lower inner-rail rectangular-hole leading edges. |
| E–E | 1062 | Rear motor-compartment rail lap-joint corners. |
| G–G | 1056 | Front cradle mounting-bracket bend references. |
| H–H | 917 | Rear cradle attachment bolt centers, bolts installed. |
| F–H | 867 | Front-to-rear cradle attachment references; interpret projection using the original figure. |
| L–L | 1348 | Front upper-rail 10 mm hole centers. |
| M–M | 1202 | Cowl hood-restraint threaded-hole centers. |
| N–N | 1413 | Rear upper-rail forward mounting-pad holes. |
| O–O | 1104 | Forward attaching-hole centers on the strut towers. |
| Installed strut-bolt centers | 1098 | Separate annotation in figure 3-7; not O–O. |

The drawing states a ±3 mm tolerance and side-to-side symmetry of control points. Vertical dimensions use its horizontal datum plane, **not the road surface**. The ground-to-datum transform is not established by this page. Do not relocate body members using those vertical numbers as ground heights.

The current reconstructed tower centers in `src/structure.js` are at X ±0.628 m (1256 mm separation), with a three-hole pattern around each. The rear-strut model is correspondingly authored against reconstructed hard points. This has not been reconciled with the separate 1098/1104 mm factory annotations above. Requirements 09.1, 09.4 and 17.3 remain open. A valid correction needs the proper 1985 application, datum mapping, coordinated tower/strut/spring geometry and wheel/body clearance checks; a whole-car lateral scale would also distort the verified wheel track and accepted exterior.

The companion spring-size discrepancy is recorded in `suspension-nominal-followup.md`. No runtime geometry was changed during the frozen full-browser regression.
