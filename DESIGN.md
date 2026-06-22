---
version: alpha
name: FRYTG Digital
description: Personal site and blog for Daniel Freytag — dark forest-green canvas, high-contrast white type, and electric yellow interaction accents.
colors:
  primary: "#FFFFFF"
  secondary: "#3D4938"
  tertiary: "oklch(96.5% 0.243 110.2)"
  neutral: "#293126"
  background: "#293126"
  surface: "#171D15"
  on-tertiary: "{colors.secondary}"
  on-background: "{colors.primary}"
  muted: "#EBEAE2"
  accent-orange: "#F09139"
  accent-gray: "#D6E1CB"
typography:
  h1:
    fontFamily: InterVariable
    fontSize: 3rem
    fontWeight: 700
    lineHeight: 4.2rem
    letterSpacing: -0.025em
  h2:
    fontFamily: InterVariable
    fontSize: 2.25rem
    fontWeight: 700
    lineHeight: 3.5rem
    letterSpacing: -0.025em
  h3:
    fontFamily: InterVariable
    fontSize: 1.875rem
    fontWeight: 700
    lineHeight: 3.2rem
    letterSpacing: -0.025em
  body-lg:
    fontFamily: InterVariable
    fontSize: 1.125rem
    fontWeight: 400
    lineHeight: 2.2rem
  body-md:
    fontFamily: InterVariable
    fontSize: 1rem
    fontWeight: 400
    lineHeight: 1.5rem
  label-sm:
    fontFamily: InterVariable
    fontSize: 0.875rem
    fontWeight: 400
    lineHeight: 1.25rem
  nav-button:
    fontFamily: InterVariable
    fontSize: 1.125rem
    fontWeight: 900
    lineHeight: 2.2rem
  code-inline:
    fontFamily: ui-monospace
    fontSize: 1.125rem
    fontWeight: 400
rounded:
  none: 0px
spacing:
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 56px
components:
  nav-button:
    backgroundColor: transparent
    textColor: "{colors.on-background}"
    typography: nav-button
    rounded: "{rounded.none}"
    padding: 8px 12px
  nav-button-hover:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: nav-button
    rounded: "{rounded.none}"
    padding: 8px 12px
  nav-button-active:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: nav-button
    rounded: "{rounded.none}"
    padding: 8px 12px
  link-inline:
    backgroundColor: "{colors.tertiary}1A"
    textColor: "{colors.on-background}"
    typography: body-lg
    rounded: "{rounded.none}"
    padding: 4px 8px
  link-inline-hover:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
    typography: body-lg
    rounded: "{rounded.none}"
    padding: 4px 8px
  link-heading-hover:
    textColor: "{colors.tertiary}"
  code-inline:
    backgroundColor: "{colors.surface}"
    textColor: "{colors.on-background}"
    typography: code-inline
    rounded: "{rounded.none}"
    padding: 4px 8px
  blockquote:
    textColor: "{colors.on-background}"
    typography: body-lg
    padding: 0 0 0 16px
  selection:
    backgroundColor: "{colors.tertiary}"
    textColor: "{colors.on-tertiary}"
---

## Overview

FRYTG Digital is Daniel Freytag's personal site and blog — a minimalist, text-first experience for documenting DevOps work, hybrid-athlete training, and everyday life. The visual identity reads as **editorial dark mode**: a deep forest-green canvas, crisp white prose, and a single high-voltage yellow accent that signals every interactive moment.

The aesthetic is intentionally utilitarian. No cards, shadows, or decorative chrome. Content is centered in a readable column, navigation is a flat row of text buttons, and emphasis comes from weight, underline, and background tints rather than borders or gradients. The tone is personal but precise — a builder's notebook, not a marketing landing page.

Built with Hugo, Tailwind CSS v4, and Inter Variable. Design tokens live in `assets/css/main.css` under `@theme` and are applied through Tailwind utility classes and a small set of custom base-layer rules.

## Colors

The palette is a tight set of desaturated greens anchored by one electric yellow accent. Orange and sage gray exist in the token set but are rarely used on-page.

- **Primary (#FFFFFF):** Body text, headings, and all foreground content on the dark canvas.
- **Secondary (#3D4938):** "Greeny" — text on yellow surfaces (buttons, selection, hover states). Provides enough contrast against the bright accent without feeling harsh.
- **Tertiary (oklch yellow):** The sole interaction driver. Used for nav button fills, link hover backgrounds, blockquote borders, text selection, and heading link hovers.
- **Neutral (#293126):** "Mid dark greeny" — page background and browser theme color. The ambient environment everything sits on.
- **Background (#293126):** Same as neutral; applied to `<html>` as `bg-mid-dark-greeny`.
- **Surface (#171D15):** "Dark greeny" — inline code backgrounds and bold-text highlight tints (`bg-dark-greeny/40`).
- **Muted (#EBEAE2):** Warm off-white token (`white` in Tailwind theme). Available but not the default page background.
- **Accent Orange (#F09139) / Accent Gray (#D6E1CB):** Secondary palette tokens reserved for future use; not part of the core interaction pattern.

Contrast is high by design: white on `#293126` for reading, greeny on yellow for active controls. Yellow-on-greeny for selection mirrors the nav button active state.

## Typography

**Inter Variable** (`InterVariable`, sans-serif) is the only typeface. Loaded via `inter-ui/inter-variable-latin.css` in `assets/css/fonts.scss`.

| Role | Size (desktop) | Weight | Notes |
|:-----|:---------------|:-------|:------|
| H1 | 3.75rem (`text-6xl`) | Bold (700) | Scales from 3rem on mobile. `text-balance`, `tracking-tight`. |
| H2 | 3rem (`text-5xl`) | Bold | Blog list titles override to `text-2xl sm:text-4xl`. |
| H3–H6 | 1.875rem → 1.25rem | Bold | Stepped down one level each. |
| Body | 1.125rem (`text-lg`) | Normal (400) | Default for `p`, `ul`, `li`. |
| Metadata | 0.875rem (`text-sm`) | Normal, italic | Dates, RSS, footer, tags. |
| Nav buttons | 1.125rem / 1rem | Black (900) | Responsive sizing via `text-base sm:text-lg`. |
| Inline code | 1.125rem | Normal, monospace | `font-mono` on dark surface background. |

Headings, `.title-style` blocks, and code blocks share a **two-thirds column** (`lg:w-2/3 lg:mx-auto`) at large breakpoints. Paragraphs and lists follow the same width constraint for consistent reading measure (~66 characters).

Heading anchor links append a `#` pseudo-element (`anchor-link`) at 50% opacity — a subtle wayfinding affordance, not a visible button.

## Layout

Content flows in a single centered column inside `.container.container-custom`:

- **Horizontal padding:** 16px on mobile (`px-4`), none on large screens (`lg:px-0`).
- **Vertical rhythm:** 24px container margin (`my-6`); paragraphs spaced with 16px vertical margin (`my-4`).
- **Reading width:** Full width on mobile; headings and body constrained to 66% (`lg:w-2/3`) and centered on large screens.
- **Navigation:** Horizontal flex row, wrapping, centered on `sm+`. Site owner name ("Daniel Freytag") appears as a non-interactive label; menu items are flat text buttons with generous gap (`gap-2`).
- **Footer:** Stacked, centered column — logo, social links, legal, attribution. Uses `text-sm` throughout.
- **Blog posts:** Title, italic date, content, horizontal rule, then connect/license/tags sections.
- **Images:** Full-width responsive `<picture>` elements via the `pic` shortcode; lazy-loaded with WebP srcset at 960–3840px breakpoints.

No sidebar, no grid beyond the nav flex row and footer stack. The layout prioritizes reading flow over information density.

## Elevation & Depth

This design system deliberately avoids elevation. There are no box shadows, no layered cards, and no z-index stacking contexts beyond normal document flow.

Depth is communicated through:

- **Background tints** — 10% yellow on inline links, 40% dark-greeny on bold text in `.container-bold` posts.
- **Opacity** — blockquotes at 90% opacity; anchor links at 50%; horizontal rules at 80%.
- **Color inversion on hover** — transparent → yellow fill with greeny text, creating a flat "lift" without shadow.

If a future component needs hierarchy, prefer background tint shifts or the yellow accent over shadows or borders.

## Shapes

The UI is **rectilinear and flush**. Border radius is effectively zero across buttons, links, code blocks, and images. The only recurring shape language is:

- **Horizontal rule:** 33% width, centered, top border only (`w-1/3 mx-auto border-t`), used as a post-content separator.
- **Blockquote:** 2px left border in yellow (`border-l-2 border-yellow`), no rounded corners.
- **Inline highlights:** Rectangular padding blocks on links and bold text — no pill shapes.

Avoid introducing rounded corners unless a component genuinely needs them (e.g., avatars). The current identity is sharp and editorial.

## Components

### Navigation buttons (`.clickable-button`)

Flat text buttons in the top nav. Default state is transparent with white text and `font-black` weight. Hover fills with yellow and flips text to greeny. Active/current page uses the filled yellow state persistently (`.clickable-button-active`). Ancestor pages use the same filled style (`.clickable-button-ancestor`).

The site owner label (`.clickable-button-inactive`) uses normal weight and is not interactive.

### Inline text links

Links inside paragraphs and lists get an underline, light yellow background tint (`bg-yellow/10`), and rectangular padding. Hover inverts to full yellow background with greeny text. Links containing images or code, plus footer links, are excluded from this treatment.

Heading links hover to yellow text only — no background tint.

### Inline code (`code:not(pre code)`)

Monospace on `#171D15` background with horizontal padding. When wrapped in a link, gains underline and the same yellow/greeny hover inversion as text links.

### Blockquotes

Left yellow border, italic body text, slightly reduced opacity. Nested headings and paragraphs stay full width within the quote.

### Bold emphasis (`.container-bold`)

When a page sets `highlight_bold: true`, `<strong>` elements inside paragraphs get a semi-transparent dark-greeny background with bold weight — a highlight marker effect for key phrases.

### Text selection

Browser selection uses yellow background with greeny text (`selection:bg-yellow selection:text-greeny`), matching the nav button active state.

### Footer

Centered stack of small text blocks with emoji prefixes (✨, 🍪). Social links use the standard inline link styling. Attribution includes an inline SVG logo at 48px width.

## Do's and Don'ts

**Do:**

- Keep the dark green canvas (`#293126`) as the default environment for all pages.
- Use yellow exclusively for interaction feedback — hover, active, selection, blockquote accent.
- Constrain long-form content to the two-thirds centered column on large screens.
- Use Inter Variable at `text-lg` for body copy; reserve `text-sm italic` for metadata.
- Apply `text-balance` and `tracking-tight` on headings for even line breaks.
- Use flat, borderless buttons with font-weight 900 for navigation.
- Prefer background tints over borders or shadows for emphasis.

**Don't:**

- Introduce additional accent colors for CTAs — yellow is the only interaction color.
- Add card layouts, drop shadows, or rounded pill buttons — they conflict with the editorial flatness.
- Use pure white (`#FFFFFF`) as a page background; the identity is dark-mode-first.
- Style footer or image/code links with the yellow background tint — those are explicitly excluded.
- Over-decorate navigation with icons, dividers, or dropdowns — the nav is a simple text row.
- Reduce body text below 1.125rem for main content; readability is a core value.
