# AI Integration with Ollama

## Why Ollama?
During a massive disaster in Himachal, internet backbones often snap. We use **local LLMs (Llama 3 or Mistral via Ollama)** to maintain intelligence at the "Edge" (Relief Centers).

## Key Workflows:

### 1. Intelligent Matching & Scoring
-   **Ollama Web Context:** Leveraging local LLM contexts to match disparate descriptions in Hindi and English.
-   **RAG for Mobile Help:** A vector database containing disaster manuals (First Aid, Mountaineering Safety) used by the Expo app to provide expert "Offline" advice.

### 2. Urgency Triage (Multilingual)
-   **Process:** Field workers post notes in Hindi or English.
-   **AI Task:** Categorize (Food/Clothing), extract entities, and assign an Urgency Score (1-10).

### 3. Translation & Summarization
-   **Task:** Instant translation for the unified mobile app interface.

## Local API Implementation
-   The Node.js backend will communicate with a local Ollama instance (running on `localhost:11434`).
-   We'll use standard prompts to get JSON-formatted outputs from the LLM for easy parsing.

```javascript
// Example Prompt Strategy
const prompt = `System: You are an expert disaster coordinator.
User: Match this need: "Water bottles needed for 50 people" with these resources: 
1. "10 Packs of Juice boxes"
2. "20 Blankets"
Return only a JSON object with matchIndex and rationale.`;
```
