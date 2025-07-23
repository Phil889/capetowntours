# Unified Project Structure

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