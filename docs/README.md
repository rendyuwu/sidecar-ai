# 📚 Sidecar AI Documentation

Welcome to the Sidecar AI documentation hub!

## Getting Started

### New Users Start Here
1. **[Installation Guide](../README.md#-installation)** - Get Sidecar AI running
2. **[Quick Start](../README.md#-quick-start)** - Create your first sidecar
3. **[AI Template Maker Guide](AI-MAKER-GUIDE.md)** - Easiest way to create sidecars

### For Template Users
1. **[Template Installation](../templates/INSTALLATION.md)** - Import pre-made templates
2. **[Template Library](../templates/README.md)** - Browse available templates
3. **[Creating Templates](../templates/README.md#creating-your-own-templates)** - Make your own

## Core Concepts

### What is a Sidecar?

A **sidecar** is an auxiliary AI task that runs alongside your main conversation. Examples:
- Reader comment sections
- Emotion tracking
- Relationship stats
- Meta-commentary
- Scene descriptions
- Behind-the-scenes content

### Why Use Sidecars?

**Cost Optimization:** Run auxiliary tasks on cheap models (GPT-4o-mini, Deepseek) while keeping expensive models (GPT-4, Claude Opus) for main roleplay.

**Rich Experiences:** Add meta-layers, tracking, and commentary without cluttering your main conversation.

**Flexibility:** Auto-trigger for consistent tracking, or manual-trigger for optional features.

## Documentation Index

### User Guides
- **[Main README](../README.md)** - Overview, installation, basic usage
- **[AI Template Maker](AI-MAKER-GUIDE.md)** - Create sidecars with AI assistance
- **[Template Library](../templates/README.md)** - Pre-made configurations
- **[Template Installation](../templates/INSTALLATION.md)** - Quick start with templates

### Technical Documentation
- **[Security](../SECURITY.md)** - Threat model and security measures
- **[Changelog](../CHANGELOG.md)** - Version history and changes
- **[Contributing](../README.md#-development)** - How to contribute

## Feature Guides

### AI Template Maker
The easiest way to create sidecars - just describe what you want!
- [Complete Guide](AI-MAKER-GUIDE.md)
- [Example Prompts](AI-MAKER-GUIDE.md#step-by-step-guide)
- [Tips for Better Results](AI-MAKER-GUIDE.md#tips-for-better-results)

### Template Library
Pre-made configurations ready to import:
- [Available Templates](../templates/README.md#available-templates)
- [Installation Methods](../templates/INSTALLATION.md)
- [Creating Your Own](../templates/README.md#creating-your-own-templates)

### Advanced Features
- [Batch Processing](../README.md#batch-processing)
- [Manual Triggering](../README.md#manual-triggering-via-console)
- [Context Control](../README.md#context-control)

## Quick Reference

### Trigger Modes
- **Auto:** Runs after every AI response
- **Manual:** Trigger via Extensions menu button

### Format Styles
- **HTML+CSS:** Rich visual formatting (default, recommended)
- **Markdown:** Simple text formatting
- **XML:** Structured data
- **Beautify:** Creative, theatrical styling

### Response Locations
- **Outside Chatlog:** Shows in expandable cards (recommended)
- **Chat History:** Injects as HTML comment (accessible to main AI)

### Context Settings
- **messagesCount:** How many recent messages (1-50)
- **includeCharCard:** Include character personality
- **includeUserCard:** Include user personality
- **includeWorldCard:** Include world/setting info
- **includeHistory:** Include previous sidecar outputs
- **historyDepth:** Number of previous outputs (minimum 1)

## Use Case Examples

### Content Creators
- Reader comment sections → `commentary-section.json`
- Relationship tracking → `relationship-matrix.json`
- Behind-the-scenes → `actor-interview.json`

### Writers
- Narrative analysis → `directors-commentary.json`
- Perspective shifts → `perspective-flip.json`
- Craft feedback → Use AI Maker to create critique tools

### Roleplayers
- Emotion tracking → Use AI Maker
- Stats and metrics → `relationship-matrix.json`
- Visual enhancements → `art-prompt-generator.json`

### Experimenters
- Custom workflows → AI Maker + manual editing
- Multi-model setups → Batch processing
- Integration experiments → Custom formats + webhooks

## Troubleshooting

Common issues and solutions:

**Extension not loading?**
→ [Installation Troubleshooting](../README.md#verify-installation)

**Sidecars not running?**
→ [Runtime Troubleshooting](../README.md#sidecars-not-running)

**AI Maker not working?**
→ [AI Maker Troubleshooting](../README.md#ai-template-maker-not-working)

**Security concerns?**
→ [Security Documentation](../SECURITY.md)

## Community

### Get Help
- [GitHub Issues](https://github.com/skirianov/sidecar-ai/issues) - Bug reports and questions
- [Discussions](https://github.com/skirianov/sidecar-ai/discussions) - General discussion

### Contribute
- [Contributing Guide](../README.md#-development)
- [Submit Templates](../templates/README.md#sharing-templates)
- [Report Bugs](https://github.com/skirianov/sidecar-ai/issues/new)

### Stay Updated
- Watch the [GitHub repo](https://github.com/skirianov/sidecar-ai) for updates
- Check [Changelog](../CHANGELOG.md) for new features
- Star ⭐ the repo if you find it useful!

### Support Development
- [☕ Support on Ko-fi](https://ko-fi.com/sidecarai) - Help keep this project maintained and enable new features!

## Need More Help?

Can't find what you're looking for?

1. Check [Main README](../README.md)
2. Search [existing issues](https://github.com/skirianov/sidecar-ai/issues)
3. Ask in [discussions](https://github.com/skirianov/sidecar-ai/discussions)
4. Open a [new issue](https://github.com/skirianov/sidecar-ai/issues/new)

---

**Happy sidecaring! 🚗💨**
