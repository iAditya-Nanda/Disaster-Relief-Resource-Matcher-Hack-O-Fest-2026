# Phase 3: Medical Support & Blood Donation

## Goals
-   Launch the **Doctor Helpline** (Video & Chat).
-   Add a **Blood Donor Tracking & Matching System**.

## Key Tasks
1.  **Tele-Health (Doctor Helpline):**
    -   **Chat:** Socket.io real-time chat between Needy and Doctors.
    -   **Video Call:** Integrate WebRTC or a lightweight service (e.g., Daily.co or Agora) for emergency consultation.
    -   **Status:** "Doctor Online/Busy" toggle.
2.  **Blood Donor Management:**
    -   Blood Type Database (A+, B-, etc.).
    -   Geo-matching: Find donors within 10km of a hospital/relief camp with the matching blood type.
    -   Privacy-protected contact (Donor receives a notification and clicks "Approve" before contact details are shared).

## Success Metrics
-   Needy user starts a chat with an online Doctor.
-   A "Red Alert" is triggered for a specific blood type in a local area, notifying all nearby matching donors.
