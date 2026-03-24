# Disaster Relief Resource Matcher (Himachal-Sahayata)

🚀 **Hack-O-Fest 2026 Winning Entry**

## Documentation & Planning
We have prepared a comprehensive plan for this project focusing on Himachal Pradesh and local AI (Ollama).

**See our [Full Plan & Documentation](./docs/MASTER_PLAN.md)**

## Problem
During disasters, relief resources often accumulate in some areas while other areas face shortages, because organizations cannot easily match available supplies with specific, location-based requests.
Challenge
Build a web platform that:
    • Lets NGOs and donors post available resources with quantity and location.
    • Lets affected people or field workers post “needs” with location and urgency.
    • Uses keyword and location matching (and simple scoring) to suggest best matches between resources and needs.
    • Displays matches on a map and in a list view for coordinators.
Why it matters
Improved matching of needs and supplies can make disaster response more efficient with the same amount of aid.
Recommended Tech Stack
    • Frontend: React.js.
    • Backend: Node.js/Express or Supabase.
    • Data: Postgres (Supabase) or Firestore for storing resources and requests.
    • Maps: Leaflet.js or Google Maps.
    • Matching: Simple text similarity and distance calculations.
Hint
Start with straightforward filters (same item type + within X km) before adding more advanced scoring.