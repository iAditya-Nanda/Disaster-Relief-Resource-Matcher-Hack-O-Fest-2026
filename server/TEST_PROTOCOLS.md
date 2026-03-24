# 🧪 Himachal-Sahayata Backend Testing Protocol

This document outlines the systematic verification of the **Disaster Relief Resource Matcher** backend. Use these steps to ensure every phase is working correctly before the final demo.

---

## 🏗️ 1. Environment & Connectivity (Phase 1)
*   **Health Check:** Send a GET request to `/api/health`.
    *   **Success:** Should return `{ status: 'ok', message: 'Himachal-Sahayata Backend is LIVE' }`.
*   **Supabase Proxy:** Ensure the Cloudflare Proxy is active at `connect-api.adimita-tech.workers.dev`.
*   **Ollama Cloud:** Ensure `OLLAMA_API_KEY` is present in the `.env` file.

---

## 🛡️ 2. Authentication & Security (Phase 1)
*   **Sign Up (NGO):** Create a new profile in Supabase Auth with the metadata `{ "full_name": "Aditya NGO", "role": "NGO" }`.
*   **JWT Token:** Capture the `access_token` from the sign-in response.
*   **Authorization Test:** Try accessing POST `/api/resources` with a `Needy` token.
    *   **Success:** Should return a `403 Forbidden: You do not have the required role`.

---

## 📦 3. Core Business Logic (Phase 2 & 5)
*   **NGO Resource Posting:**
    *   `POST /api/resources`
    *   **Body:** `{ "title": "Warm Blankets", "category": "Shelter", "quantity": 100, "lat": 31.1048, "lng": 77.1734 }` // Location: Shimla
*   **Needy Request Posting (AI Triage Test):**
    *   `POST /api/needs`
    *   **Body:** `{ "title": "Emergency Help", "description": "Need immediate medical help near Mandi, family is shivering.", "lat": 31.5892, "lng": 76.9182 }`
    *   **Expected Results:** AI should automatically set `urgency` to 10 and `category` to "Medicine" or "Shelter".
*   **Intelligent Matchmaking:**
    *   `GET /api/matches?lat=31.1048&lng=77.1734&radius=50000&useAI=true`
    *   **Verification:** Proximity, Urgency, and Semantic relevance (via Ollama) should score and rank results.

---

## 📡 4. Real-time Communication (Phase 3)
*   **Socket Connection:** Use a Socket.io client to connect to `ws://localhost:5000`.
*   **Triage Chat:** Emit `join_incident` with a `resourceId`.
*   **Message Persistence:** Send a message via Socket and verify it appears in the `messages` table in Supabase.
*   **Signaling:** Emit `video_offer` to a specific `targetUserId` and verify the peer receives the signal.

---

## 🧠 5. AI-Enhanced Search (Phase 4)
*   **Semantic Check:** Try searching for "High Altitude Kits" while providing a result titled "Woolen Jackets."
    *   **Verification:** If `useAI=true` is set, Ollama Cloud should confirm the match even if keywords don't align.

---

## 📦 6. Logistics & QR Handover (Phase 5)
*   **Token Generation:** NGO calls `POST /api/shared/qr/generate` for a resource.
    *   **Capture:** The 16-char `collection_token`.
*   **Verification Scan:** Field worker calls `POST /api/shared/qr/verify` with the token.
    *   **Success:** Resource status should change to `delivered` in the database.

---
**Verified for Hack-O-Fest 2026 Submission Readiness.**
