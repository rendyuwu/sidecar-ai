# Sidecar AI Templates

This folder contains pre-made sidecar configurations you can import and use immediately.

## How to Use Templates

1. Open SillyTavern Extensions → Sidecar AI settings
2. Click the **Import** button
3. Select a template JSON file from this folder
4. The sidecar will be added to your list
5. Edit it to add your API key (or use SillyTavern's saved keys)

## Available Templates

### Core Templates

- **`starter-pack.json`** - 📦 Bundle of 4 essential templates (Perspective Flip, Director's Commentary, Soundtrack, Art Prompt)
- **`directors-commentary.json`** - 🎬 Meta-analysis like DVD commentary
- **`soundtrack-suggester.json`** - 🎵 Suggests fitting music for scenes
- **`art-prompt-generator.json`** - 🎨 Creates prompts for AI image generation
- **`commentary-section.json`** - 💬 Simulated reader comments with community reactions
- **`actor-interview.json`** - 🎭 Behind-the-scenes actor interviews
- **`relationship-matrix.json`** - 📊 Comprehensive scene tracking with relationship stats

## Creating Your Own Templates

### Option 1: Use the Built-in AI Template Maker (Recommended)

1. Open Sidecar AI settings
2. Click **🪄 AI Maker** button
3. Describe your sidecar idea in plain English
4. AI generates the complete JSON configuration
5. Export it as a new .json file or add directly to your sidecars

### Option 2: Manual Creation

Copy this structure:

```json
{
  "version": "1.0",
  "name": "Template: Your Template Name",
  "description": "Brief description",
  "addons": [
    {
      "name": "🎯 Display Name",
      "description": "What it does",
      "prompt": "Your prompt here...",
      "triggerMode": "manual",
      "requestMode": "standalone",
      "aiProvider": "openai",
      "aiModel": "gpt-4o-mini",
      "apiKey": "",
      "resultFormat": "collapsible",
      "responseLocation": "outsideChatlog",
      "formatStyle": "html-css",
      "contextSettings": {
        "messagesCount": 10,
        "includeCharCard": true,
        "includeUserCard": true,
        "includeWorldCard": true,
        "includeHistory": true,
        "historyDepth": 1
      }
    }
  ]
}
```

### Field Guide

**triggerMode:**
- `"auto"` - Runs automatically after every AI response
- `"manual"` - User triggers it manually when needed

**requestMode:**
- `"standalone"` - Each sidecar makes its own API request
- `"batch"` - Groups with other sidecars using same provider/model (saves tokens)

**formatStyle:**
- `"html-css"` - Styled HTML output (default, best for visual content)
- `"markdown"` - Simple text formatting
- `"xml"` - Structured data format
- `"beautify"` - Creative styling with random visual elements

**resultFormat:**
- `"collapsible"` - Expandable details block (recommended)
- `"separate"` - Separate text block
- `"append"` - Inline with message

**responseLocation:**
- `"outsideChatlog"` - Shows in dropdown below chat (recommended)
- `"chatHistory"` - Injects into chat as HTML comment (accessible to main AI)

**contextSettings:**
- `messagesCount`: How many recent messages to include (1-50)
- `includeCharCard`: Include character personality/description
- `includeUserCard`: Include user personality/description  
- `includeWorldCard`: Include world/setting information
- `includeHistory`: Include previous sidecar outputs (for consistency)
- `historyDepth`: Number of previous outputs to include (minimum 1)

## Sharing Templates

### Export for Sharing

1. Create your sidecar in the UI
2. Click Export
3. Choose "Include API Keys" = NO (for security)
4. Save the JSON file

### Community Templates

Check the official repository for community-contributed templates:
https://github.com/skirianov/sidecar-ai/tree/main/templates/community

**Contributing:**
- Fork the repo
- Add your template to `templates/community/`
- Submit a pull request with description
- Include example output in PR description

## Template Best Practices

### Writing Good Prompts

1. **Be Specific**: Clear instructions produce better results
2. **Provide Format Examples**: Show exactly how you want output structured
3. **Set Boundaries**: Tell the AI what NOT to do
4. **Use Context Wisely**: Only include context sections you actually need
5. **Test Variations**: Try different messagesCount values to find optimal context

### Choosing Settings

**Auto vs Manual:**
- Auto: Good for tracking, analysis, mood detection
- Manual: Better for heavy processing, creative suggestions, optional features

**Context Amount:**
- 1-5 messages: Immediate context, quick reactions
- 6-15 messages: Scene context, relationship tracking
- 16-30 messages: Broader patterns, development tracking
- 30+: Long-term analysis, character arcs

**Format Style:**
- HTML+CSS: Best for tables, cards, visual hierarchy, styled content
- Markdown: Best for simple text, lists, headings, emphasis
- XML: Best for structured data, parsing, integration
- Beautify: Best for creative, theatrical, entertaining output

### Performance Tips

- Use `gpt-4o-mini` for fast, cheap operations
- Use `gpt-4o` for complex analysis requiring better reasoning
- Set `requestMode: "batch"` for multiple auto-triggered sidecars
- Keep `messagesCount` low for frequently-triggered sidecars
- Use `historyDepth: 1` unless tracking patterns over time

## Troubleshooting

**Sidecar not triggering?**
- Check if it's enabled (toggle switch on card)
- For auto triggers: Ensure you have an AI response (not user message)
- For manual triggers: Select it in Extensions menu dropdown

**Output not formatted correctly?**
- Check `formatStyle` matches your prompt expectations
- Verify prompt includes format examples
- Try different models (some handle HTML better than others)

**API errors?**
- Verify API key is set (either in sidecar or SillyTavern connection profile)
- Check provider/model combination is valid
- Test connection using "Test Connection" button in form

**Duplicates appearing?**
- This is fixed in latest version
- Reload extension if you see duplicates

## Example Workflows

### Content Creator Workflow
1. Import `relationship-matrix.json` (auto-trigger)
2. Import `commentary-section.json` (manual)
3. Import `actor-interview.json` (manual)
4. Get comprehensive tracking + optional community feel

### Writing Coach Workflow  
1. Import `directors-commentary.json`
2. Import `dialogue-tag-helper.json`
3. Import `pacing-analyzer.json`
4. Get professional feedback on your writing craft

### Immersion Enhancement
1. Import `emotion-tracker.json` (auto)
2. Import `scene-visualizer.json` (manual)
3. Import `soundtrack-suggester.json` (manual)
4. Deepen emotional engagement and atmosphere

## Template Naming Convention

- Prefix files with category: `analysis-`, `creative-`, `tracking-`, `fun-`
- Use kebab-case: `emotion-tracker.json`
- Special prefixes:
  - `community-` for user-contributed templates
  - `experimental-` for beta/testing templates

## Template Versioning

Templates use semantic versioning in the `"version"` field:
- `"1.0"` - Current stable format
- Future versions may add fields - old templates remain compatible

## Need Help?

- Check main README.md in root folder
- Open an issue on GitHub
- Join Discord community (link in main README)

Happy templating! 🎉
