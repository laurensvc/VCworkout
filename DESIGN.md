# VC Workout Design System

## Creative North Star

**Luminous Training Instrument** — a focused, dark-only strength logger that borrows the calm precision and premium restraint of the approved mobile finance references without copying their banking metaphors. The interface should feel like a reliable instrument used between sets: one current task, one obvious action, and only meaningful states illuminated.

The concept seed is `a5976807`. Its night-flight interpretation contributes glanceable state changes, one truth per control, damped motion, and warm color reserved for exceptional records. It does not introduce literal gauges, cockpit ornament, or a competing visual world.

## Direction Contract

- **Thesis:** A luminous training instrument for fast set logging, refusing a generic fitness dashboard grid.
- **Own-world:** True-black field, charcoal plates, cool periwinkle actions, pale-cyan live information, and sparing warm-peach records.
- **Story:** Resume or choose a routine, record the current set beside prior truth, recover safely, then review history and progress.
- **First viewport:** Compact header, dominant start or resume plate, and ranked routine rail above shallow thumb navigation.
- **Form:** A current-exercise ledger with one truth per control and damped, functional motion.
- **Finish:** Store this design system and enforce it on every future change.

## Foundations

### Color

| Token | Value | Use |
| --- | --- | --- |
| `black` | `#000000` | Phone canvas and deepest backdrop |
| `ink` | `#050505` | Page canvas outside the phone surface |
| `surface` | `#121313` | Primary charcoal plates |
| `surface-raised` | `#1a1b1b` | Inputs and raised controls |
| `surface-active` | `#222326` | Pressed or selected neutral state |
| `line` | `#2b2d31` | Quiet separators and borders |
| `text` | `#f6f7fb` | Primary copy and numbers |
| `muted` | `#9a9ba4` | Secondary copy |
| `quiet` | `#8f919a` | Tertiary copy; retain WCAG contrast on black |
| `periwinkle` | `#c6d3ff` | Primary actions and focus rings |
| `periwinkle-ink` | `#121936` | Text/icons on periwinkle |
| `cyan` | `#cceff1` | Live timer, completed set, and information state |
| `peach` | `#ffd0ad` | Personal records only |
| `danger` | `#ffb4ae` | Destructive or failed states |

Do not add gradients, glass effects, or broad neon glow. Luminous borders and shadows belong only to active, completed, live, focus, or record states.

### Typography

- Operate with `Roboto, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`.
- Use tabular numerals for weights, reps, RIR, time, volume, and records.
- Prefer compact labels and large numeric values. Avoid ornamental display faces.
- Secondary text must remain at least 4.5:1 against its rendered background when it conveys information.

### Shape, Depth, and Spacing

- Base radius: `14px`; larger action plates and sheets may use stronger rounding.
- Depth is flat and tonal: black canvas, charcoal plate, raised charcoal control.
- Borders are subtle and stateful. Shadows are rare and low-spread.
- Minimum interactive target: `48px` in both dimensions.
- Respect `env(safe-area-inset-*)` at the viewport edges.

### Motion

- Functional transitions use `cubic-bezier(.16, 1, .3, 1)` and short durations.
- Motion communicates selection, completion, timer presence, or sheet entry; it does not decorate idle surfaces.
- Honor `prefers-reduced-motion` by removing nonessential animation and transition.

## Layout Doctrine

- Primary operating range is Android Chrome at `360–430px` wide.
- Larger viewports retain the same product and center a phone-sized surface with a `430px` ceiling. There is no desktop dashboard variant.
- Home, Routines, History, and Progress use shallow bottom navigation.
- Active Workout is full-screen and removes the bottom navigation.
- Keep the primary task above secondary analytics. Avoid card grids when a ranked list or ledger communicates the same content faster.

## Core Components

### Action Plates and Buttons

Periwinkle marks the main available action. Charcoal buttons are secondary. Cyan marks a live or completed state, not a second primary action. Destructive actions use danger text and require confirmation. Disabled actions remain legible but visually recessive.

### Set Ledger

The set ledger is the defining component. Keep `Set`, `Previous`, `kg`, `Reps`, `RIR`, and completion aligned in one row. Previous performance remains adjacent to the current input. Each numeric cell opens the large numeric sheet; do not compress multiple values into one editable field.

### Numeric and Finish Sheets

Sheets are modal, bottom-anchored, and keyboard complete: initial focus, Tab containment, Escape dismissal, and focus restoration are required. Numeric entry uses large values and generous increment/decrement controls. Finish shows a concise session summary, preserves the draft on write failure, and separates save, continue, and discard actions.

### Rest Dock

The rest timer is the single most luminous state. It uses pale cyan, tabular time, and one clear Skip action. Timestamp-derived time is authoritative so tab suspension cannot make the countdown drift.

### Records and Charts

Warm peach is reserved for record emphasis. Charts support the numeric summary and must not displace it. Empty analytics explain how to create the first eligible record.

## State Doctrine

- **Pending:** Keep the current context visible when possible and label the in-flight action.
- **Saved:** Use a quiet confirmation; do not celebrate routine writes.
- **Live/completed:** Use cyan and a restrained luminous boundary.
- **Record:** Use peach sparingly.
- **Validation:** Explain the valid input range beside the action that cannot proceed.
- **Write failure:** Preserve the local or historical truth, make the failure visible, and offer a direct retry.
- **Load failure:** Never present an error as an empty state. Explain that data remains protected and offer Retry.
- **Draft conflict:** Present the newer draft first and allow restoring the alternate copy.
- **Destructive action:** Require explicit confirmation and state what will be recalculated or lost.

## Accessibility and Content

- All icon-only controls need an accessible name.
- Focus uses a visible periwinkle ring with offset.
- Sheets must meet dialog keyboard expectations.
- Use concise, direct English and kilograms only.
- Avoid achievement language, trophies, streaks, and gamification. Progress is expressed as training evidence: sets, volume, heaviest weight, and estimated 1RM.

## Refusals

Do not introduce light mode, public social surfaces, glassmorphism, pervasive neon, gradient text, generic icon-card dashboards, desktop sidebars, decorative exercise imagery, trophy language, or literal aviation gauges. Future changes must preserve the current-exercise ledger, the one-state-at-a-time color hierarchy, and the centered mobile surface.
