# Tech Stack

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
