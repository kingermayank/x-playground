#!/usr/bin/env bash
set -euo pipefail

python3 - <<'PY'
from pathlib import Path

skill = Path("/Users/mayankkinger/.codex/skills/craft-idea-scout/SKILL.md")
rubric = Path("/Users/mayankkinger/.codex/skills/craft-idea-scout/references/scout-rubric.md")
yaml = Path("/Users/mayankkinger/.codex/skills/craft-idea-scout/agents/openai.yaml")

skill_text = skill.read_text()
skill_text = skill_text.replace(
    "description: Creative project strategist for product designers, interaction designers, creative technologists, and design engineers. Use when generating, selecting, critiquing, or scoping creative experiments, interactive prototypes, visual systems, design tools, generative interfaces, data-driven artifacts, physical-digital experiments, or portfolio side projects, especially from references such as X posts, screenshots, videos, portfolios, product launches, art installations, GitHub projects, papers, or creative coding experiments.",
    "description: Creative project strategist for product designers, interaction designers, creative technologists, and design engineers. Use when generating, selecting, critiquing, or scoping creative experiments, interactive prototypes, motion studies, design-engineering artifacts, visual systems, design tools, generative interfaces, data-driven artifacts, physical-digital experiments, or portfolio side projects, especially from references such as X posts, screenshots, videos, portfolios, product launches, festivals, holidays, cultural moments, art installations, GitHub projects, papers, or creative coding experiments.",
)
skill_text = skill_text.replace(
    "- Make visual craft and engineering reinforce each other.\n- Scope around one memorable behavior.",
    "- Make visual craft and engineering reinforce each other.\n- Bias most ideas toward design engineering, interaction craft, and motion chops that can be judged from a short visual demo.\n- Scope around one memorable behavior.",
)
skill_text = skill_text.replace(
    "- Visual polish matters more than production-scale infrastructure.\n- The result should be easy to record, share, or add to a playground site.",
    "- Visual polish matters more than production-scale infrastructure.\n- Most ideas should demonstrate visible UI, motion, graphics, or interaction prowess rather than invisible infrastructure.\n- The result should be easy to record, share, or add to a playground site.",
)
old_workflow = """## Workflow

1. Identify the creative territory in one sentence.
2. Generate several conceptually different directions rather than minor variants.
3. For each direction, identify the central behavior that would make it memorable.
4. Define the smallest convincing version that proves the thesis.
5. Add one technical challenge that directly supports the concept.
6. Name stretch directions that deepen the thesis, not generic product features.
7. Explain the portfolio signal.
8. Select the strongest idea when enough context exists.

Read `references/scout-rubric.md` when the task involves reference analysis, scoring ideas, generating a large batch, adapting ideas to constraints, or selecting a daily project to build.
"""
new_workflow = """## Workflow

1. Identify the creative territory in one sentence.
2. Check for timely anchors: upcoming festivals, holidays, conferences, platform launches, product events, seasonal shifts, public rituals, or internet-cultural moments that could make the idea more relevant.
3. Apply the design-engineering lens: what visual behavior, motion system, interaction detail, or component craft would make this impressive in a 10-second clip?
4. Use a "what if" prompt when useful to unlock playful directions, then ground it in a buildable interaction.
5. Generate several conceptually different directions rather than minor variants.
6. For each direction, identify the central behavior that would make it memorable.
7. Define the smallest convincing version that proves the thesis.
8. Add one technical challenge that directly supports the concept.
9. Name stretch directions that deepen the thesis, not generic product features.
10. Explain the portfolio signal.
11. Select the strongest idea when enough context exists.

Read `references/scout-rubric.md` when the task involves reference analysis, event-aware generation, design-engineering/motion-heavy idea generation, scoring ideas, generating a large batch, adapting ideas to constraints, or selecting a daily project to build.

## Design Engineering And Motion Bias

Most ideas should feel like something a strong design engineer could post as a short demo: visually legible, technically crafted, and centered on interaction quality. Prioritize:

- Motion studies, tactile UI details, spatial transitions, generative surfaces, component experiments, layout physics, shader/canvas/WebGL/WebGPU sketches, and tool-like prototypes.
- One polished behavior over a broad product concept. Examples: a tab bar with physical tension, a file browser that folds by recency, a color picker with fluid memory, a design-token inspector with magnetic grouping.
- Ideas that reveal implementation taste: easing, timing, constraints, gesture handling, responsive behavior, rendering performance, and state visualization.
- "What if" prompts that produce visual hypotheses, such as "What if a dropdown had gravity?", "What if design tokens behaved like weather?", or "What if scrolling tuned a material?"

Avoid ideas whose main value would be backend logic, dashboards, CRUD workflows, generic AI chat, or written content unless the visible interaction system is the point.
"""
if old_workflow in skill_text:
    skill_text = skill_text.replace(old_workflow, new_workflow)
elif "## Design Engineering And Motion Bias" not in skill_text:
    motion_section = """## Design Engineering And Motion Bias

Most ideas should feel like something a strong design engineer could post as a short demo: visually legible, technically crafted, and centered on interaction quality. Prioritize:

- Motion studies, tactile UI details, spatial transitions, generative surfaces, component experiments, layout physics, shader/canvas/WebGL/WebGPU sketches, and tool-like prototypes.
- One polished behavior over a broad product concept. Examples: a tab bar with physical tension, a file browser that folds by recency, a color picker with fluid memory, a design-token inspector with magnetic grouping.
- Ideas that reveal implementation taste: easing, timing, constraints, gesture handling, responsive behavior, rendering performance, and state visualization.
- "What if" prompts that produce visual hypotheses, such as "What if a dropdown had gravity?", "What if design tokens behaved like weather?", or "What if scrolling tuned a material?"

Avoid ideas whose main value would be backend logic, dashboards, CRUD workflows, generic AI chat, or written content unless the visible interaction system is the point.

"""
    skill_text = skill_text.replace(
        "## Reference Analysis\n",
        f"{motion_section}## Reference Analysis\n",
    )
skill_text = skill_text.replace(
    "- Taste-matched exploration: infer visual qualities, interaction preferences, desired complexity, emotional tone, and technical interests from references.\n- Technology-led exploration:",
    "- Taste-matched exploration: infer visual qualities, interaction preferences, desired complexity, emotional tone, and technical interests from references.\n- Design-engineering exploration: produce motion-heavy UI components, interaction studies, visual systems, browser instruments, and polished demos that show craft quickly.\n- Event-aware exploration: use upcoming festivals, holidays, conferences, product launches, or cultural moments as creative constraints for timely experiments.\n- Technology-led exploration:",
)
skill_text = skill_text.replace(
    "### Central interaction\n\nDescribe the one behavior that should receive the most design and engineering attention.\n\n### Suggested stack",
    "### Central interaction\n\nDescribe the one behavior that should receive the most design and engineering attention.\n\n### Visual and motion proof\n\nDescribe what a viewer would notice in the first 10 seconds: motion quality, interaction response, rendering technique, layout transformation, or visual system.\n\n### Suggested stack",
)
skill.write_text(skill_text)

rubric_text = rubric.read_text()
rubric_text = rubric_text.replace(
    "- What makes the visual result distinctive?\n- What technical challenge gives the project substance?",
    "- What makes the visual result distinctive?\n- What motion, interaction, or visual craft would be obvious in a short demo?\n- What technical challenge gives the project substance?",
)
rubric_text = rubric_text.replace(
    "- Can a digital tool develop weight, inertia, and resistance?",
    "- Can a digital tool develop weight, inertia, and resistance?\n- What if an everyday component behaved like a physical, optical, or musical system?\n- What if a design tool made hidden constraints visible through motion?",
)
rubric_text = rubric_text.replace(
    "- I build interfaces with strong motion and spatial behavior.\n- I approach product design through experimentation.",
    "- I build interfaces with strong motion and spatial behavior.\n- I can make small interface details feel premium through motion, timing, and rendering craft.\n- I approach product design through experimentation.",
)
rubric_text = rubric_text.replace(
    "> A writing archive where notes exist in a magnetic semantic field. Moving one fragment causes related fragments to gather, separate, or form temporary constellations.",
    """> A writing archive where notes exist in a magnetic semantic field. Moving one fragment causes related fragments to gather, separate, or form temporary constellations.

For design-engineering and motion ideas, add:

> what-if prompt + component/system + motion behavior + implementation technique

Example:

- What-if prompt: What if a dropdown had gravity?
- Component/system: command menu
- Motion behavior: options fall into semantic clusters, then snap into keyboard focus
- Implementation technique: spring physics, FLIP layout, keyboard navigation

Result:

> A command menu where search results behave like weighted objects: they drop, cluster, and snap into focus while staying fully keyboard-accessible.""",
)
rubric_text = rubric_text.replace(
    "- Design-system experiment",
    "- Design-system experiment\n- Motion component study\n- Microinteraction prototype\n- Shader UI surface\n- Gesture playground\n- Scroll-driven visual system",
)
rubric_text = rubric_text.replace(
    "- Uncertainty appears as variation rather than a warning icon.",
    """- Uncertainty appears as variation rather than a warning icon.
- Interface parts stretch, snap, overshoot, settle, or resist input.
- Layouts morph continuously instead of swapping states.
- Scroll, drag, or pointer movement tunes a visible material.
- Components display hidden constraints through guides, tension, or collision.
- State changes leave useful trails, echoes, ghosts, or afterimages.

## Design Engineering And Motion Lens

Use this lens for most daily playground ideas and portfolio-side-project ideas:

- Start from an ordinary interface moment: hover, press, drag, sort, resize, search, command palette, carousel, tabs, timeline, upload, inspector, graph, map, dock, tooltip, dropdown, editor, canvas.
- Ask a playful "what if" question that changes the behavior: physical material, optical illusion, instrument, weather, magnetism, choreography, memory, pressure, gravity, liquid, folding, stitching, echo, decay.
- Pick one craft proof: spring timing, gesture handling, FLIP transitions, scroll-linked motion, shader effect, particle system, canvas/WebGL rendering, variable font axis, SVG filter, collision/constraint solver, sound-reactive feedback.
- Keep the first version visually recordable in 10 seconds and understandable without a long explanation.
- Include accessibility and control quality when the idea is UI-like: keyboard path, reduced motion fallback, clear focus, no layout shift.""",
)
rubric.write_text(rubric_text)

yaml_text = yaml.read_text()
yaml_text = yaml_text.replace(
    'short_description: "Generate distinctive design-engineering project ideas"',
    'short_description: "Generate motion-forward design-engineering project ideas"',
)
yaml.write_text(yaml_text)
PY

echo "Updated craft-idea-scout with design-engineering and motion-first idea generation."
