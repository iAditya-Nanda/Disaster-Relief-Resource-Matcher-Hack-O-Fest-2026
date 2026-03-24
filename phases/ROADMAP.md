# 🗺️ Phased Implementation Roadmap

To maintain a clean and scalable codebase for the hackathon, we are using the **Unified Architecture** model. This ensures that we have one source of truth for all users.

## 🚠 Architecture Overview
- **Unified Frontend (Web):** Single React Vite app with role-based dashboards (NGO, Needy, Doctor).
- **Unified Mobile App (Expo):** Single React Native codebase for field workers and needy users.
- **Unified Backend:** Node.js Express server + Supabase DB + local Ollama instance.

---

## 📂 Master Phase-Wise Documentation
For the full granular 1-5 phase breakdown, see the **[Master Phases Overview](./MASTER_PHASES.md)**.

### 1. [BACKEND](./BACKEND/Phase_1_Foundation_Details.md)
Details of the server, database schema, and AI logic.
- **[Phases 1-5 Index](./MASTER_PHASES.md#🖥️-backend-phases-the-strategy-layer)**

### 2. [FRONTEND](./FRONTEND/Phase_1_Setup_Auth.md)
Contains the plan for web dashboards and the unified mobile app.
- **[Phases 1-5 Index](./MASTER_PHASES.md#🎨-frontend-phases-the-command-center)**

### 3. [DEPLOYMENT](./DEPLOYMENT/Phase_1_Pipeline.md)
Cloud and local-only disaster simulation setup.
- **[Phases 1-5 Index](./MASTER_PHASES.md#🚀-deployment-phases-the-submission-layer)**

---

## 🛠️ Combined Execution Order (Sprint Plan)
1. **Foundation:** Backend Phase 1 + Frontend Phase 1.
2. **Core Logic:** Backend Phase 2 + Frontend Phase 2.
3. **Connectivity:** Backend Phase 3 + Frontend Phase 4.
4. **AI & Mobile:** Backend Phase 4 + Frontend Phase 3.
5. **Final Logistics:** Backend Phase 5 + Frontend Phase 5 + Deployment.

---
*Created for Hack-O-Fest 2026*
