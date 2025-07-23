# High Level Architecture

### Technical Summary

The application will be a modern, serverless web application built with **Next.js** and hosted on **Vercel**. The architecture is designed for optimal performance and SEO through a combination of Static Site Generation (SSG) for content pages and Server-Side Rendering (SSR) for dynamic pages. The backend will consist of serverless functions (API Routes) co-located with the frontend in a **Turborepo monorepo**. Data persistence will be managed via a **dedicated data access layer** that communicates with Supabase's Postgres database. User identity will be managed by Supabase Auth, and file uploads by Supabase Storage. **The admin panel will be an integrated, route-protected section of the main Next.js application for MVP efficiency.**

### Platform and Infrastructure Choice

*   **Platform:** **Vercel**.
    *   **Rationale:** Vercel is the creator of Next.js and provides the ideal, purpose-built infrastructure for this stack. It offers a global edge network, seamless CI/CD, and automatic scaling of our serverless functions.
*   **Backend Services:** **Supabase**.
    *   **Rationale:** Supabase provides a complete, serverless backend solution (Postgres database, Authentication, Storage) that dramatically accelerates MVP development.

### Repository Structure

*   **Structure:** **Monorepo**.
*   **Monorepo Tool:** **Turborepo**.
    *   **Rationale:** Turborepo provides high-performance build caching and task orchestration, which is essential for maintaining fast development cycles in a monorepo.

### High Level Architecture Diagram

```mermaid
graph TD
    A[User's Browser] --> B[Vercel Edge Network (CDN & Caching)];
    
    subgraph "Next.js Application (on Vercel)"
        B --> C{Frontend Pages (SSR/SSG)};
        C -- Renders UI --> A;
        C -- API Calls --> D[API Routes (BFF)];
        
        subgraph "Admin Area (/admin)"
            style Admin Area fill:#f9f,stroke:#333,stroke-width:2px
            AA[Admin Login Page] --> AB{Protected Admin Pages};
            AB -- API Calls --> AC[Admin API Routes];
        end
    end

    subgraph "Application Backend Logic"
        D --> S[Service Layer];
        AC --> S;
        S --> R[Repository Layer (Data Access)];
    end

    subgraph "Backend Services (Supabase & 3rd Party)"
        R -- "SQL over PgBouncer" --> P[Postgres Database];
        S -- "JWT & RLS" --> T[Supabase Auth];
        S -- "SDK Calls" --> U[Supabase Storage];
        S -- "API Calls" --> V((Payment Gateway));
        S -- "Events" --> W((Transactional Email Service));
    end

    subgraph "Admin User"
        X[Administrator] --> AA;
    end
```

### Architectural Patterns

*   **Serverless Architecture:** The core pattern for the application.
*   **Component-Based UI:** The frontend will be built as a collection of reusable, "certified" React components.
*   **API Routes as a Backend-for-Frontend (BFF):** Our API Routes will be crafted to provide the exact data shape the UI needs for a specific page.
*   **Integrated Admin Panel (for MVP):** The admin panel will be built as a set of pages within the main Next.js application at the `/admin` route.
*   **Service & Repository Layers:** All backend logic is organized into a Service Layer (business logic) and a Repository Layer (database communication).
*   **Event-Driven Communication (for side-effects):** Actions like sending emails will be handled asynchronously to keep the core API fast and resilient.
