# WORKFLOW.md — FE-05 Prompting Drill

## Overview
The same feature (a settings form with validation) was built twice using two different prompting approaches to compare output quality, correctness, and review effort.

---

## Round One: Vague Prompt

**Prompt used:**
> "build a settings form with validation"

**Output:**
- Basic form with Name and Email fields only
- Used `useState` for form state — uncontrolled pattern
- Validation was a single `alert()` — no inline error messages
- No labels with `htmlFor` — accessibility failure
- No Bio field, no Notifications checkbox
- No CSS file — unstyled output

**Review effort:** High. The output was missing half the required
fields and had no real validation. Would need significant rewriting
before it could be used in a real project.

**AI mistake caught:** The vague prompt produced uncontrolled inputs
using `useState` directly on each field, which is an anti-pattern in
React forms. There was also no `htmlFor` on labels, meaning screen
readers could not associate labels with inputs — a clear
accessibility failure.

---

## Round Two: Precise Prompt

**Prompt used:**
Full prompt with:
- Named component (`SettingsForm.jsx`)
- Explicit fields (Full Name, Email, Bio, Notifications)
- Library constraints (`react-hook-form` + `zod`)
- Validation rules per field with exact error messages
- Accessibility requirement (semantic HTML, `htmlFor` + `id`)
- Separate CSS file constraint
- Example behavior for each validation case
- Verification step (write tests after component)

**Output:**
- All 4 fields present and correct
- `react-hook-form` + `zod` used correctly
- Inline error messages in red below each field
- Proper `htmlFor` / `id` pairing on all inputs
- Separate `SettingsForm.css` file
- Clean, readable component structure

**Review effort:** Low. Output was production-ready with minimal
changes needed. Only minor CSS tweaks were made.

---

## Diff Comparison

| Area | Round One | Round Two |
|---|---|---|
| Fields | 2 (Name, Email only) | 4 (Full Name, Email, Bio, Notifications) |
| Validation | `alert()` on submit | Inline zod schema, per-field errors |
| Form library | None (raw useState) | react-hook-form + zod |
| Accessibility | No htmlFor/id pairing | Full semantic HTML |
| Styling | No CSS file | Separate SettingsForm.css |
| Tests | None | Test file included |
| Review time | ~30 mins to fix | ~5 mins to verify |

---

## Key Lesson

Round two felt slower to set up (writing the full prompt took
5 minutes) but was faster end-to-end. Round one produced output
that looked done but needed 30+ minutes of fixing. The precise
prompt paid for itself immediately.

Vague prompts produce plausible-looking code that fails on the
details. Precise prompts with constraints, examples, and a
verification step produce code that is closer to production-ready
from the first output.

---

## One AI Mistake Caught

In Round One, the AI used uncontrolled `useState` inputs with no
`htmlFor` attributes on labels. This would fail both a code review
and a basic accessibility audit. It looked correct at a glance but
would not pass any real review standard.

---

## Time Comparison

| | Round One | Round Two |
|---|---|---|
| Prompt writing | 10 seconds | 5 minutes |
| AI output | 30 seconds | 45 seconds |
| Review + fixing | ~30 minutes | ~5 minutes |
| **Total** | **~31 minutes** | **~11 minutes** |