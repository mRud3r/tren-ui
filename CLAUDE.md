# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Development server (Next.js + Turbopack)
npm run build    # Production build
npm run lint     # ESLint
npm run start    # Start production server
```

There is no test suite configured.

## Architecture

**Tren** is a Next.js 16 fitness tracking app (App Router) backed by Supabase (PostgreSQL + Auth).

### Key directories

- `app/` — Next.js App Router pages and layouts. Route groups: `(auth)` for login/signup flows, `dashboard/` for main app views, `workout-session/[id]/` for active sessions.
- `components/` — React components. Shared UI in `components/ui/` (shadcn/ui primitives), feature components co-located by domain.
- `lib/supabase/` — Supabase client setup: `client.ts` (browser), `server.ts` (server components), `middleware.ts` (auth enforcement).
- `stores/` — Zustand state: `createWorkout.store.ts` (ephemeral, workout builder), `workoutSession.store.ts` (persisted to localStorage, active session tracking).
- `types/supabase.ts` — Auto-generated Supabase TypeScript types. Regenerate with the Supabase CLI when schema changes.
- `hooks/` — Custom React hooks.

### Data flow

- **Server components** query Supabase directly (no REST layer). Use the server-side Supabase client from `lib/supabase/server.ts`.
- **Client components** that need to fetch or mutate use the browser Supabase client from `lib/supabase/client.ts`.
- **Middleware** (`middleware.ts`) protects `/dashboard` and `/workout-session` routes by checking session cookies via `lib/supabase/middleware.ts`.

### State management

Two Zustand stores:
1. `useCreateWorkoutStore` — tracks workout name + ordered exercises during creation/editing. Reset on navigation.
2. `useWorkoutSessionStore` — tracks the active workout session (sets, reps, weight, intensity). **Persisted to localStorage** with versioned migration. This survives page reloads.

### Styling

- Tailwind CSS v4 with `@import 'tailwindcss'` in `app/globals.css`.
- Custom design tokens use OKLch color syntax as CSS variables.
- shadcn/ui (new-york style) for component primitives; `cn()` from `lib/utils.ts` for class merging.
- `@dnd-kit` for drag-and-drop exercise reordering in the workout builder.

### Database schema (main tables)

`workouts`, `exercises`, `muscle_groups`, `workout_session`, `exercise_session`, `exercise_set` — all typed via `types/supabase.ts`.
