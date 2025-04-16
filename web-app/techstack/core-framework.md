---
icon: pickaxe
---

# Core Framework

[Next.js (v15.3.0)](https://nextjs.org/)

Next.js serves as the foundation of the application, providing a robust React framework with built-in server-side rendering, API routes, and routing capabilities. It was chosen for:

* Server-side rendering: Improves initial load performance and SEO (server engine optimization)
* App Router: File Base Routing specifically with App Routing, because server side rendering is more optimized than Pages Routing system
* API Routes: Backend functionality without separate server setup
* TypeScript integration: Strong typing system to reduce bugs
* Nested Layouts: Improves performance because if you are using same components in more pages, it render only one time instead of rendering every time the entire page
* Caching: With server-side rendering Next.Js implements caching from the server side. This help a lot because the user can't modify what is cached so it also improve security

