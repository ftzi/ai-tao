import { describe, expect, test, beforeEach, afterEach } from "bun:test";
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "fs";
import { join } from "path";
import {
  generateCommandContent,
  getCommandPath,
  detectExistingCommands,
  aiTao,
  SUPPORTED_TOOLS,
  TOOL_CONFIG,
  type Tool,
} from "./ai-tao.js";

const TEST_DIR = join(import.meta.dirname, ".test-temp");

describe("TOOL_CONFIG", () => {
  test("contains all supported tools", () => {
    for (const tool of SUPPORTED_TOOLS) {
      expect(TOOL_CONFIG[tool]).toBeDefined();
      expect(TOOL_CONFIG[tool].name).toBeTruthy();
      expect(TOOL_CONFIG[tool].rulesFile).toBeTruthy();
      expect(TOOL_CONFIG[tool].commandDir).toBeTruthy();
      expect(TOOL_CONFIG[tool].commandFile).toBeTruthy();
    }
  });

  test("supported tools are claude, cursor, copilot, windsurf, gemini", () => {
    expect(SUPPORTED_TOOLS).toEqual([
      "claude",
      "cursor",
      "copilot",
      "windsurf",
      "gemini",
    ]);
  });

  test("claude config", () => {
    expect(TOOL_CONFIG.claude.rulesFile).toBe("CLAUDE.md");
    expect(TOOL_CONFIG.claude.commandDir).toBe(".claude/commands");
    expect(TOOL_CONFIG.claude.commandFile).toBe("tao.md");
  });

  test("cursor config", () => {
    expect(TOOL_CONFIG.cursor.rulesFile).toBe(".cursorrules");
    expect(TOOL_CONFIG.cursor.commandDir).toBe(".cursor/commands");
    expect(TOOL_CONFIG.cursor.commandFile).toBe("tao.md");
  });

  test("copilot config", () => {
    expect(TOOL_CONFIG.copilot.rulesFile).toBe(".github/copilot-instructions.md");
    expect(TOOL_CONFIG.copilot.commandDir).toBe(".github/prompts");
    expect(TOOL_CONFIG.copilot.commandFile).toBe("tao.prompt.md");
  });

  test("windsurf config", () => {
    expect(TOOL_CONFIG.windsurf.rulesFile).toBe(".windsurfrules");
    expect(TOOL_CONFIG.windsurf.commandDir).toBe(".windsurf/workflows");
    expect(TOOL_CONFIG.windsurf.commandFile).toBe("tao.md");
  });

  test("gemini config", () => {
    expect(TOOL_CONFIG.gemini.rulesFile).toBe("GEMINI.md");
    expect(TOOL_CONFIG.gemini.commandDir).toBe(".gemini/commands");
    expect(TOOL_CONFIG.gemini.commandFile).toBe("tao.md");
  });
});

describe("generateCommandContent", () => {
  test("generates command with correct rules file for claude", () => {
    const content = generateCommandContent("claude");

    expect(content).toContain("Apply AI-TAO coding guidelines");
    expect(content).toContain("CLAUDE.md");
    expect(content).toContain("<!-- AI-TAO:START -->");
    expect(content).toContain("<!-- AI-TAO:END -->");
    expect(content).toContain("templates/main.md");
    expect(content).toContain("flavors/nextjs.md");
  });

  test("generates command with correct rules file for cursor", () => {
    const content = generateCommandContent("cursor");

    expect(content).toContain(".cursorrules");
  });

  test("generates command with correct rules file for copilot", () => {
    const content = generateCommandContent("copilot");

    expect(content).toContain(".github/copilot-instructions.md");
  });

  test("generates command with correct rules file for windsurf", () => {
    const content = generateCommandContent("windsurf");

    expect(content).toContain(".windsurfrules");
  });

  test("generates command with correct rules file for gemini", () => {
    const content = generateCommandContent("gemini");

    expect(content).toContain("GEMINI.md");
  });
});

describe("getCommandPath", () => {
  test("returns correct path for claude", () => {
    expect(getCommandPath("claude", "/project")).toBe(
      "/project/.claude/commands/tao.md"
    );
  });

  test("returns correct path for cursor", () => {
    expect(getCommandPath("cursor", "/project")).toBe(
      "/project/.cursor/commands/tao.md"
    );
  });

  test("returns correct path for copilot", () => {
    expect(getCommandPath("copilot", "/project")).toBe(
      "/project/.github/prompts/tao.prompt.md"
    );
  });

  test("returns correct path for windsurf", () => {
    expect(getCommandPath("windsurf", "/project")).toBe(
      "/project/.windsurf/workflows/tao.md"
    );
  });

  test("returns correct path for gemini", () => {
    expect(getCommandPath("gemini", "/project")).toBe(
      "/project/.gemini/commands/tao.md"
    );
  });
});

describe("detectExistingCommands", () => {
  beforeEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
  });

  test("returns empty array when no commands exist", () => {
    const result = detectExistingCommands(TEST_DIR);
    expect(result).toEqual([]);
  });

  test("detects claude command", () => {
    mkdirSync(join(TEST_DIR, ".claude/commands"), { recursive: true });
    writeFileSync(join(TEST_DIR, ".claude/commands/tao.md"), "content");

    const result = detectExistingCommands(TEST_DIR);
    expect(result).toHaveLength(1);
    expect(result[0].tool).toBe("claude");
  });

  test("detects cursor command", () => {
    mkdirSync(join(TEST_DIR, ".cursor/commands"), { recursive: true });
    writeFileSync(join(TEST_DIR, ".cursor/commands/tao.md"), "content");

    const result = detectExistingCommands(TEST_DIR);
    expect(result).toHaveLength(1);
    expect(result[0].tool).toBe("cursor");
  });

  test("detects copilot command", () => {
    mkdirSync(join(TEST_DIR, ".github/prompts"), { recursive: true });
    writeFileSync(join(TEST_DIR, ".github/prompts/tao.prompt.md"), "content");

    const result = detectExistingCommands(TEST_DIR);
    expect(result).toHaveLength(1);
    expect(result[0].tool).toBe("copilot");
  });

  test("detects windsurf command", () => {
    mkdirSync(join(TEST_DIR, ".windsurf/workflows"), { recursive: true });
    writeFileSync(join(TEST_DIR, ".windsurf/workflows/tao.md"), "content");

    const result = detectExistingCommands(TEST_DIR);
    expect(result).toHaveLength(1);
    expect(result[0].tool).toBe("windsurf");
  });

  test("detects gemini command", () => {
    mkdirSync(join(TEST_DIR, ".gemini/commands"), { recursive: true });
    writeFileSync(join(TEST_DIR, ".gemini/commands/tao.md"), "content");

    const result = detectExistingCommands(TEST_DIR);
    expect(result).toHaveLength(1);
    expect(result[0].tool).toBe("gemini");
  });

  test("detects multiple commands", () => {
    mkdirSync(join(TEST_DIR, ".claude/commands"), { recursive: true });
    mkdirSync(join(TEST_DIR, ".cursor/commands"), { recursive: true });
    writeFileSync(join(TEST_DIR, ".claude/commands/tao.md"), "content");
    writeFileSync(join(TEST_DIR, ".cursor/commands/tao.md"), "content");

    const result = detectExistingCommands(TEST_DIR);
    expect(result).toHaveLength(2);
    expect(result.map((r) => r.tool)).toContain("claude");
    expect(result.map((r) => r.tool)).toContain("cursor");
  });
});

describe("aiTao", () => {
  beforeEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
    mkdirSync(TEST_DIR, { recursive: true });
  });

  afterEach(() => {
    if (existsSync(TEST_DIR)) {
      rmSync(TEST_DIR, { recursive: true });
    }
  });

  describe("Claude Code", () => {
    test("creates .claude/commands/tao.md", async () => {
      const result = await aiTao({
        cwd: TEST_DIR,
        _skipPrompts: true,
        _selectedTools: ["claude"],
      });

      expect(result.commands).toHaveLength(1);
      expect(result.commands[0].tool).toBe("claude");
      expect(result.commands[0].commandPath).toBe(".claude/commands/tao.md");
      expect(result.commands[0].created).toBe(true);

      const commandPath = join(TEST_DIR, ".claude/commands/tao.md");
      expect(existsSync(commandPath)).toBe(true);

      const content = readFileSync(commandPath, "utf-8");
      expect(content).toContain("CLAUDE.md");
      expect(content).toContain("AI-TAO");
    });
  });

  describe("Cursor", () => {
    test("creates .cursor/commands/tao.md", async () => {
      const result = await aiTao({
        cwd: TEST_DIR,
        _skipPrompts: true,
        _selectedTools: ["cursor"],
      });

      expect(result.commands).toHaveLength(1);
      expect(result.commands[0].tool).toBe("cursor");
      expect(result.commands[0].commandPath).toBe(".cursor/commands/tao.md");
      expect(result.commands[0].created).toBe(true);

      const commandPath = join(TEST_DIR, ".cursor/commands/tao.md");
      expect(existsSync(commandPath)).toBe(true);

      const content = readFileSync(commandPath, "utf-8");
      expect(content).toContain(".cursorrules");
    });
  });

  describe("GitHub Copilot", () => {
    test("creates .github/prompts/tao.prompt.md", async () => {
      const result = await aiTao({
        cwd: TEST_DIR,
        _skipPrompts: true,
        _selectedTools: ["copilot"],
      });

      expect(result.commands).toHaveLength(1);
      expect(result.commands[0].tool).toBe("copilot");
      expect(result.commands[0].commandPath).toBe(".github/prompts/tao.prompt.md");
      expect(result.commands[0].created).toBe(true);

      const commandPath = join(TEST_DIR, ".github/prompts/tao.prompt.md");
      expect(existsSync(commandPath)).toBe(true);

      const content = readFileSync(commandPath, "utf-8");
      expect(content).toContain(".github/copilot-instructions.md");
    });
  });

  describe("Windsurf", () => {
    test("creates .windsurf/workflows/tao.md", async () => {
      const result = await aiTao({
        cwd: TEST_DIR,
        _skipPrompts: true,
        _selectedTools: ["windsurf"],
      });

      expect(result.commands).toHaveLength(1);
      expect(result.commands[0].tool).toBe("windsurf");
      expect(result.commands[0].commandPath).toBe(".windsurf/workflows/tao.md");
      expect(result.commands[0].created).toBe(true);

      const commandPath = join(TEST_DIR, ".windsurf/workflows/tao.md");
      expect(existsSync(commandPath)).toBe(true);

      const content = readFileSync(commandPath, "utf-8");
      expect(content).toContain(".windsurfrules");
    });
  });

  describe("Gemini CLI", () => {
    test("creates .gemini/commands/tao.md", async () => {
      const result = await aiTao({
        cwd: TEST_DIR,
        _skipPrompts: true,
        _selectedTools: ["gemini"],
      });

      expect(result.commands).toHaveLength(1);
      expect(result.commands[0].tool).toBe("gemini");
      expect(result.commands[0].commandPath).toBe(".gemini/commands/tao.md");
      expect(result.commands[0].created).toBe(true);

      const commandPath = join(TEST_DIR, ".gemini/commands/tao.md");
      expect(existsSync(commandPath)).toBe(true);

      const content = readFileSync(commandPath, "utf-8");
      expect(content).toContain("GEMINI.md");
    });
  });

  describe("Multiple tools", () => {
    test("creates commands for all selected tools", async () => {
      const result = await aiTao({
        cwd: TEST_DIR,
        _skipPrompts: true,
        _selectedTools: ["claude", "cursor", "copilot", "windsurf", "gemini"],
      });

      expect(result.commands).toHaveLength(5);

      const tools = result.commands.map((c) => c.tool);
      expect(tools).toContain("claude");
      expect(tools).toContain("cursor");
      expect(tools).toContain("copilot");
      expect(tools).toContain("windsurf");
      expect(tools).toContain("gemini");

      expect(existsSync(join(TEST_DIR, ".claude/commands/tao.md"))).toBe(true);
      expect(existsSync(join(TEST_DIR, ".cursor/commands/tao.md"))).toBe(true);
      expect(existsSync(join(TEST_DIR, ".github/prompts/tao.prompt.md"))).toBe(true);
      expect(existsSync(join(TEST_DIR, ".windsurf/workflows/tao.md"))).toBe(true);
      expect(existsSync(join(TEST_DIR, ".gemini/commands/tao.md"))).toBe(true);
    });
  });

  describe("Update mode", () => {
    test("detects existing commands and updates them", async () => {
      // Create existing command
      mkdirSync(join(TEST_DIR, ".cursor/commands"), { recursive: true });
      writeFileSync(
        join(TEST_DIR, ".cursor/commands/tao.md"),
        "old content",
        "utf-8"
      );

      const result = await aiTao({ cwd: TEST_DIR, _skipPrompts: true });

      expect(result.commands).toHaveLength(1);
      expect(result.commands[0].tool).toBe("cursor");
      expect(result.commands[0].created).toBe(false);

      const content = readFileSync(
        join(TEST_DIR, ".cursor/commands/tao.md"),
        "utf-8"
      );
      expect(content).not.toBe("old content");
      expect(content).toContain("AI-TAO");
    });

    test("updates all existing commands", async () => {
      // Create existing commands for claude and windsurf
      mkdirSync(join(TEST_DIR, ".claude/commands"), { recursive: true });
      mkdirSync(join(TEST_DIR, ".windsurf/workflows"), { recursive: true });
      writeFileSync(join(TEST_DIR, ".claude/commands/tao.md"), "old");
      writeFileSync(join(TEST_DIR, ".windsurf/workflows/tao.md"), "old");

      const result = await aiTao({ cwd: TEST_DIR, _skipPrompts: true });

      expect(result.commands).toHaveLength(2);
      expect(result.commands.map((c) => c.tool)).toContain("claude");
      expect(result.commands.map((c) => c.tool)).toContain("windsurf");
      expect(result.commands.every((c) => c.created === false)).toBe(true);
    });
  });

  describe("defaults to claude when no selection", () => {
    test("uses claude as default tool", async () => {
      const result = await aiTao({
        cwd: TEST_DIR,
        _skipPrompts: true,
        // No _selectedTools provided
      });

      expect(result.commands).toHaveLength(1);
      expect(result.commands[0].tool).toBe("claude");
    });
  });
});
