# Icon Style Guide: Thiings.co "Toy-Skeuomorphic" DNA

The icons on thiings.co follow a distinct, premium **3D Skeuomorphic** style. They appear as high-fidelity miniature physical objects rather than traditional flat or line-based icons.

## Core Design Principles

1.  **3D Geometry & Perspective**
    - Icons are fully rendered 3D models, typically viewed from a 3/4 isometric or front-on perspective.
    - All edges are rounded or beveled; there are almost no sharp 90-degree corners. This creates a "soft touch" or "toy" aesthetic.

2.  **Lighting & Materials**
    - **Satin/Matte Finish:** Surface reflections are soft and diffused. They avoid high-gloss "wet" looks, opting instead for a premium plastic or matte material.
    - **Directional Lighting:** Unified lighting (usually top-left) creates consistent highlights and soft gradients that define the form without the need for outlines.
    - **Subsurface Scattering:** Organic objects (like food or skin) have a slight translucency that makes them feel "alive" and rich.

3.  **Shadows & Depth**
    - **No Strokes:** Shapes are defined strictly by light and shadow.
    - **Soft Ambient Occlusion:** Deep, soft shadows occur where surfaces meet (e.g., between the cheese and bun in a burger icon).
    - **Unbounded Shadows:** When used on a dashboard, these icons should have a soft, blurred "blob" drop shadow underneath them to provide grounding and depth without a box container.

4.  **Color & Detail**
    - **Vibrant yet Natural:** Colors are saturated to feel inviting but stay true to the physical object.
    - **Micro-Detail:** Small details (like individual sesame seeds, stitches on leather, or wood grain) are present but stylized to prevent visual clutter.

## Recreation Framework (for AI Image Generation / 3D Rendering)

-   **Base Prompt Component:** "3D icon of [OBJECT], soft skeuomorphic style, toy-like aesthetic, premium matte plastic material, studio lighting, top-left key light, soft ambient occlusion shadows, isometric view, white background, high resolution 3D render, Apple Memoji aesthetic."
-   **Dashboard Implementation:** Since these have no background (BG-less), they should be exported as transparent PNGs. On the dashboard, they should be sized consistently (e.g., 64x64 or 128x128) and allowed to overlap slightly with text to emphasize their "physicality."

## Comparison with Existing Icons
-   **Current Icons (Lucide):** Minimalist, monochromatic, line-based (2px stroke), 2D.
-   **Thiings.co Style:** Highly detailed, colorful, 3D, depth-focused.

---
*Created for Himachal-Sahayata Dashboard Design Refinement*
