# Cape Town Experience Broker Fullstack Architecture Document

## Introduction

This document outlines the complete fullstack architecture for the Cape Town Experience Broker, including the frontend application, backend services, and their integration. It serves as the single source of truth for all technical decisions, guiding the AI developer agents to ensure consistency and adherence to the chosen patterns. This unified architecture is designed to directly support the high-performance, SEO-focused, and scalable requirements defined in the PRD and UI/UX Specification.

### Starter Template or Existing Project

The project will be bootstrapped using a production-grade starter. We will use the `create-next-app` command-line interface with the official Turborepo starter. This provides a pre-configured monorepo with Next.js, TypeScript, and ESLint, which is perfectly aligned with our technical assumptions.

### Change Log

| Date | Version | Description | Author |
| :--- | :--- | :--- | :--- |
| 2024-05-24 | 1.0 | Initial finalized draft of the architecture based on v1.1 of PRD and Spec | Winston (Architect) |

## High Level Architecture

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

## Tech Stack

| Category | Technology | Version | Purpose | Rationale |
| :--- | :--- | :--- | :--- | :--- |
| **Language** | TypeScript | `~5.4` | Primary language | End-to-end type safety, modern features, excellent tooling. |
| **Monorepo Tool** | Turborepo | `~1.13` | Codebase management | High-performance build caching and task orchestration for our monorepo. |
| **Framework** | Next.js (App Router)| `~14.2` | Full-stack web framework | The premier React framework for serverless, SEO-friendly, high-performance apps. |
| **UI Library** | React | `~18.3` | Frontend UI library | The industry standard for building component-based user interfaces. |
| **Styling** | Tailwind CSS | `~3.4` | Utility-first CSS | Rapid, consistent, and maintainable styling, works perfectly with v0. |
| **Component Toolkit**| shadcn/ui | `~0.8` | Accessible UI components| The foundation of our "Certified Component" library. |
| **State Management** | Zustand | `~4.5` | Client-Side State | A simple, powerful library for managing global UI state. |
| **Hosting Platform** | Vercel | N/A | Deployment & Infrastructure| The ideal, purpose-built platform for a Next.js application. |
| **Backend-as-a-Service**| Supabase | `~2.4` | Database, Auth, Storage| A complete, serverless backend that accelerates MVP development. |
| **Auth Helper** | `@supabase/ssr` | `~0.3` | Next.js Auth Integration | The official library for securely managing auth state across Next.js. |
| **Database** | PostgreSQL | `15` | Relational database | A powerful and reliable SQL database provided by Supabase. |
| **Database ORM** | Drizzle ORM | `~0.30`| Type-Safe SQL Querying| Mandatory for all database interactions. Provides end-to-end type safety. |
| **Payment Gateway**| Stripe | `~15.7` | Payment processing | Industry leader for secure, developer-friendly payment integration. |
| **Unit Testing** | Vitest | `~1.6` | Frontend/Backend unit tests| A modern, fast, and Jest-compatible test runner. |
| **E2E Testing** | Playwright | `~1.44` | End-to-end browser tests| A powerful tool for reliable testing of the booking flow. |
| **Linting** | ESLint | `~8.57` | Code quality & consistency| Enforces a consistent code style and catches common errors. |
| **Form Management** | React Hook Form | `~7.51` | Frontend form handling | A performant library for managing our checkout forms. |
| **Email Service** | Resend | `~3.2` | Transactional emails | A modern, developer-friendly email API for sending booking confirmations. |
| **Icon Library** | Lucide Icons | `~0.37` | UI icons | The default, high-quality icon set for shadcn/ui. |

### Technology Configuration and Policies

1.  **Monorepo Base Configuration:** A root `tsconfig.base.json` (strict mode) and `.eslintrc.js` (no `any` type) will be created and extended by all packages.
2.  **Authentication Flow:** All authentication logic must be handled through the official `@supabase/ssr` helper library.
3.  **Data Access Layer:** The Repository Pattern is mandatory. All database queries must be written using Drizzle ORM.
4.  **Client-Side State Management:** Global client-side state must be managed using Zustand.

## Data Models & Database Schema

The "Pragmatic MVP" schema is our definitive data foundation. It focuses on the core entities required for launch while being extensible for the future.

```sql
-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table: tours
CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    name TEXT NOT NULL,
    description TEXT,
    itinerary TEXT,
    duration_days INT NOT NULL CHECK (duration_days > 0),
    category TEXT NOT NULL CHECK (category IN ('safari', 'marine', 'mountain', 'cultural')),
    is_active BOOLEAN NOT NULL DEFAULT false
);

-- Table: tour_images
CREATE TABLE tour_images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    image_url TEXT NOT NULL,
    alt_text TEXT,
    sort_order INT NOT NULL DEFAULT 0
);

-- Table: scheduled_tours
CREATE TABLE scheduled_tours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    tour_id UUID NOT NULL REFERENCES tours(id) ON DELETE CASCADE,
    tour_date DATE NOT NULL,
    price_per_person_cents INT NOT NULL CHECK (price_per_person_cents >= 0),
    total_slots INT NOT NULL CHECK (total_slots >= 0),
    booked_slots INT NOT NULL DEFAULT 0 CHECK (booked_slots >= 0),
    UNIQUE(tour_id, tour_date)
);

-- Table: bookings
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    scheduled_tour_id UUID NOT NULL REFERENCES scheduled_tours(id),
    guest_name TEXT NOT NULL,
    guest_email TEXT NOT NULL,
    group_size INT NOT NULL CHECK (group_size > 0),
    total_price_cents INT NOT NULL CHECK (total_price_cents >= 0),
    payment_id TEXT NOT NULL UNIQUE
);
```

## API Specification

The API will be implemented as Next.js API Routes, following an OpenAPI 3.0 contract. The specification ensures a clear separation between public, booking, and admin functionalities. *(Refer to the refined API spec for full endpoint details.)*

## Unified Project Structure

The project will be organized as a Turborepo monorepo with a single, unified Next.js application for the MVP.

```plaintext
cape-town-experiences/
├── apps/
│   └── web/                    # The main Next.js application
│       ├── src/
│       │   ├── app/            # Next.js App Router
│       │   ├── components/       # Certified UI Components
│       │   ├── lib/              # Drizzle schema & client
│       │   ├── services/         # Service & Repository layers
│       │   └── stores/           # Zustand state stores
│       └── ...
├── packages/
│   ├── config/                 # Shared ESLint & TypeScript configs
│   └── types/                    # Shared (auto-generated) types
└── ...
```