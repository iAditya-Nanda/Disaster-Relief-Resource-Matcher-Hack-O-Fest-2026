# Technical Architecture

## 1. Frontend: "The Command Center"
-   **Framework:** React (Vite) - For lightning-fast development.
-   **Styling:** Tailwind CSS - Using custom HSL palettes (Deep Teal for trust, Amber for alerts).
-   **State Management:** Zustand - Small, fast, and easy for real-time updates.
-   **Maps:** Leaflet.js with OpenStreetMap - Open-source and works better for custom tiles or offline caching than Google Maps.
-   **Animations:** Framer Motion - For the "Premium" feel (Transitions, Pulse alerts).

## 2. Backend: "The Strategy Layer"
-   **Runtime:** Node.js (Express) - Scalable and handles asynchronous AI calls well.
-   **Database:** Supabase (PostgreSQL + PostGIS) - Real-time subscriptions are critical for disaster apps. PostGIS will handle the `distance < 10km` queries.
-   **AI Bridge:** REST interface to local `Ollama` Docker container or local binary.

## 3. Data Schema (Essential Fields)
-   **Resources Table:** `id, title, category, quantity, unit, location (lat/lng), provider_id, status (available/collected)`.
-   **Needs Table:** `id, title, description, urgency (1-10), location (lat/lng), requester_id, status (pending/matched)`.
-   **Matches Table:** `id, need_id, resource_id, ai_confidence_score, rationale`.

## 4. Deployment Strategy
-   **Cloud:** Vercel (Frontend) and Railway (Backend).
-   **Local:** For the "Disaster Simulation" mode, we'll show how the backend runs locally on a laptop to serve the relief center.
