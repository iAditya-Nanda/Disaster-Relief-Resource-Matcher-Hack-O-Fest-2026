# Doctor Dashboard Implementation Plan

This plan outlines the steps to refactor the current static Doctor Dashboard into a fully functional, API-driven medical command center.

## Phase 1: Structural Refactoring (Modularity)
**Goal**: Organize the codebase to follow the same patterns as the NGO and Admin dashboards.

1.  **Directory Setup**: 
    *   Create `client/src/pages/doctor/`
    *   Create `client/src/pages/doctor/pages/`
    *   Create `client/src/pages/doctor/components/`
2.  **Move & Split**:
    *   Move `DoctorDashboard.tsx` content to `client/src/pages/doctor/index.tsx` (as Layout).
    *   Extract main dashboard content into `client/src/pages/doctor/pages/DashboardHome.tsx`.
3.  **Client-side Routing**:
    *   Update `App.tsx` routes.
    *   Implement sub-routing in `doctor/index.tsx` for views like `/doctor/triage`, `/doctor/map`, etc.

## Phase 2: Backend & API Integration
**Goal**: Replace hardcoded metrics with real data from the database.

1.  **Backend Routes**:
    *   Initialize `server/routes/doctorRoutes.js` and mount it in `server/index.js`.
    *   Create `server/controllers/doctorController.js`.
2.  **Stat Hydration**:
    *   Implement `GET /api/doctor/stats` for the overview cards.
    *   Query `resources` (med category), `medical_consultations` (waiting), and `needs` (high urgency).
3.  **Triage System**:
    *   Implement `GET /api/doctor/triage-queue`.
    *   Query `medical_consultations` with patient profile joins.

## Phase 3: Telehealth & Interactive Map
**Goal**: Enable real-time medical response functions.

1.  **Map Integration**:
    *   Implement `HealthMap.tsx` sub-page.
    *   Visualize geographical clusters of medical needs.
2.  **Consultation Flow**:
    *   Enable "Join Consultation" logic.
    *   Implement status update endpoint (`PATCH /api/doctor/consultation/:id`).
3.  **Real-time Alerts**:
    *   Connect Socket.io for live queue updates (avoiding manual refreshes).

## Phase 4: Final UX & Polishing
**Goal**: Ensure a premium, responsive experience.

1.  **Premium Aesthetics**: Refine Lucide icons, Framer Motion animations, and scroll behaviors.
2.  **Performance**: Optimize heavy map components and API loading states.
3.  **Testing**: End-to-end verification of medical consultation lifecycles.
