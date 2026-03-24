# Backend Phase 4: Local AI (Ollama) & RAG

The "Winning Hook"—offline intelligence for disaster management.

## 🧠 4.1: Ollama Server Link
- **Task:** Create a Node.js utility to query the local Ollama REST API (`localhost:11434`).
- **Goal:** Wrap AI calls in `try/catch` with fallback to keyword logic if Ollama is unavailable.

## 📚 4.2: Multilingual RAG Assistant
- **Task:** Feed the Himachal Disaster Manual into a local vector store (Faiss/HNSWlib).
- **Feature:** `POST /ai/help` - Retrieves 3 chunks and summarizes answers in Hindi or English.

## ⚖️ 4.3: AI Match Rationale
- **Logic:** Use Ollama to explain *why* a particular match was made (e.g., "This resource contains water purification tablets which are critical for the flooded area").

---
*Ready for AI-driven matching.*
