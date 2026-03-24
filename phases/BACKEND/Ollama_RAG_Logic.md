# Backend: Ollama & RAG Logic

## AI Concept: Local-First Intelligence
- We use **Ollama** running locally to ensure that if the internet goes down, the matching and guidance system still functions on the local area network.

---

## 1. Context-Aware Matching
- **Input:** A "Need" string and multiple "Resource" strings.
- **Logic:** The LLM ranks the top 3 resources by context (e.g., matching "Dry Rations" with "Food Hunger" instead of just "Food").
- **Output:** A JSON score (1-100) and rationale.

## 2. Multilingual RAG Assistant
- **Vector Database:** We'll use a small local vector store (e.g., Faiss or HNSWlib) linked to the Node.js server.
- **Knowledge Base content:**
    - Disaster recovery manuals (in Hindi and English).
    - Local Himachal emergency contact lists.
    - First aid guidelines.
- **Workflow:** Needy user asks a question -> System retrieves 3 relevant chunks from the manual -> Ollama summarizes the answer in the user's preferred language.

## 3. Urgency Scoring
- Automatically assigns a priority level (High/Med/Low) based on the textual description provided by the user.
