# Frontend: Unified Mobile App (React Native Expo)

## Architecture: One App, Three Journeys
- **Framework:** React Native + Expo + Expo Router.
- **Benefit:** Build once, deploy to Android/iOS instantly. One code base for all user roles.

---

## Mobile Screen Flows

### 1. Unified Login/Signup
- Role selection during onboarding (Donor/NGO, Needy, Doctor).
- Language selection (Hindi/English) as the first step.

### 2. The Needy Journey
- **"Request Help" Button:** Massive, high-contrast button for emergencies.
- **Live Status:** Progress bar from "Request" to "Delivered".
- **QR Vault:** Stores the unique receipt QR for safe delivery verification.

### 3. The NGO / Field Worker Journey
- **Mobile Scanner:** In-app QR scanner to update supply status.
- **Nearby Needs:** List of needs within 5km of current GPS location.

### 4. The Doctor Journey
- **Emergency Consultations:** Incoming video call notifications.
- **Blood Requests:** Alert-driven feed for local blood emergencies.

---

## AI Feature: RAG Assistant
- **Technology:** Small language model (Ollama) queried via mobile API.
- **Feature:** A "How to help?" chatbot that works with locally stored first-aid guides.
- **Language:** Speaks and understands both Hindi and English.
