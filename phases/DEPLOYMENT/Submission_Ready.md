# Deployment & Submission Plan

## Phase 5 Final Goal: Ready for Hack-O-Fest 2026 Submission

---

## 1. Cloud Infrastructure (The Default)
- **Frontend Dashboard (Web):** **Vercel** (Recommended) - Fastest free tier for React/Vite.
- **Backend API (Node.js):** **Railway** or **Render** (Required for the Express + Socket.io server).
- **Data:** Supabase Cloud instance.
- **Mobile:** Expo Go link for judges to test immediately.

## 2. "Local Disaster-Mode" Demo (The Winning Strategy)
- For the hackathon presentation, we will demonstrate a **"No Global Internet" scenario**.
- **Setup:**
    - A local Docker container running the Backend + Ollama.
    - A local Wi-Fi router.
    - The Mobile app and Web dashboard communicating with the local IP.
- **Narrative:** "Even if Himachal's fiber cables fail, our system stays online for the valley."

---

## 3. Submission Bundle
- **GitHub Repository:** Clean, documented code.
- **Video Demo:** Showing the AI matching a Hindi request and the Video call working.
- **Pitch Deck (from docs/5_PRESENTATION.md):** Finalized design.
- **Testing Credentials:** Demo accounts for all 3 roles (Doctor, NGO, Needy).
