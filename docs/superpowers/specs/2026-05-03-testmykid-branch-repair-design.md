# TestMyKid branch repair and toggle polish design

## Problem

The `testmykid-side-project` branch was left unmerged because its test suite still fails on the legacy `src/App.test.js`. The branch also needs a more polished language toggle in the header/navigation area so the UI feels more professional before the branch is merged back into `main`.

## Proposed approach

Repair the branch with a minimal, merge-safe change set. Replace the failing `src/App.test.js` with a test that matches the actual app structure on `testmykid-side-project`, then add a segmented-control style language toggle in the header/navigation area without importing the larger bilingual system from `main`.

## Scope

### In scope

- Fix the failing `src/App.test.js` on `testmykid-side-project`
- Add a professional segmented-control style language toggle in the nav/header row
- Keep the branch compatible with its own current architecture
- Merge the repaired branch back into `main` after validation

### Out of scope

- Bringing the full bilingual content system from `main` into this branch
- Rewriting portfolio copy on this branch
- Adding full-language switching behavior for the entire page
- Redesigning the rest of the navigation or header layout

## Architecture

### Test repair

`src/App.test.js` should be replaced with a test that reflects the actual branch implementation instead of relying on the broken `ReactDOM.render` smoke test. The updated test should validate the app renders the expected project/navigation structure without dragging in the newer bilingual architecture.

### Toggle component behavior

The language toggle on this branch is a presentation-level enhancement, not a full bilingual feature. It should visually present EN/TH as a segmented control in the nav/header row and look intentional and professional, but it does not need to power full-site localization on this branch.

### Styling direction

The toggle should feel consistent with the current clean editorial UI: restrained borders, compact spacing, clear active state, and no loud theme departure. It should read as a refined segmented control rather than two plain buttons.

## Data flow

1. The branch continues to load the same project/shared data it already uses.
2. The repaired app test verifies the existing branch structure renders successfully.
3. The nav/header renders the new segmented toggle UI.
4. The branch test suite passes, making the branch eligible for merge.

## Error handling and merge rules

- The repair should avoid pulling unrelated code from `main`.
- The updated test must reflect current branch behavior instead of depending on code that only exists on other branches.
- The toggle enhancement must not break the current nav/header layout.
- The branch should only be merged after its full test suite passes.

## Validation and testing

- Verify `src/App.test.js` passes on `testmykid-side-project`
- Verify the existing TestMyKid-related tests still pass
- Verify the new toggle appears in the nav/header row without layout breakage
- Verify the repaired branch can be merged back into `main`

## Notes

This design intentionally keeps the branch repair narrow. The goal is to finish the original TestMyKid branch cleanly, not to backport the separate bilingual-content project into it.
