import { existsSync, mkdirSync, writeFileSync } from "fs";
import { join, dirname } from "path";
import * as readline from "readline";

const BASE_URL =
  "https://raw.githubusercontent.com/ftzi/ai-tao/refs/heads/main/templates";

export const SUPPORTED_TOOLS = [
  "claude",
  "cursor",
  "copilot",
  "windsurf",
  "gemini",
] as const;
export type Tool = (typeof SUPPORTED_TOOLS)[number];

export type ToolConfig = {
  name: string;
  rulesFile: string;
  commandDir: string;
  commandFile: string;
};

export const TOOL_CONFIG: Record<Tool, ToolConfig> = {
  claude: {
    name: "Claude Code",
    rulesFile: "CLAUDE.md",
    commandDir: ".claude/commands",
    commandFile: "tao.md",
  },
  cursor: {
    name: "Cursor",
    rulesFile: ".cursorrules",
    commandDir: ".cursor/commands",
    commandFile: "tao.md",
  },
  copilot: {
    name: "GitHub Copilot",
    rulesFile: ".github/copilot-instructions.md",
    commandDir: ".github/prompts",
    commandFile: "tao.prompt.md",
  },
  windsurf: {
    name: "Windsurf",
    rulesFile: ".windsurfrules",
    commandDir: ".windsurf/workflows",
    commandFile: "tao.md",
  },
  gemini: {
    name: "Gemini CLI",
    rulesFile: "GEMINI.md",
    commandDir: ".gemini/commands",
    commandFile: "tao.md",
  },
};

export type AiTaoOptions = {
  cwd?: string;
  // For testing: skip interactive prompts
  _skipPrompts?: boolean;
  _selectedTools?: Tool[];
};

export type AiTaoResult = {
  commands: Array<{
    tool: Tool;
    commandPath: string;
    created: boolean;
  }>;
};

// Interactive prompt helpers
function createReadlineInterface(): readline.Interface {
  return readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });
}

async function promptQuestion(
  rl: readline.Interface,
  question: string
): Promise<string> {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim().toLowerCase());
    });
  });
}

export async function promptToolSelection(
  rl: readline.Interface
): Promise<Tool[]> {
  console.log("\nWhich AI tools do you want to set up?\n");

  const toolList = SUPPORTED_TOOLS.map((tool, i) => {
    const config = TOOL_CONFIG[tool];
    return `  ${i + 1}. ${config.name}`;
  }).join("\n");

  console.log(toolList);
  console.log(
    "\nEnter numbers separated by spaces (e.g., '1 2 3'), or 'all':"
  );

  const answer = await promptQuestion(rl, "> ");

  if (answer === "all" || answer === "a") {
    return [...SUPPORTED_TOOLS];
  }

  const numbers = answer
    .split(/[\s,]+/)
    .map((n) => parseInt(n, 10))
    .filter((n) => !isNaN(n) && n >= 1 && n <= SUPPORTED_TOOLS.length);

  if (numbers.length === 0) {
    // Default to claude if no valid selection
    console.log("No valid selection, defaulting to Claude Code.");
    return ["claude"];
  }

  return numbers.map((n) => SUPPORTED_TOOLS[n - 1]);
}

export function generateCommandContent(tool: Tool): string {
  const config = TOOL_CONFIG[tool];
  const rulesFile = config.rulesFile;

  return `Apply AI-TAO coding guidelines to this project.

## Instructions

1. Fetch the base guidelines from:
   ${BASE_URL}/main.md

2. Detect the project's frameworks and fetch applicable flavor guidelines:
   - If Next.js project (has next.config.* or package.json with "next" dependency):
     ${BASE_URL}/flavors/nextjs.md

3. Update this project's \`${rulesFile}\`:
   - If the file doesn't exist, create it with the fetched guidelines wrapped in markers
   - If it exists, look for \`<!-- AI-TAO:START -->\` and \`<!-- AI-TAO:END -->\` markers
   - If markers exist, replace content between them with the new guidelines
   - If no markers, add the guidelines with markers at the end of the file
   - ALWAYS preserve user content outside the markers

4. Report what was updated.
`;
}

export function getCommandPath(tool: Tool, cwd: string): string {
  const config = TOOL_CONFIG[tool];
  return join(cwd, config.commandDir, config.commandFile);
}

export function detectExistingCommands(
  cwd: string
): { tool: Tool; commandPath: string }[] {
  const found: { tool: Tool; commandPath: string }[] = [];

  for (const tool of SUPPORTED_TOOLS) {
    const commandPath = getCommandPath(tool, cwd);
    if (existsSync(commandPath)) {
      found.push({ tool, commandPath });
    }
  }

  return found;
}

export async function aiTao(options: AiTaoOptions = {}): Promise<AiTaoResult> {
  const { cwd = process.cwd(), _skipPrompts = false, _selectedTools } = options;

  // Detect existing command files
  const existingCommands = detectExistingCommands(cwd);

  let selectedTools: Tool[];

  if (existingCommands.length > 0) {
    // Update mode: just update existing command files
    selectedTools = existingCommands.map((e) => e.tool);
    console.log(
      `\nUpdating existing AI-TAO commands for: ${selectedTools.map((t) => TOOL_CONFIG[t].name).join(", ")}`
    );
  } else {
    // Setup mode: prompt for tools
    if (_skipPrompts) {
      selectedTools = _selectedTools ?? ["claude"];
    } else {
      const rl = createReadlineInterface();
      try {
        console.log("\n🥋 AI-TAO: Install coding guidelines for AI assistants");
        selectedTools = await promptToolSelection(rl);
      } finally {
        rl.close();
      }
    }
  }

  const results: AiTaoResult["commands"] = [];

  for (const tool of selectedTools) {
    const config = TOOL_CONFIG[tool];
    const commandPath = getCommandPath(tool, cwd);
    const commandDir = dirname(commandPath);

    // Ensure directory exists
    if (!existsSync(commandDir)) {
      mkdirSync(commandDir, { recursive: true });
    }

    const fileExists = existsSync(commandPath);
    const content = generateCommandContent(tool);

    writeFileSync(commandPath, content, "utf-8");

    results.push({
      tool,
      commandPath: join(config.commandDir, config.commandFile),
      created: !fileExists,
    });
  }

  // Print success message
  console.log("\n✅ AI-TAO commands installed!\n");
  console.log("Usage: Run the /tao command in your AI assistant to apply guidelines.\n");

  for (const result of results) {
    const action = result.created ? "Created" : "Updated";
    console.log(`  ${action}: ${result.commandPath}`);
  }

  console.log("");

  return { commands: results };
}
