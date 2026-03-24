# AI Integration with Ollama

## Why Ollama?
During a massive disaster in Himachal, internet backbones often snap. We use **local LLMs (Llama 3 or Mistral via Ollama)** to maintain intelligence at the "Edge" (Relief Centers).

## Key Workflows:

### 1. Intelligent Matching & Scoring
-   **Prompt:** Given a list of Available Resources [A, B, C] and a critical Need [N], which Resource is the best match?
-   **Benefit:** LLMs understand *context* (e.g., "Tarps" can help with "Shelter", whereas a primitive keyword search might miss it).

### 2. Urgency Triage
-   **Process:** Field workers post raw text notes ("Landslide near bridge, people cold, 2 toddlers need milk").
-   **AI Task:** Categorize (Food/Clothing), extract entities (Need: Milk, Target: Toddlers), and assign an Urgency Score (1-10).

### 3. Multilingual Translation
-   **Task:** Translate Pahari/Hindi local dialects into structured English reports for international NGOs or centralized authorities.

### 4. Summary Generation
-   **Task:** Summarize the local situation into a 3-sentence brief for decision-makers.

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
