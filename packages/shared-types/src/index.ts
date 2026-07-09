/**
 * @examforge/shared-types
 *
 * Single source of truth for types shared across the monorepo:
 *   - Prisma model types (generated from packages/db)
 *   - API contract types (generated from FastAPI OpenAPI spec)
 *   - Parser output schema (ParsedExam, ParsedQuestion, ParsedOption)
 *
 * Sub-path exports (once populated):
 *   import type { ... } from '@examforge/shared-types';          // Prisma models
 *   import type { ... } from '@examforge/shared-types/api';      // API contracts
 *   import type { ... } from '@examforge/shared-types/parser';   // Parser schema
 *
 * TODO(1.3.1): export Prisma-generated types from packages/db
 * TODO(1.3.3): export TypeScript types generated from FastAPI OpenAPI spec
 */

// Placeholder export to satisfy TypeScript `rootDir` requirement.
// Remove when generated types are added.
export {};
