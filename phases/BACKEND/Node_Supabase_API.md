# Backend: Node.js & Supabase API

## Technology Stack
- **Server:** Express.js (Node.js).
- **Database:** Supabase (PostgreSQL + PostGIS).
- **Communication:** Socket.io for real-time chat and WebRTC for video.

---

## Core API Endpoints

### 1. Unified Authentication
- `POST /auth/signup` & `POST /auth/login`: Handles session creation and role assignment.

### 2. Resource & Need Management
- `POST /resources`: NGO adds supply.
- `POST /needs`: Needy post requirement.
- `GET /matches/:id`: Triggers the AI scoring logic to find the best match.

### 3. Medical & Blood
- `GET /blood/donors`: Geo-query for matching blood types.
- `POST /consultations/start`: Video call room generation logic.

### 4. Tracking
- `POST /track/scan`: Updates status based on QR scan result.
- `GET /track/history`: Full audit trail of a specific relief package.

---

## Real-Time Engine
- **Supabase Realtime:** To update the Map immediately when a new Need is posted.
- **Socket.io:** Dedicated for the Doctor Chat to ensure low latency.
