# 🚗 Sidecar AI - Auxiliary AI Processing for SillyTavern

[![Version](https://img.shields.io/badge/version-0.3.0-blue.svg)](https://github.com/skirianov/sidecar-ai/releases)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)
[![SillyTavern](https://img.shields.io/badge/SillyTavern-Extension-purple.svg)](https://github.com/SillyTavern/SillyTavern)

> **Supercharge your SillyTavern roleplay with auxiliary AI processing that won't break the bank.**

Sidecar AI lets you run additional AI tasks alongside your main conversation—commentary sections, meta-analysis, relationship tracking, scene descriptions—using cheaper models while keeping your expensive model focused on the actual roleplay.

**New in v0.3.0:** 
- 🪄 **AI Template Maker** - Describe what you want, AI generates it for you!
- 💰 **Storage Migration** - Results now stored in `message.extra` (not HTML comments) - **saves massive tokens!**

## ✨ Why Sidecar AI?

**The Problem:** Using GPT-4 or Claude Opus for everything is expensive. But you want rich, immersive experiences with commentary, analysis, and meta elements.

**The Solution:** Route auxiliary tasks to cheaper models (GPT-4o-mini, Deepseek, etc.) while your main model handles the roleplay. Save money, get more features.

### Real-World Example

- **Main AI** (Claude Opus): Roleplay responses
- **Sidecar #1** (GPT-4o-mini): Reader comments section
- **Sidecar #2** (Deepseek): Relationship tracking
- **Sidecar #3** (GPT-4o-mini): Actor interviews

**Cost savings:** ~80% compared to running everything on your main model.

### Token Efficiency (v0.3.0+)

**NEW:** Results are stored in `message.extra` metadata, NOT in message text!

**Impact on Context:**
- **Old system:** 2-5KB HTML comments per result × multiple sidecars = **45K+ wasted tokens per request**
- **New system:** **0 tokens** - metadata doesn't go to AI

**Savings with 3 sidecars running on 20 messages:**
- Token savings: ~45,000 tokens per request
- Cost savings (GPT-4): ~$0.45-0.90 per request
- **Over 100 requests:** Save $45-90!

## 🎯 Features

### Core Features
- 🪄 **AI Template Maker** - Describe what you want, AI generates the configuration
- 🎭 **Custom Sidecar Prompts** - Define unlimited auxiliary AI tasks
- 💰 **Cost Optimization** - Use cheap models for non-critical tasks
- ⚡ **Batch Processing** - Group requests to the same provider for efficiency
- 🔄 **Auto & Manual Triggers** - Run automatically or on-demand
- 🎨 **Multiple Format Styles** - HTML+CSS, Markdown, XML, or Random Beautify
- 🔒 **Content Isolation** - AI-generated content is sandboxed for security
- ♿ **WCAG Accessibility** - Enforces proper contrast ratios and readable colors

### Template Library
- 📦 **8+ Pre-made Templates** - Import and use immediately
- 🏗️ **Template Maker** - AI assistant creates custom templates
- 🌍 **Community Templates** - Browse and import user-contributed templates
- 💬 **Reader Comments** - Simulated community with reactions and interactions
- 🎭 **Actor Interviews** - Behind-the-scenes with characters breaking the fourth wall
- 📊 **Relationship Matrix** - Track stats, emotions, and dynamics
- 🎬 **Director's Commentary** - Meta-analysis of narrative techniques
- 🔄 **Perspective Flip** - See scenes from another character's view
- 🎵 **Soundtrack Suggester** - Music recommendations for scenes
- 🎨 **Art Prompt Generator** - Create Stable Diffusion/Midjourney prompts

### Supported AI Providers
- OpenAI (GPT-4o, GPT-4o-mini, GPT-3.5-turbo)
- OpenRouter (with service provider selection)
- Deepseek (ultra-cheap)
- Anthropic (Claude)
- Google (Gemini)
- Cohere
- Custom/Local (OpenAI-compatible APIs)

## 📦 Installation

### Method 1: Via SillyTavern UI (Recommended)

1. Open SillyTavern
2. Go to **Extensions** → **Download Extensions & Assets**
3. Paste this URL into the input field:
   ```
   https://github.com/skirianov/sidecar-ai
   ```
4. Click **Download**
5. Refresh the page (Ctrl+Shift+R / Cmd+Shift+R)
6. Go to **Extensions** tab → Find **"Sidecar AI"** → Click to expand settings

### Method 2: Manual Installation

1. Download or clone this repository:
   ```bash
   git clone https://github.com/skirianov/sidecar-ai.git
   ```

2. Copy the entire folder to your SillyTavern installation:
   ```
   SillyTavern/public/scripts/extensions/third-party/sidecar-ai/
   ```
   
   **Important:** The folder must be named `sidecar-ai` exactly.

3. Restart SillyTavern or hard refresh (Ctrl+Shift+R / Cmd+Shift+R)

4. Open **Settings** → **Extensions** tab → Look for **"Sidecar AI"**

### Verify Installation

Open browser console (F12) and look for:
```
[Sidecar AI] Loading modules...
[Sidecar AI] Initialization complete
```

If you see errors, check the troubleshooting section below.

## 🚀 Quick Start

### Option A: AI Template Maker (Easiest!)

1. Open **Sidecar AI** settings
2. Click **🪄 AI Maker** button
3. Describe what you want: "I want a sidecar that tracks character emotions..."
4. Click **Generate Template**
5. AI creates the configuration for you!
6. Click **Add to Sidecars** or **Export JSON**
7. Done!

**Uses your existing SillyTavern API connection - no extra setup needed!**

### Option B: Use Pre-made Templates (Fastest)

1. Open **Sidecar AI** settings
2. Click **Templates** button
3. Click **Browse Local Templates**
4. Import **Starter Pack** (includes 4 essential templates)
5. Edit each template to add your API key
6. Start chatting!

### Option C: Create Manually

1. Click **Create Sidecar** button
2. Fill in the form:
   - **Name:** "Reader Comments"
   - **Prompt:** Your instruction (context auto-included)
   - **Trigger Mode:** Manual or Auto
   - **AI Provider:** Choose cheap model (e.g., GPT-4o-mini)
   - **Format Style:** HTML+CSS (recommended)
3. Click **Save Sidecar**
4. Done!

## 📖 Usage Guide

### Understanding Trigger Modes

**Auto-trigger:** Runs after every AI response
- Good for: Tracking, monitoring, consistent meta-elements
- Example: Emotion tracker, relationship matrix

**Manual trigger:** Run via button when you want it
- Good for: Heavy analysis, optional features, creative suggestions
- Example: Director's commentary, soundtrack suggester

Access manual triggers via **Extensions** menu → **Run Sidecar** dropdown

### Understanding Response Locations

**Outside Chatlog** (Recommended):
- Results appear in expandable cards below the message
- Doesn't clutter your chat history
- Perfect for meta-content and commentary

**Chat History:**
- Injects as HTML comment in the message
- Accessible to main AI in future responses
- Use when you want the main AI to see these results

### Understanding Format Styles

**HTML+CSS** (Default):
- Rich visual formatting with cards, colors, tables
- WCAG accessibility enforced
- Best for: Most use cases

**Markdown:**
- Simple text formatting
- Best for: Plain text results, simple lists

**XML:**
- Structured data format
- Best for: Data export, parsing, integration

**Random Beautify:**
- Creative, theatrical styling
- Changes style each time but maintains consistency via history
- Best for: Fun, entertaining additions

### API Key Configuration

**Option 1: Use SillyTavern's Keys (Recommended)**
1. Set up API keys in **Settings** → **API Connections**
2. Sidecar automatically uses them - no extra setup needed!

**Option 2: Per-Sidecar Keys**
1. Edit a sidecar
2. Enter API key in the form
3. That sidecar uses its own key

> **Tip:** Using SillyTavern's keys is cleaner and lets you manage all keys in one place.

## 🪄 AI Template Maker

The easiest way to create sidecars - just describe what you want!

### How to Use

1. Click **🪄 AI Maker** button in Sidecar AI settings
2. Write a description:
   ```
   "I want a sidecar that tracks character emotions and displays them 
   as colored emoji with intensity ratings. It should run automatically 
   after each message and show results in a collapsible card."
   ```
3. Select your API connection profile (uses your existing SillyTavern setup)
4. Click **Generate Template**
5. AI creates the complete configuration (name, prompt, settings, format)
6. Preview the JSON or click **Add to Sidecars** to use it immediately!

### Features

✅ **No JSON editing** - AI writes the configuration for you  
✅ **Uses your API** - No extra API keys needed, uses your SillyTavern connection  
✅ **Smart defaults** - Chooses appropriate settings based on your description  
✅ **Export option** - Save generated templates as JSON files  
✅ **Auto-edit** - Opens edit modal after adding so you can fine-tune  

### Example Prompts

**Simple:**
- "Track character emotions with colored badges"
- "Add reader comments like on fanfiction sites"
- "Suggest music for each scene"

**Detailed:**
- "Create a behind-the-scenes section where actors break character and comment on the scene they just performed. Keep it to 2-3 lines per character, casual tone."

**Complex:**
- "I want a comprehensive relationship tracker that shows affection, trust, and desire on 0-200 scales, includes character physical states, and shows inner thoughts. Auto-trigger after every message and format with colored cards."

The more specific you are, the better the result!

**📖 Full guide:** See [docs/AI-MAKER-GUIDE.md](docs/AI-MAKER-GUIDE.md) for detailed examples and tips.

## 🎨 Template Library

### Featured Templates

**🎭 Actor Interview**
Behind-the-scenes where actors break character and share genuine thoughts about the scene (2-3 lines per character).

**💬 Reader Comments**
Simulated community commentary section with diverse readers reacting to the chapter and replying to each other.

**📊 Relationship Matrix**
Comprehensive scene memo tracking time, location, weather, character states (emotions, outfit, physical), relationship stats (Affection 0-200, Trust 0-200, Desire 0-200, Lust 0-200), and inner thoughts.

**🔄 Perspective Flip**
Shows the last exchange from the other character's viewpoint—how they perceived it and what they noticed.

**🎬 Director's Commentary**
DVD commentary-style analysis of narrative techniques, character beats, and foreshadowing.

**🎵 Soundtrack Suggester**
Suggests 3 real songs that would fit the scene mood, with genre and reasoning.

**🎨 Art Prompt Generator**
Creates detailed Stable Diffusion/Midjourney prompts for visualizing the current scene.

**🏗️ Template Maker**
AI assistant that creates new template configurations from your descriptions.

### Import Templates

Click **Templates** button in settings → Select template → Click **Import** → Add API key → Done!

### Create Templates

Use the **Template Maker** template—just describe your idea and it generates the JSON config for you!

### Share Templates

Export your sidecars and contribute to `templates/community/` via pull request. Help grow the library!

## 🔧 Advanced Usage

### Batch Processing

Sidecars with the same provider/model can be batched into a single API request:

1. Set multiple sidecars to use the same provider (e.g., all use GPT-4o-mini)
2. Set their **Request Mode** to "Batch"
3. They'll be sent together, saving API calls and cost

### Manual Triggering via Console

```javascript
// Trigger all manual sidecars
window.addOnsExtension.triggerAddons();

// Trigger specific sidecars by ID
window.addOnsExtension.triggerAddons(['addon_id_1', 'addon_id_2']);

// Retry a failed sidecar
window.addOnsExtension.retryAddon('addon_id', 'message_id');
```

### Context Control

Fine-tune what each sidecar sees:
- **Messages Count:** 1-50 recent messages
- **Character Card:** Include personality/description
- **User Card:** Include user's personality  
- **World Card:** Include setting/world info
- **History:** Include previous sidecar outputs (minimum 1 for consistency)

### History Depth

All sidecars maintain minimum history depth of 1 for consistency:
- Ensures AI remembers its previous outputs
- Critical for **Random Beautify** to maintain visual style
- Helps **Commentary** section use consistent usernames

## 🛡️ Security

Sidecar AI implements **defense-in-depth** security:

✅ **Content Sanitization** - Strips scripts, dangerous positioning, event handlers  
✅ **CSS Containment** - Isolates layout, style, and paint  
✅ **Position Locking** - Converts fixed/absolute to relative  
✅ **Z-Index Normalization** - Prevents stacking issues  
✅ **Iframe Blocking** - No external content injection  
✅ **Style Block Removal** - Prevents global CSS pollution  

See [SECURITY.md](SECURITY.md) for full threat model and testing guide.

## 🎯 Use Cases

### Content Creators
- Add reader comment sections to stories
- Include relationship stats and tracking
- Create visual scene descriptions
- Add soundtrack suggestions for atmosphere

### Writers
- Get instant feedback with critique modules
- Track character development and arcs
- Analyze pacing and narrative techniques
- Ensure continuity and consistency

### Roleplayers
- Track complex relationship dynamics
- Add meta-commentary for fun
- Generate art prompts for scene visualization
- Break the fourth wall with actor interviews

### Power Users
- Create custom automation workflows
- Track multiple metrics simultaneously
- Use batch processing for efficiency
- Build template libraries for different scenarios

## 🐛 Troubleshooting

### Sidecars Not Running

**Check:**
- [ ] Sidecar is enabled (green toggle)
- [ ] API key is configured (in sidecar or SillyTavern)
- [ ] Extension loaded successfully (check Extensions list)
- [ ] Browser console shows no errors (F12)

**For Auto-trigger:**
- Only triggers on AI responses (not user messages)
- Requires at least one enabled auto-trigger sidecar

**For Manual trigger:**
- Use Extensions menu → Run Sidecar dropdown
- Select "All Manual" or specific sidecar

### Results Not Appearing

**Outside Chatlog mode:**
- Look for expandable cards below the AI message
- Check if containers are being created (inspect element)

**Chat History mode:**
- Results are HTML comments (view page source)
- Only visible to main AI, not rendered in UI

### Duplicate Results

This is fixed in v0.3.0. If you still see duplicates:
- Refresh the page
- Disable and re-enable the sidecar
- Check console for errors

### Modal Closes When Clicking Inside

Fixed in v0.3.0. Update to latest version.

### AI Template Maker Not Working

**No connection profiles available:**
- Set up at least one API connection in **Settings** → **API Connections**
- Any provider works (OpenAI, Claude, Gemini, etc.)

**Generation fails:**
- Check your API connection is working (test in main chat)
- Try a simpler description first
- Check console for specific error messages

**Generated template doesn't work:**
- It's a starting point - you may need to edit the prompt
- Add your API key after generation
- Test with simple scenarios first

### API Errors

**403 Forbidden:**
- Check API key is valid
- Verify provider is spelled correctly
- Test connection using "Test Connection" button

**CORS Errors:**
- Normal for browser-side requests
- Extension automatically uses SillyTavern's backend
- Ensure provider is set up in API Connections

**Rate Limits:**
- Extension has auto-retry with exponential backoff
- Consider using batch mode for multiple sidecars
- Spread out auto-triggers if hitting limits

## 🏗️ Development

### Project Structure

```
sidecar-ai/
├── manifest.json           # Extension metadata
├── index.js                # Main entry point & initialization
├── settings.html           # Settings UI template
├── style.css              # Lightweight CSS (uses ST's theme vars)
├── CHANGELOG.md           # Version history
├── SECURITY.md            # Security documentation
├── src/
│   ├── addon-manager.js   # CRUD operations for sidecars
│   ├── context-builder.js # Gathers context and builds prompts
│   ├── ai-client.js       # AI provider integration
│   ├── result-formatter.js # Formats and injects results
│   ├── event-handler.js   # Event listeners and triggers
│   └── settings-ui.js     # Settings UI logic
└── templates/
    ├── README.md          # Template documentation
    ├── INSTALLATION.md    # Template usage guide
    ├── index.json         # Template catalog
    ├── *.json             # Individual templates
    └── community/         # User-contributed templates
```

### Contributing

We welcome contributions! Areas where help is appreciated:

- 🎨 **New templates** - Create and share useful sidecar configs
- 🐛 **Bug reports** - Open issues with reproduction steps
- 💡 **Feature ideas** - Suggest improvements via issues
- 📝 **Documentation** - Improve guides and examples
- 🔧 **Code improvements** - Submit PRs for fixes and features

**Before contributing:**
1. Check existing issues and PRs
2. Test your changes thoroughly
3. Follow the existing code style
4. Update CHANGELOG.md

### Building Templates

See [templates/README.md](templates/README.md) for comprehensive template creation guide.

Quick method: Use the built-in **🪄 AI Maker** button - just describe your idea and AI generates the config!

## 📚 Documentation

- [AI Template Maker Guide](docs/AI-MAKER-GUIDE.md) - Complete guide to AI-powered template creation
- [Storage Migration Guide](docs/STORAGE-MIGRATION.md) - v0.3.0 storage improvements (automatic, no action needed)
- [Template Library Guide](templates/README.md) - Creating and using templates
- [Template Installation](templates/INSTALLATION.md) - Quick start with templates
- [Security Documentation](SECURITY.md) - Threat model and defenses
- [Changelog](CHANGELOG.md) - Version history

## 🤝 Credits & Thanks

- **SillyTavern Team** - For the amazing platform and extension system
- **Qvink Memory Extension** - Inspiration for lightweight, clean design
- **Community Contributors** - For template ideas and feedback

Built with ❤️ for the SillyTavern community.

## ☕ Support

If you find Sidecar AI useful and want to support its development, consider buying me a coffee:

**[☕ Support on Ko-fi](https://ko-fi.com/sidecarai)**

Your support helps keep this project maintained and enables new features!

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🔗 Links

- **GitHub Repository:** https://github.com/skirianov/sidecar-ai
- **Issues & Bug Reports:** https://github.com/skirianov/sidecar-ai/issues
- **SillyTavern:** https://github.com/SillyTavern/SillyTavern
- **Community Templates:** https://github.com/skirianov/sidecar-ai/tree/main/templates/community
- **Support on Ko-fi:** https://ko-fi.com/sidecarai

---

**Need help?** Open an issue or check existing discussions!  
**Have a cool template?** Submit a PR to `templates/community/`!  
**Love the extension?** ⭐ Star the repo and share with friends!  
**Want to support development?** [☕ Buy me a coffee on Ko-fi](https://ko-fi.com/sidecarai)
