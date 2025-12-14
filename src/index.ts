#!/usr/bin/env node

import { aiTao } from "./ai-tao.js";

const args = process.argv.slice(2);

const showHelp = args.includes("-h") || args.includes("--help");

if (showHelp) {
  console.log(`
ai-tao - Install AI coding guideline commands

Supports: Claude Code, Cursor, GitHub Copilot, Windsurf, Gemini CLI

Usage:
  bunx ai-tao [options]

Options:
  -h, --help     Show this help message

Description:
  This tool installs slash commands for AI assistants that fetch and apply
  coding guidelines to your project.

  On first run, you'll be prompted to select which AI tools to configure.

  Supported tools and their command locations:
    - Claude Code:     .claude/commands/tao.md
    - Cursor:          .cursor/commands/tao.md
    - GitHub Copilot:  .github/prompts/tao.prompt.md
    - Windsurf:        .windsurf/workflows/tao.md
    - Gemini CLI:      .gemini/commands/tao.md

  After installation, run /tao in your AI assistant to:
    1. Fetch the latest guidelines from ai-tao
    2. Detect your project's frameworks (Next.js, etc.)
    3. Apply guidelines to your project's rules file

  Guidelines are applied using markers:
    <!-- AI-TAO:START -->
    ... guidelines ...
    <!-- AI-TAO:END -->

  Your custom content outside these markers is always preserved.

Examples:
  bunx ai-tao          # Interactive setup or update existing commands
`);
  process.exit(0);
}

aiTao().catch((error: Error) => {
  console.error("Error:", error.message);
  process.exit(1);
});
