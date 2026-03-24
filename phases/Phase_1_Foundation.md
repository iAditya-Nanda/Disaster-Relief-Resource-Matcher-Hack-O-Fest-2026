# Phase 1: Foundation (Structure & Multilingual Core)

## Goals
-   Initialize the **Backend (Node.js/Express)** and **Database (Supabase)**.
-   Set up **Multilingual Support (i18next)** for Hindi and English across the entire platform.
-   Create the shared **Database Schema** for users (Doctors, Donors, NGOs, Needy).

## Key Tasks
1.  **Backend Initialization:**
    -   Setup Express.js server with JWT authentication.
    -   Configure Supabase client and PostGIS for geo-spatial queries.
2.  **Schema Design:**
    -   `users`: Name, Role (Doctor, NGO, Donor, Needy), Preferred Language (HI/EN).
    -   `resources`: Category, Quantity, Status.
3.  **UI Core Dashboard (Web):**
    -   Base styles using Tailwind CSS (Premium Dark/Glass mode).
    -   Integration of **i18next** for seamless Hindi-English toggling.
4.  **Ollama Local API:**
    -   Establish a bridge between the Node.js server and the local Ollama instance (localhost:11434).

## Success Metrics
-   User registers/logs in and sets language preference.
-   The UI translates instantly between English and Hindi.
-   Data persists in Supabase.
