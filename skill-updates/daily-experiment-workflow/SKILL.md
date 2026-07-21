---
name: daily-experiment-workflow
description: Use when running a recurring daily creative-code playground workflow, building one high-fidelity design-engineering experiment, or turning references from Mobbin, 21st, Twitter/X, or similar sources into a polished prototype.
---

# Daily Experiment Workflow

## Purpose

Run a daily design-engineering experiment with a higher fidelity bar than a quick sketch. The workflow prioritizes visible craft, interaction quality, motion, and a recordable demo.

Use this alongside `craft-idea-scout` for idea generation. This skill controls the execution process.

## Default Tool Policy

- Use Mobbin for product UI and flow references when relevant.
- Use 21st for component, template, theme, logo, or variant sourcing when available.
- Use web search for public posts, release notes, festivals, and timely references when current context matters.
- Skip Figma and Pencil by default to reduce token and setup cost.
- Use Figma or Pencil only when the user explicitly asks for a design-canvas pass or when code-first work is blocked by visual ambiguity.

## Daily Flow

1. **Reference Intake**
   - Gather 3-5 references before ideating.
   - Prefer a mix of Mobbin screens/flows, 21st components/templates, public design-engineering posts, shader/motion demos, or timely event references.
   - For each reference, extract only:
     - visual system
     - motion or interaction behavior
     - implementation technique
     - what makes it feel premium

2. **Idea Generation**
   - Use `craft-idea-scout`.
   - Generate 2-3 directions, not one.
   - Each direction must include:
     - "What if..." prompt
     - central interaction
     - 10-second visual proof
     - motion/rendering technique
     - smallest convincing version

3. **Selection Gate**
   - Pick the idea with the strongest visible craft signal.
   - Reject ideas whose value is mainly backend logic, generic content, dashboards, or broad product scope.
   - The chosen idea must be understandable from a short screen recording.

4. **Prototype Spike**
   - Build the central interaction in isolation first.
   - Do not start by polishing metadata, navigation, or gallery integration.
   - Spend the first implementation pass on the hardest visual/interactive behavior.

5. **Craft Pass**
   - Improve motion timing, spacing, typography, responsive behavior, and control states.
   - Add reduced-motion handling for meaningful animation.
   - Avoid placeholder gradients, generic particles, or decorative noise unless they are the actual concept.

6. **Critique Gate**
   Before adding the experiment to the playground, answer:
   - Does the first screen look intentional?
   - Is there one memorable interaction?
   - Is the motion authored rather than accidental?
   - Does it demonstrate design-engineering skill?
   - Would it be worth recording for 10 seconds?
   - What is the weakest visual detail, and was it improved?

7. **Gallery Integration**
   - Add the experiment to the playground only after the critique gate.
   - Include title, date, tags, summary, concept, and route.
   - Keep the detail page in the fixed playground layout.

8. **Verification**
   - Run automated tests.
   - Run or provide the local preview command.
   - If browser tooling is available, capture or inspect the actual rendered result.

## Output Format For Daily Runs

When reporting back, include:

- References used, with links where available.
- Chosen idea and why it won.
- What was built.
- Critique notes: strongest detail, weakest detail, next improvement.
- Verification results.

## Hard Rules

- Do not ship the first generated idea without reference intake.
- Do not add an experiment to the gallery before the central interaction exists.
- Do not use Figma or Pencil in the default workflow.
- Do not call a prototype high-fidelity unless it passed the critique gate.
- Prefer one excellent interaction over three shallow features.

