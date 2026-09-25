# Coolant replacement walkthrough — original 1985 sequence

The interactive **Guides → Replace engine coolant** walkthrough retains all twenty numbered steps in the original Pontiac DIY publication. The guide crosses the thermostat, radiator, underbody-pipe and recovery-bottle inspection scopes, using actual selectable component IDs. It retains flushing and recovery-bottle cleaning, rather than presenting only the final filling stage.

Source inspected directly: [1985 Pontiac Do-It-Yourself manual, PDF 47–49 / printed 2-38–2-40](https://fieroinfo.com/manuals/1985_Fiero_Do_It_Yourself.pdf#page=47). PDF 46 / printed 2-37 supplies the general pressure, hot-coolant and automatic-fan cautions; PDF 50 / printed 2-41 confirms the V6 passenger-side housing and cap-release sequence. All five scanned pages were opened during this pass.

| Original steps | Interactive subject | Source PDF page |
| --- | --- | --- |
| 1–4 | Cool engine; staged housing-cap pressure release; remove thermostat | 47 |
| 5–8 | Brief circulation; initial drainage; clear-water flush; refit drains | 48 |
| 9–11 | Water fill at the radiator neck; caps fitted without thermostat; warm and drain | 48 |
| 12–13 | Drain closure and pipe-plug torque; bottle cleaning and reconnection | 49 |
| 14–16 | Historical coolant specification/concentration; caps; recovery fill | 49 |
| 17–20 | Timed idle purge; cool and top up; thermostat/cap refit; final cool level | 49 |

The housing cap, front radiator pressure cap and atmospheric recovery-bottle cap are distinct. The thermostat stays out until step 19. The guide repeats the requirement to cool the system before cap removal, including after the timed running stage. The publication's 12 N·m / 8 lb·ft tightening value is attached only to the two underbody coolant-pipe plugs. No torque is inferred for the radiator drain valve or optional block plugs.

The 3-liter / 3.2-quart recovery addition is the publication's step 16 instruction, not a capacity measured from the model. The timed purge is three minutes at normal idle followed by 15–20 seconds at fast idle. The original GM 1825-M specification and 50–70 percent antifreeze range are historical factory references; they do not certify a modern coolant brand. Separately reviewed system capacity and cap nominal pressure remain in [the cooling specification record](verified-cooling-specifications.json).

The viewer now allows each service step to choose its real assembly. Temporary configuration changes belong to the guide that requests them: only the headlamp guide raises the headlights. Finishing or cancelling restores the preceding component scope, selection, camera and configuration, while retaining unrelated preview edits. Twenty numbered navigation buttons wrap on narrow screens.

## Verification and remaining acceptance

`tests/coolant-guide.spec.js` traverses all twenty steps and checks each selected part against its visible assembly, page references, thermostat order, pipe-plug torque qualification, flush/bottle stages, purge timings, mobile wrapping, isolation and restored context. The original headlamp-guide scenario is rerun to verify the shared navigation change.

This is a source-checked interactive walkthrough, not a physically validated repair procedure. Optional engine-block drain plugs are named in the text but not yet separately modeled; exact access, removal paths, reservoir tooling/markings, all drain hardware and physical workshop checks remain outstanding. The adjacent-year or generic illustrations elsewhere in the project do not establish original 1985 dimensions. No acceptance requirement is automatically closed by this guide or its browser test.
