## Next.js

This is a Next.js project.

**When starting work on a Next.js project, ALWAYS call the `init` tool from next-devtools-mcp FIRST to set up proper context and establish documentation requirements. Do this automatically without being asked.**

- **Server Components:** Default to Server Components; use `"use client"` directive only when needed
- Don't import Server Components into Client Components - pass as `children` instead
- `"use client"` files cannot export Server Actions - keep them in separate files
