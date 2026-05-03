# TestMyKid side project design

## Problem

The portfolio's **Side Projects** section needs a new first item for the TestMyKid student app at `https://testmykid-27ac8.web.app/student/`. The new card must show a highlight image captured from the live site and allow visitors to open the project directly from the portfolio.

## Proposed approach

Add a new project entry to the existing `projects` data in `public/res_primaryLanguage.json`, keeping the current section structure intact. Enhance the `Projects` component so cards with a `url` become clickable external links while cards without a `url` continue to render as non-clickable content.

## Scope

### In scope

- Add a new TestMyKid side project as the first item in the `projects` array
- Capture a screenshot from the live student page and store it as a portfolio asset
- Use the screenshot as the primary thumbnail for the new project card
- Make project cards open their `url` in a new tab when a `url` is present
- Preserve the current layout and styling pattern of the Side Projects grid

### Out of scope

- Redesigning the Side Projects section
- Adding buttons, badges, or expanded project detail modals
- Refactoring unrelated project data or content
- Changing existing project ordering beyond inserting the new item first

## Architecture and components

### Data layer

The source of truth remains `public/res_primaryLanguage.json`. The new TestMyKid entry will include:

- `title`
- `startDate`
- `description`
- `images`
- `url`
- `technologies` if needed by the existing schema

The new entry will be inserted as the first item so it appears first without additional sorting logic.

### Presentation layer

`src/components/Projects.js` will keep the current card-based rendering. The component will be adjusted so:

- a project with a non-empty `url` renders as a clickable card that opens in a new tab
- a project without a `url` continues to render as a plain card
- the existing image, year, title, and description layout remains unchanged

This keeps the behavior additive and backward-compatible with the current data.

### Asset handling

A screenshot captured from the live TestMyKid student page will be added under the existing public asset structure, such as `public/images/portfolio/...`. The new project entry will reference that image path as its primary thumbnail.

## Data flow

1. The portfolio loads `res_primaryLanguage.json` as it does today.
2. The `projects` array is passed into `Projects`.
3. `Projects` renders each item into a project card.
4. For the new TestMyKid item, the first image path points to the captured screenshot.
5. Because the item includes a `url`, the rendered card opens the external student app in a new tab.

## Error handling and behavior rules

- If a project has no `url`, it must not render as a broken or empty link.
- External links must use safe attributes for new-tab navigation.
- If the new screenshot asset path is wrong, the issue should be fixed at the asset reference rather than hidden with fallback behavior.
- Existing projects without links must continue to display exactly as before.

## Testing and validation

- Confirm the new TestMyKid card appears first in the Side Projects section.
- Confirm the screenshot thumbnail loads correctly.
- Confirm clicking the new card opens `https://testmykid-27ac8.web.app/student/` in a new tab.
- Confirm existing project cards still render normally.
- Confirm the projects grid layout remains intact after adding the new first item.

## Notes

This design intentionally avoids broader UI refresh work. The goal is to add one new featured side project with a live-site highlight image and a small, reusable enhancement to card click behavior.
