# Editing and extending cases

The app is deliberately small enough to modify without a framework. `cases.js` defines the fictional cases; `app.js` implements their shared state machine.

## Existing case shape

Each case includes a unique `id`, a display bed number, a fictional patient name, demographics, severity, complaint, introductory narrative, correct diagnosis ID, accepted plan ID, procedure variant, required imaging IDs, fixed initial vitals, examination findings, study reports and debrief paragraphs.

`findings` uses `history`, `mental`, `pupils`, and `motor`. `studies` uses `ct`, `mri`, and `cta`, with `finding`, `impression`, and a `visual` ID in each study. The written report is the authoritative game finding.

An operative case has `procedure: 'hematoma'`, `'tumor'`, or `'aneurysm'`. A nonoperative case has `procedure: null` plus four `handoff` entries, each with a short title and explanatory text.

Keep `id` and choice IDs stable when revising an existing case. There is no migration system for arbitrary schema changes. To change the state schema, increase the storage key/version and provide an explicit migration or reset strategy.

## Game states

```text
new → investigating → diagnosed → preop → operating → complete / failed
                              ↘ handoff → complete
```

Diagnosis confirmation is gated by documented history, at least three assessment items and review of every study in `required`. An order alone is not a review. Incorrect choices leave the case in its existing phase and accrue reasoning penalties. The management pathway must be correct before the treatment phase unlocks.

Completing the surgical time-out initializes the operative state. A procedure consists of six arcade stages. Each stage defines a tool ID, a display title, a set of percentage-positioned target coordinates and whether targets must be visited in order.

## Important extension constraints

1. **Preserve game/clinical separation.** Do not turn a simplified arcade sequence into an operative instruction manual. Keep anatomy and imaging limitations visible. Secure appropriate review before adding clinical decision rules.
2. **Use invented cases only.** Do not paste real patient reports, identifiers or scans into this public client-side application. Every case and correct answer is inspectable in the source.
3. **Validate consistency.** Check clinical laterality, symptom time course, arithmetic such as component GCS values, and the compatibility of the selected imaging and care pathway.
4. **Keep targets usable.** Targets have 44×44 px hit areas. Maintain enough spacing for narrow screens. Ordered targets should remain keyboard-accessible.
5. **Update all coupled lists.** New diagnosis or plan IDs need options in `BRAIN_DATA.diagnoses` or `.plans`. A new procedure ID needs stage definitions, drawings and regression tests.
6. **Do not treat scores as outcomes.** The scores are arbitrary game metrics. Validation of an assessment instrument is a separate research process.

## Adding a seventh case

The current interface deliberately displays a six-case shift. Adding a case requires updating the fixed counts in the hospital, journal and rank text in `app.js`, as well as case data and tests. A future refactor could derive all counts from `BRAIN_DATA.cases.length`.

## Design decisions

There is no real-time model of untreated clinical deterioration before the procedure. Initial stabilization is described as happening in parallel, and the assessment gates are explicitly labeled game mechanics. Challenge-mode stability is an arcade timer only. Nonoperative cases are equally valid successful outcomes.

The chronic subdural case uses the generic hematoma arcade variant rather than depicting a real burr-hole, craniotomy or embolization approach. The aneurysm case specifies that a fictional specialist team selected clipping; it does not recommend clipping over all endovascular options.

## Useful next research-development steps

Expert-authored cases with versioned review; validated learning objectives and debrief rubrics; genuine de-identified imaging under appropriate governance; accessible alternatives to visual target tasks; consented study telemetry; and a separate validation plan. These are extension ideas, not implemented capabilities.
