# KodNest Premium Build System

Design system for a serious B2C product. Calm, intentional, coherent, confident.

---

## Design philosophy

- **Calm, intentional, coherent, confident**
- No gradients, glassmorphism, neon, or animation noise
- One mind; no visual drift

---

## Color system (4 colors only)

| Token | Value | Use |
|-------|--------|-----|
| `--kn-background` | `#F7F6F3` | Page and surface |
| `--kn-text` | `#111111` | Primary text |
| `--kn-accent` | `#8B0000` | CTAs, focus, links |
| `--kn-muted` | `#5C6B5A` | Status (shipped, in progress), semantic |

Semantic: `--kn-text-muted`, `--kn-border`, `--kn-border-focus` (derived from above).

---

## Typography

- **Headings:** `var(--kn-font-serif)` — Georgia, large, confident, generous spacing. Classes: `.kn-heading-1`, `.kn-heading-2`, `.kn-heading-3`.
- **Body:** `var(--kn-font-sans)` — 16–18px, line-height 1.6–1.8. Classes: `.kn-body`, `.kn-body-lg`. Max width for text blocks: `720px` (`--kn-text-max-width`).
- **Subtext:** `.kn-subtext` — muted, one-line purpose.

---

## Spacing (only this scale)

`8px` · `16px` · `24px` · `40px` · `64px`  
Tokens: `--kn-space-1` … `--kn-space-5`. Never use arbitrary values (e.g. 13px, 27px).

---

## Global layout structure

Every page must follow:

1. **Top Bar** — Left: project name · Center: Step X / Y · Right: status badge (Not Started / In Progress / Shipped).
2. **Context Header** — Large serif headline + one-line subtext; clear purpose, no hype.
3. **Primary Workspace (70%)** — Main interaction; clean cards, predictable components.
4. **Secondary Panel (30%)** — Step explanation, copyable prompt box, actions: Copy, Build in Lovable, It Worked, Error, Add Screenshot.
5. **Proof Footer** — Persistent. Checklist: □ UI Built □ Logic Working □ Test Passed □ Deployed; each requires user proof.

**Classes:** `.kn-app` → `.kn-topbar` → `.kn-context-header` → `.kn-main` (`.kn-workspace` + `.kn-panel`) → `.kn-proof-footer`.

---

## Components

- **Primary button:** `.kn-btn.kn-btn--primary` — solid deep red. **Secondary:** `.kn-btn.kn-btn--secondary` — outlined. Same hover (180ms ease-in-out) and radius (`--kn-radius`) everywhere.
- **Inputs:** `.kn-input`, `.kn-textarea` — clean border, no heavy shadow, clear focus (accent border).
- **Cards:** `.kn-card` — subtle border, no drop shadow, padding from spacing scale.
- **Badges:** `.kn-badge`, `.kn-badge--not-started`, `.kn-badge--progress`, `.kn-badge--shipped`.
- **Panel:** `.kn-panel__title`, `.kn-panel__step`, `.kn-prompt-box`, `.kn-panel__actions`.
- **Error:** `.kn-error`, `.kn-error__title`, `.kn-error__fix` — what went wrong + how to fix; never blame user.
- **Empty:** `.kn-empty`, `.kn-empty__action` — next action, never dead.

---

## Interaction

- Transitions: **150–200ms**, **ease-in-out**. No bounce, no parallax. Token: `--kn-transition`.

---

## Usage

```html
<link rel="stylesheet" href="design-system/index.css" />
```

Then use layout and component classes as in this spec. No product features are defined in the design system; it is structure and style only.
