# The Brain — Browser Edition

A playable, independently implemented browser reimagining inspired by **Life & Death II: The Brain**. This is **not** a licensed port, a ROM bundle, an emulator, or an exact recreation of the original game's complete content. All application code, drawings, sounds, dialogue and fictional cases in this package are new.

## Play immediately

The ZIP contains `the-brain.html` alongside this source directory. Save that single file and open it in a desktop browser. The application is self-contained: no package installation, account, API key, font download or backend is required. It can also be served as a static web page.

Some mobile file-preview applications and in-chat attachment previews do not execute HTML/JavaScript. For iPhone/iPad access, serve the static source folder from an HTTPS host and open its URL in a browser. This package has **not** been published to a public URL.

The test environment used to create the package blocks browser URL navigation; the HTML was exercised via Chromium's rendered-document interface. Native file-opening, disk-backed persistence and physical Safari/iOS operation still need environment-specific verification.

## Run the editable source locally

From the `the-brain-webapp` directory:

```bash
python3 -m http.server 8000 --bind 127.0.0.1
```

Open `http://localhost:8000` on that computer. This is a local development server, not a public deployment. Stop it with Ctrl+C.

Alternatively, upload the contents of `the-brain-webapp` to a static HTTPS host. The entry page is `index.html`; there is no build command or Node dependency. Do not upload private credentials or patient data. The application contains none.

## What is implemented

- Six fully playable fictional cases: acute subdural hematoma, a dural-based tumor, aneurysmal subarachnoid hemorrhage, acute ischemic stroke, migraine with aura, and chronic subdural hematoma.
- A hospital board, patient charts, four assessment actions, CT/MRI/CTA orders, explicit report-review gates, diagnosis selection and management decisions.
- Three distinct arcade procedure variants: hematoma evacuation, tumor removal, and aneurysm clipping. The chronic and acute subdural cases intentionally reuse a generic evacuation mini-game; they do not imply the same real operative technique.
- Eight selectable instruments, ordered targets, mouse tracing, touch targets, keyboard operation, mistakes, failure states, pausing and a one-use team assist.
- Guided and Challenge modes, attending hints, a reference academy, numerical game scores, debriefs, replay, an attempt history and JSON export.
- Best-effort browser-local saving and resume, an explicit unavailable-storage fallback, original canvas graphics, optional synthesized sounds, and toggleable CRT scanlines.
- A manifest and service worker for hosted offline/install support. These files are included but their actual hosted offline/install lifecycle was not browser-tested in this environment.

## First shift

Select **Guided mode**, then **Begin your shift**. Read the first case's history, complete the examination, and order a CT. Read the written report, select **Mark report reviewed**, and return to the chart. Choose the diagnosis and an appropriate care pathway. Complete the time-out checklist before entering the operating room.

Inside the operation, select the instrument indicated by the stage instructions. Click each numbered target; access and closure stages must be completed in order. Other stages allow any target order. The next stage starts automatically when all targets are cleared.

You can also choose any case directly from the hospital board. Cases are not sequentially locked.

## Controls

| Control | Function |
| --- | --- |
| Mouse click / touch tap | Select controls, instruments and operative markers. |
| Mouse drag | Trace across operative markers while holding the primary button. |
| 1–8 | Scalpel, drill, retractor, suction, bipolar, forceps, clip, suture. |
| P | Pause or resume the current procedure. |
| Tab and Enter | Focus and activate interactive controls. |
| Escape | Close a dialog. |
| Header sound button | Enable or mute synthesized sound; always starts muted. |
| About → CRT scanlines | Toggle the decorative scanline overlay. |

Guided mode supplies instrument cues and does not reduce stability over time. Challenge mode reduces the fictional stability meter by 0.20 points per active second. Wrong actions can end a run in either mode. The current procedure's mode is fixed at entry; the header selector then affects the next procedure.

The timer is inactive when paused, when a dialog is open, when the operating-room screen is not active, or when the document is hidden. Loading an in-progress procedure resumes it in a paused state.

## Game scoring

The starting maximum is 100:

- **Assessment: 25 points.** Each of the four documented assessment items contributes equally, rounded to an integer. The game gate requires the history and at least three items total.
- **Reasoning: 35 points.** Each incorrect diagnosis or management attempt subtracts 7 points, floored at zero.
- **Treatment: 40 points.** For a procedure, each instrument/target error subtracts 3 points, a team assist subtracts 4 points, and each operative Challenge hint subtracts 2 points. Guided hints are free. A completed nonoperative checklist receives 40 treatment points.

Failed procedures also subtract 25 treatment points and cap the final total at 49. Component totals may therefore exceed the capped failure total. Grades: A ≥90, B ≥80, C ≥65, D ≥50, R below 50. **R means review, not a clinical outcome.**

Game stability is separate from scoring. Wrong-order actions cost 3 stability points; other errors cost 5 in Guided or 8 in Challenge. Team assistance restores up to 25 stability points once. Time pressure affects stability, not the score directly.

**None of these metrics is a validated assessment of medical knowledge, patient safety, clinical outcomes or operative competence.**

## Save, privacy and offline behavior

The application stores its own JSON under `the-brain-game-v1` in browser localStorage. No data is uploaded and no server database exists. Saves are specific to the browser and origin; file-based saves may differ from hosted saves. Changing the hosting address, using private browsing or clearing storage can make a save unavailable.

The app remains playable when storage access throws an error. In that case, the session is temporary and a warning is displayed. Use **Case log → Export JSON** to preserve a report. Export is a reporting function; an import interface is not implemented.

Reset removes only this app's saved progress, after confirmation. It does not call `localStorage.clear()` or erase other applications' data. Hosted service-worker caches contain this application's public static assets only.

The game does not accept patient uploads or free-text clinical histories. Do not add real patient information to the case definitions or export pipeline.

## Files

```text
the-brain.html             Self-contained direct-open edition (beside this folder)
the-brain-webapp/
  index.html               Static-host entry point
  app.css                  Responsive interface and accessibility styles
  cases.js                 Fictional cases, choices, instruments and references
  app.js                   Routing, state machine, procedural artwork and gameplay
  manifest.webmanifest     Hosted application metadata
  sw.js                    Optional same-origin offline caching
  assets/                  Original SVG and PNG app icons
  build.py                 Rebuild the single-file edition (Python standard library)
  README.md                This guide
  CASE_AUTHORING.md        Safe editing and extension notes
  SOURCES.md               Attribution and clinical-background references
  TESTING.md               Test results, methods and limits
  LICENSE.txt              License for the newly authored implementation
  tests/regression.py      Playwright-based regression suite
  tests/test-results.json  Machine-readable results for the delivered build
```

## Rebuild the standalone file

```bash
python3 build.py
```

This inlines the styles, data, JavaScript and favicon into `../the-brain.html`. It removes the service-worker registration and external manifest because the direct-open file does not need them. Source changes do not alter an already-built standalone file; rebuild after editing.

## Scope and safety

This is an entertainment/prototyping game, not a clinically validated simulator. It omits most real assessment, anesthesia, operative anatomy, procedural steps, complications and critical care. Scans are synthetic drawings; the slice slider produces variations of one schematic, not a genuine DICOM stack. The operating field is generic and not registered to the fictional diagnostic imaging. Scores and stability are invented.

A successful game level does not mean a real patient would survive or recover. No drug doses, real operative planning or credentialing claims are provided. Faculty and clinical review, accessibility review and device testing are required before deployment in a medical education program.
