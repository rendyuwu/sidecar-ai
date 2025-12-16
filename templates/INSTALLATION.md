# Template Installation Guide

Quick guide to get started with Sidecar AI templates.

## Method 1: Via Templates Button (Easiest)

1. Open SillyTavern → Extensions → Sidecar AI
2. Click **Templates** button (next to "Create Sidecar")
3. Click **Browse Local Templates**
4. Click **Import** on any template
5. Done!

## Method 2: Manual Import

1. Download a template `.json` file from the `templates/` folder
2. Open Sidecar AI settings
3. Click **Import** button
4. Select the template file
5. Done!

## Method 3: Copy-Paste

1. Open a template `.json` file
2. Copy the entire contents
3. Open Sidecar AI settings → Click **Import**
4. Choose "Paste from clipboard"
5. Paste the JSON
6. Done!

## After Import

### Set Your API Key

Templates come without API keys for security. After importing:

**Option A: Use SillyTavern's API Keys (Recommended)**
1. Go to Settings → API Connections
2. Set up your provider (OpenAI, Anthropic, etc.)
3. Sidecar will automatically use it!

**Option B: Set Key in Sidecar**
1. Click **Edit** on the imported sidecar
2. Enter your API key in the API Key field
3. Click **Save Sidecar**

### Customize It

Feel free to modify:
- The prompt text
- Number of messages to include
- Trigger mode (auto vs manual)
- AI provider/model
- Format style

## Recommended Starter Templates

If you're new, try these first:

1. **`starter-pack.json`** - Imports 4 essential templates at once (Perspective Flip, Director's Commentary, Soundtrack, Art Prompt)
2. **🪄 AI Maker** (built-in button) - Create custom templates by describing them
3. **`commentary-section.json`** - Fun simulated reader comments

## Template Categories

### Analysis & Feedback
- Director's Commentary
- Relationship Matrix
- Emotion Tracker (coming soon)
- Writing Quality Score (coming soon)

### Creative Enhancement
- Soundtrack Suggester
- Art Prompt Generator
- Scene Visualizer (coming soon)
- Sensory Details (coming soon)

### Meta & Fun
- Actor Interview
- Reader Comments
- Perspective Flip (included in Starter Pack)
- Meta Narrator (coming soon)

## Creating Your Own

### Quick Method: Use Built-in AI Template Maker

1. Click **🪄 AI Maker** button in Sidecar AI settings
2. Describe your sidecar idea in plain English
3. AI generates the complete JSON configuration
4. Export it as a new template file or add directly to sidecars

See [AI Template Maker Guide](../docs/AI-MAKER-GUIDE.md) for detailed instructions.

### Manual Method

See `templates/README.md` for complete guide on template structure and fields.

## Sharing Your Templates

### Contribute to Community

1. Create your awesome template
2. Test it thoroughly
3. Export it (without API key!)
4. Save to `templates/community/your-template.json`
5. Submit a pull request with:
   - Template file
   - Description of what it does
   - Example output (screenshot or text)
   - Any special requirements

### Template Guidelines

- **Clear naming**: Use emoji + descriptive name
- **Good prompts**: Provide format examples in the prompt
- **Set defaults wisely**: Choose sensible context settings
- **Test thoroughly**: Ensure it works with different scenarios
- **Document**: Add good description explaining use case
- **No API keys**: Never commit API keys (export with keys off)

## Troubleshooting

**Template won't import?**
- Verify it's valid JSON (use JSONLint.com)
- Check all required fields are present
- Look at working templates for reference

**Template not working as expected?**
- Check API key is set
- Verify provider/model combination is valid
- Test with simpler prompt first
- Check console for error messages

**Need help?**
- Open an issue on GitHub
- Check `templates/README.md` for detailed docs
- Review example templates for patterns

## Template Format Version

Current: `"version": "1.0"`

Templates are backward compatible. If the format changes, we'll update this and provide migration guides.

---

Happy templating! 🎉

For questions or contributions: https://github.com/skirianov/sidecar-ai
