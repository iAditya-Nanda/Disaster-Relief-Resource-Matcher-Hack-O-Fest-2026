# Backend Phase 3: Real-Time Communication

Ensuring low-latency coordination during disaster response.

## 💬 3.1: Socket.io Integration (Triage Chat)
- **Task:** Initialize Socket.io on the Node.js server.
- **Feature:** Chat rooms for Doctors and Needy/Field Workers.
- **Persistence:** Save chat history to Supabase for audit.

## 📹 3.2: WebRTC Video Bridge
- **Task:** Implement room generation logic for video calls.
- **Provider:** Using a simple WebRTC signaling server (Socket.io) or a service like Jitsi/Daily for the hackathon MVP.

## 🗺️ 3.3: Supabase Realtime Subscriptions
- **Task:** Enable Realtime on the `needs` and `resources` tables.
- **Goal:** Instant Map updates when a new need is posted anywhere in Himachal.

---
*Ready for real-time.*
