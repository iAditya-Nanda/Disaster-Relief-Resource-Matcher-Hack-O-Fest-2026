# Phase 1: Foundation (Detailed Sub-Phases)

## 🏗️ 1.1: Environment & Project Setup
-   **Task:** Initializing the folder structure (`/server` and `/client`).
-   **Backend:** Basic `package.json`, `npm install`, and `.env` setup.
-   **Supabase:** Linking the workspace to a Supabase project.

## 🗄️ 1.2: Database Schema (The Master Blueprint)
-   **Task:** Use **Supabase MCP** to execute SQL migrations for:
    -   `profiles` table: Integrated with Supabase Auth (name, role, language_pref).
    -   `resources` table: Category, location, status.
    -   `needs` table: Urgent requests with priority.
    -   `medical_consultations`: Chat/Video room logs.
    -   `blood_inventory`: Type-based tracking.

## 🔐 1.3: Authentication & Role Logic
-   **Task:** Configure Supabase Auth.
-   **Access Control:** Middleware to ensure only `NGO` can update `resources` and only `Doctor` can see `medical_consultations`.

## 📡 1.4: Core API Initialization
-   **Task:** Build the Express server backbone.
-   **Endpoints:** Basic health check, user profile fetcher, and resource list.

## 🌐 1.5: Multilingual (i18n) Foundation
-   **Task:** Generate the `locales/` folder with `hi.json` and `en.json`.
-   **Integration:** Seed base translations for "Need", "Supply", "Urgent", "Help".

---
*Ready to execute 1.1 and 1.2.*
