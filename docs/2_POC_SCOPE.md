# POC Scope (Hackathon MVP)

To win the hackathon, we need a polished, functional demonstration of the core loop.

## 1. User Roles
-   **NGO/Donor Dashboard:** Post availability (e.g., "100 Blankets in Shimla"). List current "Outstanding Needs" matching their category.
-   **Field Worker/Needy Portal:** Simple, fast-loading mobile-responsive form to post "What is needed" and "How urgent" (Scored 1-10).
-   **Regional Coordinator (Admin):** Map view showing clusters of Needs vs. Supply. Ability to click a "Match with AI" button.

## 2. Core Features
-   **Resource Listing:** CRUD for resources (Food, Medicine, Tools, Manpower).
-   **Need Listing:** CRUD for urgent requirements with geo-tagging.
-   **AI Matchmaker:** Using Ollama to analyze a "Need Description" and a "Resource Description" to give a "Compatibility Score" (e.g., "Need: Pediatric Antibiotics" matched with "Resource: General First Aid Kit" -> 65% match).
-   **Map Visualization:** Color-coded pins (Red = Need, Green = Resource). Pulse effect for high-urgency needs.

## 3. The "Wow" Factor:
-   **Flash-Matching:** An automated matching engine that notifies the donor if a critical need appears within 5km.
-   **Offline Summarization:** Use Ollama to summarize 50 individual requests into one "Valley Status Report" for local authorities.

## Out of Scope (For Future)
-   Drone logistics integration.
-   Full blockchain-based audit trail.
-   Multi-hop supply chain tracking.
