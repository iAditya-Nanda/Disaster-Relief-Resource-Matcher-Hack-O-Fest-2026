# Frontend: Unified Web Dashboards (React)

## Architecture: Single Web App for All
- **Framework:** React + Vite + Tailwind CSS.
- **Access Control:** A `RoleGuard` component will render the correct dashboard after checking the user's `role` from the JWT/Session.

---

## Dashboard 1: NGO / Donor Hub
- **Purpose:** Listing and matching resources.
- **Key Screens:**
    - **Resource Inventory:** Add/Edit/Delete supplies (e.g., Blankets, Med-Kits).
    - **Live Need Map:** View local needs with "AI Match" scores.
    - **Dispatch Tracking:** Scan generated QR codes for outgoing aid.
- **Language:** Fully toggleable between Hindi and English.

## Dashboard 2: Needy / Field Worker Portal
- **Purpose:** Requesting help and tracking arrival.
- **Key Screens:**
    - **Post a Need:** Quick form (Hindi/English) with geo-tagging.
    - **My Requests:** See status (`Pending`, `Matched`, `Dispatched`, `Delivered`).
    - **Receive Aid:** Personal QR code for verification on delivery.

## Dashboard 3: Doctor / Admin Command Center
- **Purpose:** Medical triage and regional oversight.
- **Key Screens:**
    - **Regional Overview:** Heatmap of disaster impact.
    - **Tele-Health Queue:** View "Waiting for Doctor" chat/video calls.
    - **Doctor Mode:** Active video call and prescription/note portal.
    - **Blood Donor Map:** Real-time visibility of matching blood types in the area.

---

## Multilingual Implementation
- Standard `i18next` library used across all 3 dashboards to ensure no field is left untranslated.
