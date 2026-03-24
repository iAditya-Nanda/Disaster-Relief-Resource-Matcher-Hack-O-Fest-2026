# Backend Phase 2: Core API & Matching Engine

Building the business logic for the resource distribution system.

## 📦 2.1: CRUD for Resources & Needs
- **NGO Endpoint:** `POST /resources` - Logic to validate quantity and location.
- **Needy Endpoint:** `POST /needs` - Automated urgency score extraction (basic keyword).
- **Profile Fetcher:** Enhanced profile logic to show user roles on the frontend.

## 📍 2.2: Geo-Spatial Matching (PostGIS)
- **Task:** Implement `ST_Distance` queries to find resources within X km of a need.
- **Goal:** Return a list of resources sorted by proximity.

## 📈 2.3: Scoring Algorithm (The Matchmaker)
- **Logic:** Combine distance, urgency (1-10), and category match.
- **Task:** Create a helper function `calculateMatchScore(need, resource)`.

## 🔄 2.4: Status Update Triggers
- **Task:** Logic to change `status` from `pending` -> `matched` -> `collected`.
- **Constraint:** Only the original donor/NGO or an admin can update status.

---
*Ready to build logic.*
