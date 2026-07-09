/**
 * Parser output schema types — shared between apps/web and apps/doc-processor.
 *
 * These mirror the Pydantic models in apps/doc-processor/app/schema/
 * and are the single source of truth for the web ↔ processor contract
 * (CLAUDE.md §2.4, ARCHITECTURE-REVIEW.md §5.1 A3).
 *
 * TODO(1.3.2): define ParsedExam, ParsedQuestion, ParsedOption interfaces
 * TODO(1.3.3): generate from FastAPI OpenAPI spec to keep in sync
 */
export {};
