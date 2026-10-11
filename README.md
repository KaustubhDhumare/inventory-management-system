# Inventory Management System — Frontend Design System v2 (Premium Dark)

This document replaces the earlier slate/indigo light-theme guide. It is the **source of truth for visual style, components, layout and UX**.

Priority when sources conflict:

- **API paths, fields, validation, authorization, business rules** → backend code, then `FRONTEND_SPEC.md`.
- **Look, feel, layout, motion, component behaviour** → this document (and the redesign prompt).
- **Analytics** → only what real data supports. Never fabricate numbers (see §9).

Design goal: a **premium, slightly futuristic dark SaaS platform** that is still practical for daily inventory work. Atmosphere comes from layered dark surfaces; hierarchy comes from selective accent colour.

---

## 1. Tech Stack

| Concern | Choice |
|---|---|
| Framework | React 18 + Vite (JSX) |
| Styling | Tailwind CSS v3 + CSS variables (all tokens centralised) |
| Routing | React Router v6 |
| HTTP | Axios central client (`withCredentials: true`, refresh interceptor) |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Icons | `lucide-react` |
| Toasts | `sonner` |
| Dates | `date-fns` |
| Fonts | **Inter** (UI) + **JetBrains Mono** (SKU, PO numbers, IDs) |

No heavy UI kits. Components are hand-built so the product has its own identity.

---

## 2. Design Principles

1. **Atmosphere through layering** — app bg < sidebar < panel < elevated; separation by tone and hairline borders, not heavy shadows.
2. **Accent is a signal** — indigo/violet and cyan mark active, key, interactive. Everything else is neutral.
3. **Status colours are reserved** — green, amber, red only for real inventory conditions.
4. **Density with air** — compact tables and cards, but consistent spacing and clear grouping.
5. **Motion is feedback** — 120–250 ms, purposeful, respects `prefers-reduced-motion`.
6. **Honest data** — no invented trends, no sample data in production views, no controls that do nothing.

Avoid: neon glow overload, random gradients, glass-on-everything, oversized radii, parallax, bouncing animations, a different colour per widget.

---

## 3. Design Tokens

### 3.1 Dark theme (default)

All tokens live as CSS variables in `src/styles/index.css` and are mapped in `tailwind.config.js`.

| Token | Value | Usage |
|---|---|---|
| `--bg-app` | `#0B1020` | App background |
| `--bg-sidebar` | `#10172A` | Sidebar, topbar |
| `--bg-panel` | `#151E32` | Cards, tables, panels |
| `--bg-elevated` | `#1C2740` | Dropdowns, modals, hover rows, inputs |
| `--bg-input` | `#0F1729` | Input fields (slightly recessed) |
| `--border` | `#26324D` | Default hairline borders |
| `--border-strong` | `#34436A` | Input hover, emphasised borders |
| `--text-primary` | `#F1F5FF` | Headings, key values |
| `--text-secondary` | `#A1AEC5` | Body, labels |
| `--text-muted` | `#7F8CA6` | Placeholders, hints, timestamps |
| `--accent` | `#7567F8` | Active nav, links, chart series 1, focus ring |
| `--accent-solid` | `#6556F0` | Solid primary button background (white text ≥ 5:1) |
| `--accent-hover` | `#7A6EF7` | Primary hover |
| `--accent-soft` | `rgb(117 103 248 / 0.14)` | Active nav bg, selected states |
| `--accent-2` | `#35C9E7` | Secondary accent, chart series 2, info |
| `--success` | `#34D399` | Positive / in stock / completed |
| `--warning` | `#FBBF24` | Low stock / pending |
| `--danger` | `#F87171` | Out of stock / destructive / errors |
| `--danger-solid` | `#DC2626` | Solid destructive button |

> Contrast notes: `#7567F8` on dark panels passes for text and graphics; **solid buttons use `--accent-solid`** because white on `#7567F8` is only ~4.1:1. Re-verify any colour you change (target ≥ 4.5:1 for text, ≥ 3:1 for UI graphics).

### 3.2 Light theme (optional, after dark is complete)

Implement by overriding the **same variables** under `[data-theme="light"]` — no duplicated components.

| Token | Light value |
|---|---|
| `--bg-app` | `#F4F6FB` |
| `--bg-sidebar` | `#FFFFFF` |
| `--bg-panel` | `#FFFFFF` |
| `--bg-elevated` | `#F1F4FA` |
| `--bg-input` | `#FFFFFF` |
| `--border` | `#E1E6F0` |
| `--text-primary` | `#0E1530` |
| `--text-secondary` | `#4A5775` |
| `--text-muted` | `#76829E` |
| `--accent` | `#5B4DE0` |
| `--success` / `--warning` / `--danger` | `#059669` / `#B45309` / `#DC2626` |

Toggle stored in a **cookie-free, non-sensitive** preference (`localStorage` key `theme` is acceptable — it is not an auth token). Default to dark; honour `prefers-color-scheme` only on first visit.

### 3.3 CSS variables

```css
/* src/styles/index.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-app: #0B1020;
  --bg-sidebar: #10172A;
  --bg-panel: #151E32;
  --bg-elevated: #1C2740;
  --bg-input: #0F1729;
  --border: #26324D;
  --border-strong: #34436A;
  --text-primary: #F1F5FF;
  --text-secondary: #A1AEC5;
  --text-muted: #7F8CA6;
  --accent: #7567F8;
  --accent-solid: #6556F0;
  --accent-hover: #7A6EF7;
  --accent-soft: rgb(117 103 248 / 0.14);
  --accent-2: #35C9E7;
  --success: #34D399;
  --warning: #FBBF24;
  --danger: #F87171;
  --danger-solid: #DC2626;
  --shadow-panel: 0 1px 0 0 rgb(255 255 255 / 0.03) inset, 0 8px 24px -12px rgb(0 0 0 / 0.5);
  --shadow-pop: 0 16px 40px -12px rgb(0 0 0 / 0.65);
  --ease: cubic-bezier(0.2, 0.8, 0.2, 1);
  --dur-fast: 120ms;
  --dur-base: 200ms;
  --dur-slow: 280ms;
}

[data-theme="light"] { /* overrides from §3.2 */ }

@layer base {
  html { font-family: Inter, ui-sans-serif, system-ui, sans-serif; color-scheme: dark; }
  [data-theme="light"] html, html[data-theme="light"] { color-scheme: light; }
  body { background: var(--bg-app); color: var(--text-secondary); font-size: 14px; -webkit-font-smoothing: antialiased; }
  h1,h2,h3 { color: var(--text-primary); }
  :focus-visible { outline: 2px solid var(--accent-2); outline-offset: 2px; border-radius: 6px; }
  ::selection { background: var(--accent-soft); }
  /* subtle dark scrollbars */
  * { scrollbar-width: thin; scrollbar-color: var(--border-strong) transparent; }
}

@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
}
```

### 3.4 Tailwind mapping

```js
// tailwind.config.js
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  darkMode: ["selector", '[data-theme="dark"]'],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        app: "var(--bg-app)",
        sidebar: "var(--bg-sidebar)",
        panel: "var(--bg-panel)",
        elevated: "var(--bg-elevated)",
        input: "var(--bg-input)",
        line: "var(--border)",
        "line-strong": "var(--border-strong)",
        ink: { DEFAULT: "var(--text-primary)", 2: "var(--text-secondary)", 3: "var(--text-muted)" },
        accent: { DEFAULT: "var(--accent)", solid: "var(--accent-solid)", hover: "var(--accent-hover)", soft: "var(--accent-soft)", 2: "var(--accent-2)" },
        ok: "var(--success)", warn: "var(--warning)", bad: "var(--danger)",
      },
      borderRadius: { lg: "8px", xl: "12px", "2xl": "14px" },
      boxShadow: { panel: "var(--shadow-panel)", pop: "var(--shadow-pop)" },
      transitionTimingFunction: { app: "var(--ease)" },
      keyframes: {
        "fade-up": { from: { opacity: 0, transform: "translateY(6px)" }, to: { opacity: 1, transform: "none" } },
        "pop-in": { from: { opacity: 0, transform: "scale(.97)" }, to: { opacity: 1, transform: "none" } },
        shimmer: { "100%": { transform: "translateX(100%)" } },
      },
      animation: { "fade-up": "fade-up .25s var(--ease) both", "pop-in": "pop-in .2s var(--ease) both" },
    },
  },
};
```

### 3.5 Typography

| Role | Spec |
|---|---|
| Page title | `text-2xl font-semibold tracking-tight text-ink` |
| Section / panel title | `text-sm font-semibold text-ink` (+ muted description `text-xs text-ink-3`) |
| Body | `text-sm text-ink-2` |
| Meta | `text-xs text-ink-3` |
| KPI value | `text-3xl font-semibold tracking-tight text-ink tabular-nums` |
| Table header | `text-[11px] font-semibold uppercase tracking-wider text-ink-3` |
| Mono (SKU, PO#) | `font-mono text-[13px] text-ink-2` |

Always use `tabular-nums` on quantities, prices and chart axes.

### 3.6 Spacing, radius, elevation

- 4 px grid. Panels `p-5` (`p-4` mobile). Grid gaps `gap-4` / `gap-5`. Page container `max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-6`.
- Radius: controls `rounded-lg` (8), panels `rounded-xl` (12), badges `rounded-full`. Nothing larger.
- Panels: `bg-panel border border-line shadow-panel`. Dropdowns/modals: `bg-elevated border border-line-strong shadow-pop`.
- Atmosphere (optional, subtle): a single fixed radial glow behind the app — `radial-gradient(60rem 30rem at 80% -10%, rgb(117 103 248 / .12), transparent 60%)` on the main wrapper. One only, low opacity, not animated.

---

## 4. Application Shell

```
┌────────────────┬───────────────────────────────────────────┐
│ Sidebar 264px  │ Topbar 64px (sticky, blurred bg-sidebar)  │
│ bg-sidebar     ├───────────────────────────────────────────┤
│ border-r       │ Main (scrolls)                            │
└────────────────┴───────────────────────────────────────────┘
```

### Sidebar
- **Brand:** 32 px rounded-lg mark (accent-solid bg, `Boxes` icon white) + "StockPilot" (`font-semibold text-ink`), tiny muted "Inventory" tag beneath.
- **Groups:** `OVERVIEW` (Dashboard) · `CATALOG` (Products, Categories, Suppliers) · `OPERATIONS` (Purchase Orders, Inventory, Transactions). Group labels `text-[11px] uppercase tracking-wider text-ink-3 px-3 mb-1`.
- **Item:** `h-10 px-3 rounded-lg flex items-center gap-3 text-ink-2`; hover `bg-elevated/60 text-ink`; transition colours 120 ms.
- **Active:** `bg-accent-soft text-ink`, icon `text-accent`, a 3 px × 18 px accent bar at the left edge (absolute, rounded). No glow.
- **Footer:** hairline divider, user card (avatar, name, role badge) with logout icon button (confirm dialog).
- Admin-only items hidden for employees.
- **Mobile (<1024 px):** off-canvas drawer, `translate-x` 250 ms, backdrop `bg-black/60`, focus trap, Esc/backdrop/route-change closes, `aria-modal`.

### Topbar
- Left: hamburger (mobile) + breadcrumb/page title.
- Center/right: global search **only if** a real search behaviour exists (e.g., command palette searching products via the product search endpoint). Otherwise omit.
- Notifications bell **only if** backed by real data (e.g., low-stock count from dashboard linking to `/products` filtered). Otherwise omit.
- Right: theme toggle (if implemented), user menu (avatar initials, name, role) → Profile, Logout.
- Background `bg-sidebar/80 backdrop-blur` with bottom hairline (the only blur used).

### Auth layout
- Full-screen `bg-app`, two columns on `lg`: **left brand panel** (`bg-sidebar`, logo, headline "Know exactly what's on your shelves.", three quiet feature lines with icons, a decorative abstract grid/dots pattern in CSS at ≤ 8 % opacity — no stock imagery); **right** form panel centred (`max-w-sm`).
- Inputs per §5.2; submit full-width accent button; backend error banner above form; link to alternate auth page.
- Mobile: brand panel collapses to a compact logo header.

---

## 5. Component Library

### 5.1 Buttons
| Variant | Style |
|---|---|
| primary | `bg-accent-solid text-white hover:bg-accent-hover` |
| secondary | `bg-elevated border border-line-strong text-ink hover:bg-[#222E4D]` |
| ghost | `text-ink-2 hover:bg-elevated hover:text-ink` |
| danger | `bg-danger-solid text-white hover:bg-red-500` |
| danger-soft | `border border-bad/40 text-bad hover:bg-bad/10` |

Sizes `sm h-8`, `md h-10`, `lg h-11`; `rounded-lg font-medium text-sm`; `active:scale-[.98]`; `loading` prop shows spinner and disables without changing width. Icon buttons are `h-9 w-9` with required `aria-label`.

### 5.2 Inputs
- `h-10 rounded-lg bg-input border border-line text-ink placeholder:text-ink-3 px-3 text-sm`.
- Hover `border-line-strong`; focus `border-accent ring-2 ring-accent/25`; error `border-bad ring-bad/20` + `text-xs text-bad` message; disabled `opacity-60 cursor-not-allowed`.
- Labels `text-xs font-medium text-ink-2` above; required `*` in `text-bad`; hints `text-xs text-ink-3`.
- **Combobox** (searchable select) for Category / Supplier / Product: panel `bg-elevated`, keyboard navigable, shows name + secondary (SKU), submits `_id`.
- Textarea with counter for max-length remarks. Password with show/hide toggle. Segmented control for Increase/Decrease and role.

### 5.3 Panel (card)
`bg-panel border border-line rounded-xl shadow-panel`. Header row `px-5 py-4 border-b border-line` with title, optional description and right-aligned actions. Interactive panels: hover `border-line-strong` + `-translate-y-px` (150 ms).

### 5.4 KPI card
```
┌───────────────────────────────┐
│ Total Products          [icon]│  label text-xs uppercase muted · 32px icon chip
│ 1,284                         │  text-3xl tabular-nums
│ 1,190 active                  │  optional context, text-xs muted
└───────────────────────────────┘
```
- Icon chip: `h-9 w-9 rounded-lg` using `bg-{tone}/12 text-{tone}`; tones: indigo (products), cyan (suppliers/categories), green (value, active), amber (low stock), red (out of stock), violet (POs).
- Optional 1 px top accent line in the tone colour at 60 % opacity. Card body stays neutral.
- Count-up animation on first load (≤ 600 ms, skipped on reduced motion).
- **Trend chips (▲/▼ %) only when real comparison data exists.** Otherwise show contextual text from real fields (e.g., "of 1,284 total").
- Low/Out-of-stock cards link to `/products?stock=low|out` **only if the products API supports that filter**; otherwise render non-interactive.

### 5.4a Badges (central map: `constants/badges.js`)
Pill `rounded-full px-2.5 py-0.5 text-xs font-medium` with `bg-{c}/12 text-{c} ring-1 ring-inset ring-{c}/25` and optional 6 px dot.

| Domain | Value → colour |
|---|---|
| Stock | In Stock → success · Low Stock → warning · Out of Stock → danger |
| Product | Active → success · Inactive → slate (`#94A3B8`) |
| PO status | `PENDING` → warning · `PARTIALLY_RECEIVED` → accent-2 (cyan) · `COMPLETED` → success · `CANCELLED` → slate |
| Transaction | `PURCHASE` → accent (indigo) · `SALE` → success · `RETURN` → accent-2 (cyan) · `ADJUSTMENT` → violet `#A78BFA` · `DAMAGE` → danger |
| Role | admin → accent · employee → slate |

Transaction icons: `PackagePlus`, `ShoppingCart`, `Undo2`, `SlidersHorizontal`, `AlertTriangle`. Humanise enums ("Partially Received"). Colour is never the only signal — labels always present.

### 5.5 Data table
- Panel wrapper, `overflow-x-auto`. Header `bg-elevated/50 text-[11px] uppercase tracking-wider text-ink-3`.
- Rows `h-14`, `border-b border-line/60`, hover `bg-elevated/50`, optional selected `bg-accent-soft`.
- Primary cell: name `text-ink font-medium` + SKU `font-mono text-xs text-ink-3` beneath. Numeric columns right-aligned.
- Row actions: icon buttons revealed at full opacity on row hover/focus (always visible on touch).
- **< 768 px:** rows become stacked cards (title + badge, 2-col key/value grid, actions).
- Skeleton rows with shimmer while loading.

### 5.6 Modals / confirm dialogs
`bg-elevated border border-line-strong rounded-xl shadow-pop`, `max-w-md`, `animate-pop-in`, backdrop `bg-black/60`, focus trapped, Esc closes, returns focus. Destructive dialogs: red icon chip, consequence sentence, `Cancel` + named danger button. Stock-impacting dialogs state the effect ("This will reduce Acer Monitor from 20 → 18").

### 5.7 Toasts
`sonner` themed to `bg-elevated border-line-strong text-ink`; success/err icons use status colours; 4 s (errors 6 s).

### 5.8 States
- **Loading:** skeletons matching final layout; shimmer `bg-elevated` with moving highlight; chart skeleton = faint axis lines.
- **Empty:** centred icon in a soft circle, title, one-line help, primary CTA. Filtered-empty offers "Clear filters".
- **Error:** `AlertCircle` in `text-bad`, friendly message, Retry button.
- **403 / 404:** full-panel pages with return-to-dashboard link.

### 5.9 Pagination, toolbar, avatar, banner
Same behaviour as v1 (see FRONTEND_SPEC), restyled with dark tokens. Search input debounced 300 ms with `Search` icon; filters collapse into a drawer on mobile; page/filters stored in URL query. Avatar: circle `bg-accent-soft text-accent` initials. Form banners: `bg-bad/10 border border-bad/30 text-bad` (info: cyan).

### 5.10 Chart container component (`ChartCard`)
Props: `title`, `description`, `actions` (range select), `loading`, `error`, `empty`, `children`. Renders skeleton / retry / empty state consistently. Fixed min-height to prevent layout shift (e.g., 280 px).

---

## 6. Dashboard Specification

### 6.1 Layout (desktop ≥ 1280 px, 12-col grid, `gap-5`)

```
Header: "Dashboard" · welcome · [range select*] [Refresh]
─────────────────────────────────────────────────────────────
Row 1  KPI ×4 (3 cols each):  Total Products | Active Products | Low Stock | Out of Stock
Row 2  KPI ×4 (3 cols each):  Inventory Value | Pending POs | Partially Received POs | Suppliers / Categories
Row 3  Inventory Movement chart (8 cols)       | Stock Health donut (4 cols)
Row 4  Inventory Alerts / low stock list (5)   | Recent Transactions (7)
Row 5  Recent Purchase Orders (12)
```
Tablet: 2-column grid, charts full width stacked. Mobile: single column, KPI cards in a 2×N compact grid, tables → cards. Reorder blocks if viewport makes another arrangement more readable; keep alerts above the fold on mobile.

\* Range select and Refresh render **only when functional.** Refresh = refetch dashboard + chart data with spinner on the icon.

### 6.2 Header
"Welcome back, {firstName}" (muted) over page title; one-line description "Inventory health, stock movement and purchasing at a glance." Last-updated timestamp from fetch time.

### 6.3 KPI sources (all from `GET /api/v1/dashboard`)
`inventory.totalProducts`, `activeProducts`, `lowStockProducts`, `outOfStockProducts`, `inventoryValue` (formatted currency), `pendingPurchaseOrders`, `partiallyReceivedPurchaseOrders`, `totalSuppliers`, `totalCategories`.

### 6.4 Inventory Movement (area/line chart)
- Recharts `AreaChart` with 1.5–2 px strokes and 12–18 % gradient fill under each series (the only gradient use; flat colours at low opacity).
- Series & colours: **Purchases** `#7567F8`, **Sales** `#34D399`, **Returns** `#35C9E7`, **Adjustments** `#A78BFA`; **Damage** `#F87171` optional. Only series the data reliably provides.
- Y-axis = units moved per period (not mixed with currency). X-axis = date buckets (`dd MMM`). Grid: horizontal dashed `var(--border)` at 60 % opacity; axes text `#7F8CA6` 11 px.
- Tooltip: `bg-elevated` panel with date, then each series name, colour dot, exact value. Legend above chart, clickable to toggle series.
- Entrance: Recharts animation ≤ 600 ms, disabled when reduced motion.
- Range options (7 / 30 / 90 days) shown **only if** data source supports them.
- Data source: see §9. If unavailable → ChartCard empty state with message "Movement analytics need a backend aggregation endpoint." in dev only; in production simply show a clear empty/unavailable state.

### 6.5 Stock Health Donut
- Primary chart: **In Stock / Low Stock / Out of Stock** by product **count**.
- Derivation: `outOfStock = inventory.outOfStockProducts`, `low = inventory.lowStockProducts`, `inStock = totalProducts − low − out` — **only after confirming in backend code that low and out-of-stock sets are disjoint** (spec: quantity 0 → out, `quantity ≤ minimumStock` → low). If they overlap or inactive products are excluded differently, fix the formula or add a backend field.
- Colours: success / warning / danger. Donut `innerRadius ~68%`, `paddingAngle 2`, no stroke. Centre text: total products + "products". Legend with count and share (`count / total`), tooltips with exact counts. Zero total → empty state.
- Secondary (optional tab/segmented control): **Products by category** (counts) or **Inventory value by category** (currency) — separate charts, never mixed. Uses accent-coordinated palette: `#7567F8 #35C9E7 #34D399 #FBBF24 #A78BFA #F87171 #60A5FA #94A3B8` ("Other" bucket beyond 6 items). Requires category aggregation (see §9).

### 6.6 Inventory Alerts panel
- Header shows counts: amber chip "N low", red chip "N out".
- List of at-risk products: name, SKU, `quantity / minimumStock` with a thin progress bar (amber < 100 %, red at 0), link to `/products/:id`. Show up to 6, with "View all products".
- Source: product list filtered client-side from a supported products query (e.g., fetch with enough page size or a supported low-stock filter). If only the first page is loaded, label accordingly ("Showing items from the latest {n} products") or request a backend filter (§9). Do not claim completeness you can't verify.

### 6.7 Recent Transactions
Compact table/feed (8 rows): Product (+SKU), Type badge, Quantity delta (`−2` red / `+5` green), `prev → new`, Performed by, relative time (exact in tooltip), "View all" → `/transactions`. Row click → `/transactions/:id`.

### 6.8 Recent Purchase Orders
Table (5 rows): PO number (mono), Supplier, Total (currency), Expected delivery (red if overdue and not completed/cancelled), Created, Status badge, "View" action. "View all" → `/purchase-orders`.

---

## 7. Page Guidance (all use the dark system)

- **Products:** toolbar (search, category, supplier, stock filter *if supported*), table with product/SKU, category, supplier, price, quantity + unit, min stock, stock badge. Detail page: left details panel; right **stock summary** panel (large quantity, min stock, badge, progress bar vs min) with quick actions (Sale, Return, Damage, Adjust → `/inventory/...?product=<id>`). Forms: sectioned panels (Basic info, Pricing & stock, Relations); quantity read-only on edit unless backend allows; sticky mobile action bar.
- **Categories / Suppliers:** consistent table or grid; modal forms for categories; supplier contact as `mailto:`/`tel:` links; delete confirm surfaces 409 messages gracefully.
- **Purchase Orders:** list with status filter; form with items editor (Product combobox, ordered qty, unit cost, line total, remove) and display-only grand total; detail with status stepper (Pending → Partially Received → Completed; Cancelled terminal), per-item received progress bars (accent-2 fill), Receive modal with outstanding quantities, "Receive all remaining", cancel as danger-soft with confirm.
- **Inventory hub:** four action panels — Sale (green), Return (cyan), Damage (red), Adjust (violet) — icon chip, effect text ("Decreases stock"), hover border in the tone colour. Operation forms: product combobox → stock preview panel (current qty, min, badge) → quantity (and Increase/Decrease for adjust) → remarks → **result preview** "20 → 18" (display only) → action-labelled button. Damage and large adjustments always confirm. Danger styling is stronger for Damage (red top accent on the panel).
- **Transactions:** filters (type chips, product search, date range if supported), table with delta display, detail page as definition list with product/user links.
- **Profile:** large avatar, identity details, role badge, logout (confirm).

---

## 8. Motion

| Use | Spec |
|---|---|
| Hover/focus colour | 120 ms `--ease` |
| Panel hover lift | 150 ms, `-translate-y-px` + border brighten |
| Page content enter | `animate-fade-up` 250 ms, staggered ≤ 40 ms × 6 items max |
| Modal | `animate-pop-in` 200 ms; backdrop fade |
| Drawer | 250 ms translate |
| Chart entrance | ≤ 600 ms |
| KPI count-up | ≤ 600 ms, first load only |
| Skeleton | shimmer 1.4 s loop |

Everything disabled/instant under `prefers-reduced-motion`. No parallax, bounce, looping background movement.

---

## 9. Analytics Data Contract & Required Backend Enhancements

Frontend must stay compatible with the existing backend. Audit first, then classify each widget:

| Widget | Available today? | If not available |
|---|---|---|
| KPI cards | Yes — `GET /api/v1/dashboard` | — |
| Stock-health donut | Likely derivable from dashboard counts (verify disjoint definitions) | Add `inStockProducts` to dashboard response |
| Recent transactions / POs | Yes — dashboard arrays | — |
| Low-stock list | Partial — requires a products query | Backend filter `?stock=low` / `GET /products/low-stock` |
| Category distribution (count/value) | Only via full product list | `GET /api/v1/dashboard/category-distribution` → `[{ categoryId, name, productCount, inventoryValue }]` |
| Inventory movement chart | Only if transactions endpoint supports date filtering and enough data volume | `GET /api/v1/dashboard/movements?range=30d&interval=day` → `[{ date, PURCHASE, SALE, RETURN, ADJUSTMENT, DAMAGE }]` (Mongo aggregation on `InventoryTransaction`, grouped by day and type, quantity summed) |

Rules:
- Client-side aggregation of transactions is acceptable **only** if the endpoint returns the complete set for the selected range (verify pagination/limits). Otherwise document the needed endpoint and render an honest unavailable/empty state.
- Never use placeholder arrays, random data or hardcoded sample values in production views.
- Trend/percentage indicators require real prior-period data.
- Include a short "Backend enhancements needed" section in the Phase 1 audit output listing exact aggregations, suggested routes, response shapes and which widgets depend on them.

---

## 10. Formatting

```js
// utils/format.js
export const formatCurrency = (n) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 2 }).format(n ?? 0);
export const formatCompact = (n) =>
  new Intl.NumberFormat("en-IN", { notation: "compact", maximumFractionDigits: 1 }).format(n ?? 0);
export const formatNumber = (n) => new Intl.NumberFormat("en-IN").format(n ?? 0);
// dates: "09 Oct 2026", timestamps "09 Oct 2026, 3:42 PM", relative via date-fns with exact value in title tooltip
```

Use `formatCompact` for chart axes, `formatCurrency` for money. Missing optional values show muted `—`. Handle populated and unpopulated references (`category` as id or `{ _id, name }`).

---

## 11. Responsive Rules

| Width | Behaviour |
|---|---|
| < 640 | Drawer nav, single-column, KPI 2-up compact, tables → cards, filters in drawer, sticky form action bar, charts min-height 240 with simplified axes (fewer ticks), legends below |
| 640–1023 | Drawer nav, 2-column grids, charts full width |
| ≥ 1024 | Persistent sidebar, 12-col dashboard grid |
| ≥ 1440 | Content capped at 1440 px, centred |

No horizontal page scroll at any width; touch targets ≥ 40 px.

---

## 12. Accessibility

- Visible focus ring everywhere (`--accent-2` outline).
- Contrast: text ≥ 4.5:1, UI/graphics ≥ 3:1 in dark **and** light themes.
- Icon buttons have `aria-label`; dialogs `role="dialog" aria-modal` with focus trap and restore.
- Charts: wrap in `role="img"` with `aria-label` summarising the data, and provide the same numbers in a visually hidden table or the legend; never rely on colour alone.
- Forms: labels, `aria-describedby` for errors, focus first invalid field on submit.

---

## 13. Folder Additions

```
src/
├── components/
│   ├── ui/        Button, Input, Select, Combobox, Textarea, Panel, Badge, Modal, Spinner, Skeleton, Tooltip, Avatar, Segmented
│   ├── common/    PageHeader, KpiCard, ChartCard, EmptyState, ErrorState, ConfirmDialog, Pagination, SearchInput, DataTable, StockBar
│   ├── charts/    InventoryMovementChart, StockHealthDonut, CategoryDistributionChart, ChartTooltip, chartTheme.js
│   ├── layout/    AppShell, Sidebar, Topbar, AuthLayout, UserMenu, ThemeToggle
│   └── forms/     FormField, ProductPicker, CategorySelect, SupplierSelect, ItemsEditor
├── constants/     badges.js, navigation.js, chartColors.js
├── hooks/         useFetch, useDebounce, useTheme, useCountUp
└── styles/        index.css
```

`chartTheme.js` reads CSS variables at runtime (`getComputedStyle`) so charts follow the active theme.

---

## 14. Acceptance / QA Checklist

- [ ] Dark theme cohesive; contrast verified; light theme (if built) uses the same components
- [ ] All colours come from tokens; no stray hex values in components (except chart series map)
- [ ] KPI cards show real values; no fabricated trends
- [ ] Movement chart uses real aggregated data or an honest unavailable state
- [ ] Stock-health donut totals match dashboard counts; zero state handled
- [ ] Alerts list links to real product pages; completeness is not overstated
- [ ] No decorative controls (search, bell, range, refresh) unless functional
- [ ] Tables → cards on mobile; no horizontal page overflow
- [ ] Every destructive/stock-impacting action has a confirm dialog with a named button
- [ ] Backend validation errors map to form fields
- [ ] Employee vs admin UI verified; auth cookie + refresh flow verified; no tokens in storage
- [ ] Reduced-motion respected; keyboard navigation complete
- [ ] `npm run build` succeeds with no console errors
