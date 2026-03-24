# Phase 2: Mobile App & AI-RAG Integration

## Goals
-   Build the **React Native Expo** mobile application.
-   Implement the **RAG (Retrieval-Augmented Generation)** system using a small local model (Ollama) for disaster guidance.
-   Roll out role-based screen switches (NGO View vs. Needy View).

## Key Tasks
1.  **Expo Mobile Setup:**
    -   Single Login portal shared with the web app.
    -   Navigation based on User Role:
        -   **Needy:** "I need help" button (Primary).
        -   **NGO:** "I can provide" feed.
        -   **Doctor:** "Available for consultation".
2.  **AI Assistant (RAG):**
    -   Embed a local knowledge base (Disaster manuals, First-aid guides in Hindi/English).
    -   Use **Ollama** to query this vector-embedded knowledge.
    -   Accessible via a floating Chatbot icon in the app.
3.  **Multilingual Mobile UI:**
    -   Native translation support for the mobile app in both Hindi and English.

## Success Metrics
-   User logs in on mobile and sees the correct dashboard for their role.
-   The "AI Help" bot answers questions about first aid in Hindi/English using local data.
