# Experiment Playground Design

## Goal

Build a minimal visual gallery website for daily creative experiments. The site should feel quiet and image-led, with date and tag metadata visible on each experiment.

## Direction

Use an index gallery as the primary experience. The first screen should show the playground name, a short description, tag filters, and a responsive grid of experiment cards.

## Content Model

Each experiment has:

- `title`: display name
- `date`: ISO date string
- `tags`: short category labels
- `summary`: one-sentence context for accessibility and detail
- `accent`: color used to generate a distinct preview

The first version stores experiments in a JavaScript array so adding a daily experiment is a small data edit.

## Visual Design

The site is minimal, bright, and gallery-like. Cards should prioritize visual previews, with metadata kept compact. The style should avoid heavy decoration and use simple typography, restrained borders, and a clean responsive grid.

## Interactions

Visitors can filter experiments by tag. Filters should be usable by mouse, touch, and keyboard. Selecting a tag updates the visible gallery and the count text.

## Technical Approach

Create a static site using plain HTML, CSS, and JavaScript modules. This keeps the playground portable and simple while leaving room to migrate individual experiments into their own pages later.

## Testing

Use Node's built-in test runner to verify the content model and gallery filtering helpers. Manually verify rendering in a local static server.

