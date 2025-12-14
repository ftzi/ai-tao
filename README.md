<div align="center">

<img src="logo.svg" alt="ai-tao logo" width="120"/>

# ai-tao

Install AI coding guideline commands for your projects.

</div>

## Supported AI Tools

| Tool | Command Location |
|------|------------------|
| **Claude Code** | `.claude/commands/tao.md` |
| **Cursor** | `.cursor/commands/tao.md` |
| **GitHub Copilot** | `.github/prompts/tao.prompt.md` |
| **Windsurf** | `.windsurf/workflows/tao.md` |
| **Gemini CLI** | `.gemini/commands/tao.md` |

## Quick Start

```bash
bunx ai-tao
```

Select which AI tools you use, and ai-tao installs the `/tao` command for each.

Then, in your AI assistant, run:

```
/tao
```

This fetches the latest coding guidelines and applies them to your project's rules file (e.g., `CLAUDE.md`, `.cursorrules`).

## How It Works

1. **Install**: Run `bunx ai-tao` to install slash commands for your AI tools
2. **Use**: Run `/tao` in your AI assistant whenever you want to update guidelines
3. **Customize**: Add your own content to the rules file - it's preserved on updates

The `/tao` command:
- Fetches the latest guidelines from [ai-tao](https://github.com/ftzi/ai-tao)
- Detects your project's frameworks (Next.js, etc.) and applies relevant flavors
- Updates your rules file using markers to preserve your custom content

## Managed Section

When `/tao` runs, it wraps the guidelines in markers:

```markdown
<!-- AI-TAO:START -->
... guidelines from ai-tao ...
<!-- AI-TAO:END -->
```

Your custom content **outside** these markers is always preserved:

```markdown
# My Project-Specific Notes

Custom content here is preserved!

<!-- AI-TAO:START -->
... auto-managed guidelines ...
<!-- AI-TAO:END -->

## More Custom Content

This is also preserved!
```

## Rules Files

Each AI tool has its own rules file that `/tao` updates:

| Tool | Rules File |
|------|------------|
| Claude Code | `CLAUDE.md` |
| Cursor | `.cursorrules` |
| GitHub Copilot | `.github/copilot-instructions.md` |
| Windsurf | `.windsurfrules` |
| Gemini CLI | `GEMINI.md` |

## Available Flavors

Flavors are automatically detected based on your project:

| Flavor | Detection |
|--------|-----------|
| `nextjs` | `next.config.*` or `"next"` in package.json |

More flavors coming soon! Contributions welcome.

## Updating Commands

Run `bunx ai-tao` again to update the command files themselves. This is only needed if the command format changes - the guidelines are always fetched fresh when you run `/tao`.

## Contributing Flavors

To add a new flavor:

1. Create a new file in `templates/flavors/<flavor-name>.md`
2. Update the detection logic in the command template
3. Submit a PR!

## License

MIT
