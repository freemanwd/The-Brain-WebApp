# Verification report

Build: 1.0.0 · September 19, 2026

## Automated verification

**19 regression groups passed. No uncaught JavaScript errors were observed during those runs.** See `tests/test-results.json` for the detailed results.

The suite exercised all six cases through diagnosis, management selection and completion. It also checked mandatory imaging review, diagnostic and management errors, mandatory time-out checkboxes, keyboard instrument selection and target activation, target ordering, help dialogs, pause/resume, assistance, deterministic scoring, debrief lookup, JSON export, replay, serialization/recovery, Challenge timing, frozen per-procedure mode, inactive-screen pause, failure, storage errors, corrupt saved JSON and reset confirmation.

Responsive/touch checks used a 390×844 Chromium viewport and a narrower 320 px layout. The tumor procedure was completed with touch targets; target dimensions were at least 44×44 px and no horizontal document overflow was observed in the checked views. Desktop screenshots were also visually inspected.

`node --check` passed for both JavaScript source files.

## Test-environment limitations

The managed browser in the build environment disallows navigation to URLs, including local files and localhost. Generated HTML was therefore rendered with Playwright `set_content` rather than by navigating to a hosted page. This respects the environment’s navigation policy without modifying it.

An opaque rendered document cannot use real localStorage. The suite tests two distinct conditions:

- Actual unavailable-storage behavior, without a storage substitute. A complete nonoperative case remained playable.
- Save serialization and fresh-context recovery using an explicitly declared in-memory localStorage test double. This checks the application’s state logic, not disk-backed browser persistence.

The following have **not** been established by these tests: native file navigation; public hosting; physical iPhone/iPad/Safari operation; native home-screen installation; the service-worker offline/update lifecycle on a real HTTPS origin; physical-device audio or fullscreen; comprehensive accessibility conformance; clinical validity; or educational efficacy.

## Run the suite

Use a Python environment with Playwright and a compatible Chromium installation:

```bash
pip install playwright
python -m playwright install chromium
python3 tests/regression.py
```

The script discovers `chromium` or `google-chrome` on the path, or uses Playwright’s browser. Set `CHROMIUM_PATH` to use another compatible executable. Set `BRAIN_QA_OUTPUT` to choose a directory for screenshots and the test-exported JSON log.

The suite operates on `../the-brain.html`. Run `python3 build.py` after editing the source, before testing.

## Manual release checklist

Before sharing a hosted build widely, open it in current desktop and mobile browsers. Complete at least one operation and one nonoperative pathway. Check that an in-progress procedure survives a real reload, resumes paused, and remains correct after browser restart. Verify sound opt-in, modal focus, touch target spacing, storage-denied behavior and public-origin privacy.

On HTTPS, allow the first load to finish, reload under network-offline conditions, and verify that the cached shell remains playable. Test service-worker updates when publishing a new release, and version the cache name for incompatible assets. Confirm home-screen installation where supported. These checks remain to be performed in the intended deployment environment.
