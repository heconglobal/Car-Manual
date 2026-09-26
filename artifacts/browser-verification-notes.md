# Browser verification — Body R8

Source: `0c1e23dd80f0886b27d6e772e2800d88db8c74418c309c5d59a62a201255d310`.

**Paused at owner request after the R8 app update.** No further modeling or test runs are scheduled.

**4/40 current browser scenarios have completed passing evidence:** body/reference comparison, wheel/roof/front close views, six main exterior views, and roof/deck alternatives. The remaining 36 scenarios are not current passing coverage.

Completed reports:

- [Body comparison and close views: two scenarios](regression-history/2026-09-25T01-28-38.127Z-0c1e23dd80f0.json).
- [Six main exterior views: one scenario](regression-history/2026-09-25T01-34-15.715Z-0c1e23dd80f0.json). Its outer command returned exit 143 after the test completed and its passing report and captures were archived. The completed report records one expected result, zero unexpected/skipped/flaky results and no errors; this is not a console-only pass or a clean outer-command exit.
- [Roof/deck alternatives: one scenario](regression-history/2026-09-25T01-40-41.255Z-0c1e23dd80f0.json).

Seventeen final-source screenshots were opened and inspected; their hashes are retained in the [visual manifest](visual-inspection-manifest.json). The service selection/explosion browser scenario was interrupted at the owner's pause and has no completed eligible report. The dedicated rear-lamp browser scenario was not refreshed on final R8 source. Neither is counted as passing.

All [five focused body audits](body-geometry-verification.json) pass on this exact source: exterior/shared skins, sixteen selected nominal body dimensions, rear-body surfaces, front clearance and exterior fit. The production build passes with its existing bundle-size advisory. The full vehicle geometry aggregate, native hardware review and full browser suite were not refreshed successfully.

H102/H104 bumper-ground interpretations remain unresolved. Exact factory panel/optical tooling, all local contours and gaps, original equipment confirmation and owner acceptance remain open. See [visual findings](visual-review-findings.md), [R8 specification](../references/body-r8-specification.md) and [pause record](r8-user-pause.json).
