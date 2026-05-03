# Bilingual content and AI-positioning design

## Problem

The portfolio needs a bilingual content system across the full site, not just isolated labels. The content also needs a sharper professional narrative that presents the profile as AI-focused while still grounded in established experience across architecture, delivery, and engineering leadership.

## Proposed approach

Add a single language state at the application level, defaulting to English and restoring the user's prior choice from `localStorage`. Move portfolio copy into a structured bilingual content model with explicit `en` and `th` values so every section reads from the same source of truth and can be rewritten consistently in both languages.

## Scope

### In scope

- Support two languages across the full portfolio
- Default first load to English
- Persist the user's selected language in `localStorage`
- Add a visible language toggle at the top-right of the header/navigation row
- Rewrite portfolio copy in both English and Thai
- Reposition the profile narrative to emphasize AI interest and application of prior experience to AI work
- Cover About, section labels, calls to action, project text, experience text, and other user-facing portfolio copy

### Out of scope

- Font redesign
- Side Projects visual redesign
- Light/dark theme support
- Adding third-language support
- Automatic browser-language detection on first load

## Architecture

### Application state

The app will hold one current-language state at the top level. On first load, the app starts in English unless a previously selected language is found in `localStorage`. The language toggle updates this state and writes the new value back to `localStorage`.

### Content source of truth

The portfolio content will be reorganized so user-facing text is represented as bilingual data rather than hard-coded strings spread across components. Each content field that appears in the UI will have explicit `en` and `th` entries. This includes:

- About content
- Section labels and titles
- CTA text
- Experience descriptions
- Project descriptions
- Other portfolio text rendered to the page

This makes translation completeness visible in the data model and keeps rendering logic simple.

### Component responsibility

Components should receive either the current language or already-localized content from the top-level composition layer. Components should not make independent language decisions or embed their own fallback logic. The toggle itself belongs in the header/navigation row at the top-right so it is immediately visible and consistent with the rest of the page shell.

## Content strategy

The rewritten copy in both languages should present the profile as:

- professionally established, not experimental or hype-driven
- strongly interested in AI work and practical AI application
- able to apply years of architecture and delivery experience to AI-oriented products
- actively studying AI and LLM workflows in personal time, including local and self-hosted setups

The content should avoid naming specific models unless required later. The intent is to communicate breadth, practical curiosity, and applied engineering judgment rather than attach the brand to one model family.

## Data flow

1. The app initializes with English.
2. If a saved language exists in `localStorage`, the app restores it.
3. The current language determines which localized values are read from the bilingual content source.
4. Components render the selected-language text for the current session.
5. When the user changes language from the header toggle, the app updates state, persists the choice, and re-renders the page with the alternate text.

## Error handling and data rules

- Missing translation content is treated as a data issue that must be fixed in the source content.
- The implementation should not silently fall back from one language to the other for missing fields.
- Language persistence should only store recognized language values.
- The toggle should remain visible and predictable regardless of the current section of the page.

## Validation and testing

- Verify the page defaults to English on first load when there is no saved preference.
- Verify the selected language is saved and restored from `localStorage`.
- Verify switching language updates the primary visible content across the portfolio.
- Verify header labels, About content, and representative project and experience text all switch correctly.
- Verify the page still renders correctly after the content source is converted to bilingual data.

## Notes

This spec intentionally isolates content architecture and bilingual behavior from the visual refresh and theme work. Fonts, Side Projects styling, and light/dark mode should be designed in separate follow-up specs so this implementation stays focused and testable.
