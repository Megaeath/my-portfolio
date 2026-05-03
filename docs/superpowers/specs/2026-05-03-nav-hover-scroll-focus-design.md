# Navigation Hover and Scroll Focus Design

## Problem

The top navigation currently uses a simple underline hover treatment that no longer matches the more polished segmented language toggle. It also does not indicate which content section is currently in view while the user scrolls.

## Goals

- Make nav hover styling feel visually aligned with the language toggle.
- Distinguish clearly between pointer hover/focus and the currently active section.
- Automatically highlight the current section link while scrolling.
- Keep the change scoped to desktop/tablet nav behavior without redesigning the mobile navigation pattern.

## Chosen Approach

Use a segmented, pill-like nav treatment:

- **Default state:** quiet text link with no underline animation.
- **Hover / keyboard focus state:** bordered pill using the same border and surface language as the language toggle.
- **Active section state:** filled dark pill matching the selected state of the language toggle.

The active section will update automatically when a section reaches the top tracking zone of the viewport, so the navigation responds early rather than waiting for most of the section to fill the screen.

## Interaction Design

### Hover and Focus

- Hover and keyboard focus use the same visual treatment for accessibility consistency.
- The hovered link gets a rounded border, subtle background, and stronger text color.
- Hover never overrides the true active section; it only indicates pointer intent.

### Active Section

- The active nav item uses a filled dark background and light text, mirroring the selected language toggle button.
- Only one nav item is active at a time.
- If the user hovers a different item while another one is active, the active item keeps its filled treatment and the hovered item receives only the hover border treatment.

## Technical Design

### State and Data Flow

- Add `activeSection` state in `App.js`.
- Define a single source of truth for nav items that includes both label and section id.
- Use a dedicated scroll spy observer for nav tracking rather than reusing the reveal animation observer.

### Section Tracking

- Observe the existing major content sections referenced by the nav.
- Update `activeSection` when a section enters the top tracking zone of the viewport.
- Prefer early activation near the top of the screen so users get immediate context while scrolling.

### Styling

- Replace the underline-specific nav link styling in `App.scss` with pill-based states.
- Reuse the language toggle’s border radius, border tone, and dark selected state so the nav and toggle feel like part of the same system.
- Preserve current responsive behavior that hides nav links on smaller screens.

## Error Handling and Safety

- Ignore sections that are not present in the DOM rather than failing.
- Fall back to the existing nav rendering if no active section has been detected yet.
- Keep the scroll spy lifecycle cleaned up on unmount.

## Testing

- Add or extend app tests to verify active nav styling logic.
- Verify that the current section link becomes active based on observer callbacks.
- Confirm hover/focus styling changes remain CSS-only and do not alter language toggle behavior.

## Out of Scope

- Redesigning mobile navigation
- Changing section ordering or content
- Reworking the reveal animation system beyond coexistence with the new nav scroll spy
