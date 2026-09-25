# Browser execution notes — September 23, 2026

Application/test source: `267f7ce33b674db06a91c3ae15cb71ee195ef8e058968119cb0bd117a4f00c23`.
Application manifest: `c714c049bdc374e790156fbfc59353a030739afd6d1ce3a35cd9accbfd17b846`.

- The first current-source full run exited with code 143 without writing a current Playwright JSON report. Its console successes are not counted as completed evidence. The cause remains unknown; see [interruption record](browser-interruption-267f7ce33b67.json).
- Four subsequent batches passed all 16 of their scenarios. The fifth passed suspension, transmission/cooling and valve gear, but rear-body reached its existing 180-second limit while waiting for the second Reset view action. The assertions reached before that timeout had passed.
- The unchanged rear-body test then passed alone in 2.6 minutes, within the same 180-second limit. No assertions, source files or timeout values were changed. This supports concurrent software-rendering load as the cause; it is not a general performance guarantee.
- The failed batch and successful rerun are both archived: [failed batch](regression-history/2026-09-24T01-31-39.758Z-267f7ce33b67.json), [unchanged single-worker rerun](regression-history/2026-09-24T01-42-52.400Z-267f7ce33b67.json). The [failure context](regression-failures/267f7ce33b67-rear-body-timeout/error-context.md) and trace ZIP are preserved separately from Playwright's temporary output directory.
- All 11 workshop scenarios passed in two groups with one worker: [five viewer scenarios](regression-history/2026-09-24T01-46-47.650Z-267f7ce33b67.json) and [six tour/source/feedback/mobile scenarios](regression-history/2026-09-24T02-00-41.239Z-267f7ce33b67.json). The consolidated [regression summary](regression-summary.json) now has eligible passing evidence for all 31 current scenarios.

The acceptance script requires an eligible passing result for every one of the 31 current scenarios on the identical application and test files. It evaluates the latest eligible result for each scenario across archived full and targeted runs. The live `full-regression.json` represents only the most recent invocation. Previous failures and interruptions are retained; passing interaction tests do not resolve the separate engine-timing geometry failure or unfinished checklist requirements.
