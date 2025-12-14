This file provides guidance to the AI when working with code in this repository.

**Important:** If you discover any information in this file that is no longer accurate or has become outdated, please update it immediately to reflect the current state of the codebase.

**Workflow Rule:** Always run `bun ok` after finishing a task or when facing issues. This command runs type checking and linting across the entire codebase and must fully pass before considering a task complete.

**No Manual Tests:** Never include manual verification tasks in Livespec plans or task lists. All validation must be automated (`bun ok`, automated tests, etc.). Manual browser testing, viewport testing, and similar human-required verification steps are forbidden.

**NEVER commit or push:** Do NOT run `git add`, `git commit`, or `git push`. The user handles all git operations manually.

## Maintaining This File

Update CLAUDE.md when you make changes that affect:

- **Architecture & Structure**: Monorepo organization, new workspaces, routing patterns, data flow
- **Development Workflow**: New commands, build process changes, testing setup
- **Key Patterns & Conventions**: File organization, API patterns
- **Tool & Library Migrations**: Package manager changes, major dependency updates, framework migrations
- **Configuration Changes**: TypeScript, Biome, or build tool configurations that affect how developers work

Do NOT update for:

- Individual bug fixes or routine component additions
- Code-level details that can be read from files
- Temporary workarounds or one-off solutions
- Generic best practices unrelated to this specific project

Keep entries brief and structural. Focus on "why" and "how the pieces fit together", not "what's in each file".

## Project Overview

<!-- Describe what this project does in 1-2 sentences -->

## Common Commands

<!-- List the most frequently used commands for this project -->

### Required Commands

- `bun ok` - **REQUIRED** - Run type checking, linting, and tests. Must pass before considering any task complete.
- `bun test` - Run unit tests
- `bun e2e` - Run e2e tests (if applicable)

**IMPORTANT: Never run `bun dev`, `next dev`, or similar dev server commands directly.** Dev servers can cause lock file issues and port conflicts. Instead:
- For e2e tests: Use `bun e2e` which should start the dev server automatically
- For manual testing: Ask the user to run the dev server themselves

## Architecture

<!-- Document the high-level structure: folders, packages, key files, data flow -->

<!-- If using Turborepo, document the monorepo structure here:
- apps/ - Application projects
- packages/ - Shared packages
-->

## Code Quality Standards

**Development Workflow:**

- **ALWAYS use `bun ok`** for type checking and linting - never use `bun ts`, `bun lint`, or `tsc` directly
- **NEVER run `tsc` directly** - not even for single files - always use `bun ok`
- **NEVER run `bun build` or `bun run build`** - only use `bun ok` for verification
- **CRITICAL: `bun ok` MUST ALWAYS be run from the project root directory**
  - NEVER run it from subdirectories like `apps/*` or `packages/*`
  - This is especially important for Turborepo monorepos - the command must run from root to check all packages
- `bun ok` runs both type checking and linting, leverages Turbo cache, and is always preferred
- NEVER commit or push code - all git operations must be explicitly requested by the user

**Code Principles:** Follow Clean Code + SOLID + KISS + YAGNI

- **Clean Code**: Self-documenting, readable code with meaningful names and single responsibility
- **SOLID**: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion
- **KISS**: Simplest solution that solves the problem, avoid over-engineering
- **YAGNI**: Don't add functionality until actually needed

**TypeScript Conventions:**

- **NEVER use `any` type** - Use `unknown` if type is truly unknown, but even that should be avoided
- **NEVER use `as any` assertions** - Find the proper type or use specific type assertions
- **NEVER use `interface`** - Always use `type` instead
- Reuse existing types - don't create duplicate types
- Use Zod schemas for runtime validation when appropriate
- Prefer optional chaining for callbacks: `onComplete?.(data)` instead of `if (onComplete) onComplete(data)`

**Import Conventions:**

- **NEVER use barrel files** - Barrel files (index.ts files that re-export everything) are forbidden
  - Exception: Public API entry points (e.g., `src/index.ts` for libraries)
- **Always import directly from source files** - Import from the actual file where the code is defined
- This improves tree-shaking, makes dependencies explicit, and reduces circular dependency issues
- **Avoid dynamic imports** - Prefer static `import` over `await import()`. Only use dynamic imports for genuine code splitting or conditional loading based on runtime conditions.

**Function Parameters:**

- Prefer object parameters over multiple direct parameters
- Example: `function foo({ name, age }: { name: string; age: number })` instead of `function foo(name: string, age: number)`

**Comments:**

- Do NOT add comments explaining what changes you just made
- Only add comments for complex logic that isn't self-evident
- Use JSDoc-style comments for public APIs

**Console Logging:**

- Always stringify objects: `console.log('DEBUG:', JSON.stringify(data, null, 2))`
- **Always clean up debug code** - Remove all console logs and debugging code once the root cause is found

**UI Design Philosophy:**

The UI should be **polished**, **modern**, and **professional**:

- **MUST be mobile-friendly** - Every web page MUST be fully responsive and work perfectly on mobile devices. This is non-negotiable.
- Clean, minimal interface with purposeful whitespace
- Subtle glassmorphism and depth effects
- Smooth micro-interactions and transitions
- Professional color palette with excellent contrast
- Polished details that delight users

**React Conventions:**

- **ALWAYS follow the Rules of Hooks**:
  - Only call hooks at the top level - never inside loops, conditions, or nested functions
  - Do not return early if there's a hook later in the component
  - Hooks must be called in the same order every render

**Testing:**

- **Unit tests are REQUIRED** - Always add unit tests when adding or modifying functions/utilities. Tests ensure a solid and reliable product.
- Test files should be co-located with source files (e.g., `schema.ts` → `schema.test.ts`)
- NEVER use `timeout` parameters when running tests - run tests normally without artificial timeouts
- Trust the test framework's default timeout behavior
- **Post-task test verification** - After completing any task, verify test coverage for changed files:
  - Modified behavior → Update affected tests to match
  - New functionality → Add tests for it
  - Tests must catch regressions to enable confident iteration
  - A task is not complete until its tests are updated and passing

**E2E Testing:**

- **Prefer unit tests over e2e** - Unit tests are much faster to run and easier to fix. Use e2e only for: full user flows, visual regressions, complex multi-component interactions
- **Minimize test count** - Prefer fewer, comprehensive tests over many small ones. Combine related actions into single tests
- **Avoid trivial tests** - Don't test if something "renders" - other tests already verify this implicitly
- **Each test must be fast** - E2e tests are expensive; keep them lean and purposeful

**Implementation Standards:**

- When asked to implement something, implement it FULLY and completely
- NEVER add placeholder comments like "to be implemented later"
- If something cannot be completed, explain why explicitly rather than leaving incomplete code
- **NEVER create documentation files** unless explicitly requested
  - The only exception: updating existing CLAUDE.md when architecture changes

**Documentation Synchronization:**

- **Keep README.md in sync with the code**
- When making changes to public APIs or features, update the README to reflect those changes
- Verify code examples in documentation are copy-paste correct

## Important Versions

**KEEP THIS SECTION AUTOMATICALLY UPDATED when dependencies change.**

- **Package Manager:** bun
- **Node Version:** >= 20
<!-- Add other important versions:
- **React:** x.x.x
- **Next.js:** x.x.x
- **TypeScript:** x.x.x
-->
