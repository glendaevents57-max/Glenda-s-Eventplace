# Implementation Plan: Gourmet Menu Expansion & Interactive Showcase

This plan details the expansion of the Glenda Royale Events menu showcase, the integration of new food selections into the booking wizard, updating the validation rules and admin dashboard, and generating realistic food photography assets.

## Overview
We will expand the culinary offerings from the limited base menu (3 savory options, 2 refreshments) to a rich, premium selection across three main categories (Platters & Boards, Savory Appetizers & Bites, and Desserts). We will design a stunning, interactive menu showcase on the homepage, integrate the new options into the booking wizard checklist, expand the booking API validation, update the admin dashboard calendar/list details, and generate realistic food photography assets for all 17 items.

## Architecture Decisions
- **JSONB Compatibility**: Store the new categories (`platters`, `desserts`) alongside the existing arrays (`savory`, `refreshments`) in the `custom_menu_selection` JSONB field in Postgres. This avoids any schema changes or table migrations and keeps the system backward-compatible with existing bookings.
- **Responsive Interactive Component**: Build a modern `<MenuShowcase />` component using React hooks, Lucide icons, and Tailwind/Vanilla CSS styles, featuring smooth hover animations, tab filtering, and high-fidelity food imagery.
- **Photography Assets**: Use the image generation tool to create elegant, clean food photography assets, placing them in `public/images/food/`.

---

## Task List

### Phase 1: Foundation & Asset Generation
- **Task 1: Generate Food Photography Assets**
  - Generate high-end, realistic food photos for all 17 menu items.
  - Save them under `public/images/food/` with lowercase snake_case names:
    1. Platters & Boards:
       - `fresh_fruit_platter.png`
       - `artisan_cheese_board.png`
    2. Savory Appetizers & Bites:
       - `charcuterie_selection.png`
       - `caprese_skewers.png`
       - `bruschetta_bites.png`
       - `veggie_cups.png`
       - `mini_sliders.png`
       - `savory_tarts.png`
       - `smoked_salmon_bites.png`
       - `antipasto_cups.png`
       - `filipino_lumpia.png`
       - `meat_skewers.png`
    3. Desserts:
       - `mini_dessert_cups.png`
       - `macarons.png`
       - `chocolate_truffles.png`
       - `mini_cupcakes.png`
       - `fruit_tartlets.png`

### Checkpoint: Foundation & Assets
- Verify all 17 images are generated, properly scaled, and saved in `public/images/food/`.

### Phase 2: Homepage Menu Showcase & Navigation
- **Task 2: Build the Menu Showcase Component (`src/components/MenuShowcase.tsx`)**
  - Create a React component containing the menu items data structured by category.
  - Implement a category-based tab navigation ("Platters & Boards", "Savory Bites", "Sweet Desserts").
  - Design elegant card layouts with zoom-on-hover images, gold gradients, and micro-interactions.
- **Task 3: Integrate Menu Showcase on Homepage (`src/app/page.tsx`)**
  - Replace the static "Curated Culinary Bites" text with the new `<MenuShowcase />` component.
  - Update the header navigation link for "Food" to smooth-scroll directly to the new Showcase section (`#food-menu`).

### Checkpoint: Homepage Presentation
- Verify that the menu showcase looks spectacular on the landing page, fits the luxury event vibe, and tabs switch flawlessly.

### Phase 3: Booking Wizard & API Integration
- **Task 4: Update Booking Wizard Selections (`src/components/BookingWizard.tsx`)**
  - Expand the Step 3 state variables to manage new checklists (`platterChoices`, `dessertChoices`).
  - Update the wizard UI to display Checklist categories for:
    - Refreshment Inclusions
    - Platters & Boards (Inclusions)
    - Savory Appetizers (Inclusions)
    - Sweet Desserts (Inclusions)
  - Ensure selected arrays are mapped correctly in the booking request payload.
- **Task 5: Update Booking Zod Validation (`src/app/api/bookings/route.ts`)**
  - Modify `bookingSchema` to validate `platters` and `desserts` inside `custom_menu_selection` as optional string arrays defaulting to empty arrays `[]`.

### Checkpoint: Booking Flow
- Run a test booking through the booking wizard choosing elements from all categories.
- Verify that the booking is successfully created, the API accepts the payload, and it saves correctly to Postgres.

### Phase 4: Admin Dashboard Updates
- **Task 6: Update Admin Views (`src/app/admin/dashboard/page.tsx` and `src/app/admin/dashboard/calendar/page.tsx`)**
  - Update the details panel on both admin pages to show the newly added Platters & Boards and Desserts category selections.
  - Ensure it handles older bookings gracefully (i.e. does not crash if fields are missing).

### Checkpoint: Complete
- Compile and build the project (`npm run build`) to ensure TypeScript/ESLint has no compilation issues.
- Do a complete walk-through of the flow.

---

## Risks and Mitigations
| Risk | Impact | Mitigation |
| :--- | :--- | :--- |
| **Performance Degradation** | Med | Optimize image formats and dimensions, lazy-load images on scroll. |
| **Backward Compatibility** | High | Use safe navigation (`?.`) and fallback default values (`[]`) when reading `custom_menu_selection` from database records. |

## Open Questions
- Is there any limit on how many items a user can select in each category? We will assume they can choose whatever they prefer, or recommend standard selections.
