# Features

Complete overview of Sidecar AI user-facing features.

## Core Features

### Sidecars
Sidecars are extra AI tasks that run alongside your main roleplay conversation. Each sidecar:
- Uses its own AI provider/model (cheap models recommended)
- Has its own prompt/instruction
- Runs independently from your main chat
- Saves money by offloading auxiliary tasks

**Example:** Track character emotions with GPT-4o-mini while your main AI (Claude Opus) handles roleplay.

---

## 🪄 AI Template Maker

Generate sidecar configurations using AI.

**How it works:**
1. Click **AI Maker** button
2. Describe what you want in plain English
3. Select API connection (uses your SillyTavern setup)
4. Click **Generate Template**
5. Review, test, add, or export

**Features:**
- **Test Template** - Preview with a premade roleplay scenario
- **Publish to GitHub** - Create PR to share with community
- **Export JSON** - Save template file
- **Add to Sidecars** - Use immediately

**Example prompts:**
- "Track character emotions with colored badges"
- "Add reader comment sections after each message"
- "Generate soundtrack suggestions for scenes"

---

## 📦 Template Library

Pre-made sidecar configurations ready to import.

**Available templates:**
- **Starter Pack** - 4 essential templates (Perspective Flip, Director's Commentary, Soundtrack, Art Prompt)
- **Actor Interview** - Characters break fourth wall
- **Reader Comments** - Simulated comment sections
- **Relationship Matrix** - Comprehensive scene tracking
- **Director's Commentary** - DVD-style meta-analysis
- **Soundtrack Suggester** - Music recommendations
- **Art Prompt Generator** - Image generation prompts

**How to use:**
1. Click **Templates** button
2. Browse local or community templates
3. Click **Import**
4. Edit to add API key

---

## ⚙️ Trigger Modes

**Auto** (🟢 Green badge)
- Runs automatically after every AI response
- Best for: Tracking, analysis, continuous monitoring
- Example: Emotion tracker, relationship matrix

**Manual** (🟠 Orange badge)
- Triggered via Extensions menu → Run Sidecar
- Best for: Optional features, heavy analysis, on-demand tasks
- Example: Director's commentary, actor interviews

---

## 🎨 Format Styles

**HTML+CSS** (default)
- Rich visual formatting with cards, colors, tables
- WCAG AA contrast enforced automatically
- Best for: Visual content, structured data, styled output

**Markdown**
- Simple text formatting
- Best for: Plain text, lists, basic formatting

**XML**
- Structured data format
- Best for: Data extraction, parsing, integration

**Random Beautify**
- Creative styling that changes each time
- Maintains style consistency across outputs
- Best for: Theatrical, entertaining content

---

## 📍 Response Locations

**Outside Chatlog** (recommended)
- Shows as expandable cards below messages
- Doesn't clutter chat
- Not sent to main AI (saves tokens)
- Collapsible, separate, or append formats

**Chat History**
- Injected as HTML comment in message
- Main AI can see it in future responses
- Useful for: Context that should influence main AI

---

## 🎯 Result Formats

**Collapsible** (recommended)
- Expandable `<details>` block
- Click to show/hide
- Clean and organized

**Separate Block**
- Standalone text block
- Always visible
- Simple display

**Append**
- Inline with message
- Flows naturally
- Less visual separation

---

## 🧠 Context Control

Control what each sidecar sees:

**Messages Count** (1-50)
- How many recent messages to include
- 2-5: Immediate context
- 6-15: Scene context
- 16-30: Broader patterns

**Include Cards**
- **Character Card** - Character personality/description
- **User Card** - User personality/preferences
- **World Card** - Setting/world information

**History**
- **Include History** - Include previous sidecar outputs
- **History Depth** (minimum 1) - How many previous outputs
- Ensures consistency across responses

---

## ⚡ Batch Processing

Group multiple sidecars with same provider/model.

**Benefits:**
- Single API request instead of multiple
- Saves tokens and cost
- Faster processing

**How to use:**
- Set `requestMode` to "Batch"
- Sidecars must use same provider/model
- Automatically grouped when triggered

---

## 🔑 API Key Management

**Option 1: Use SillyTavern's Saved Keys** (recommended)
- Set up in Settings → API Connections
- No per-sidecar configuration needed
- Secure and centralized

**Option 2: Per-Sidecar Keys**
- Set API key in sidecar form
- Useful for different keys per sidecar
- Overrides SillyTavern key if set

**Supported Providers:**
- OpenAI, OpenRouter, Anthropic, Google, Deepseek, Cohere, Custom

---

## 📤 Export / Import

**Export**
- Export all sidecars as JSON
- Choose to include/exclude API keys
- Share configurations with others

**Import**
- Import sidecar configurations from JSON
- Merge with existing sidecars
- Validate before adding

---

## 📜 History Viewer

View all previous results for a sidecar.

**Features:**
- Browse results by timestamp
- View full content
- Delete old results
- See which message each result belongs to

**Access:**
- Click **History** button on sidecar card
- View all results chronologically
- Click result to view full content

---

## 🧪 Test Template

Test generated templates before using.

**How it works:**
1. Generate template with AI Maker
2. Click **Test Template** button
3. Uses premade roleplay scenario
4. Shows formatted result preview
5. Verify it works before adding

**Test Scenario:**
- Coffee shop conversation
- Multiple messages
- Character context included
- Real-world preview

---

## 🚀 Publish to GitHub

Share templates with the community.

**How it works:**
1. Generate template with AI Maker
2. Click **Publish to GitHub** button
3. Opens GitHub web editor
4. Creates PR to `templates/community/`
5. Follow instructions to submit

**Benefits:**
- Share your creations
- Help others discover templates
- Contribute to the project

---

## 🎛️ Sidecar Management

**Create**
- Click **Create Sidecar** button
- Fill in form (name, prompt, settings)
- Save and enable

**Edit**
- Click **Edit** button on sidecar card
- Modify any settings
- Save changes

**Delete**
- Click **Delete** button on sidecar card
- Confirm deletion
- Removes sidecar and all its results

**Enable/Disable**
- Toggle switch on sidecar card
- Disabled sidecars don't run
- Useful for temporarily disabling

**Reorder**
- Drag sidecar cards to reorder
- Order affects batch grouping
- Visual organization

---

## 🔍 Manual Triggering

**Via Extensions Menu**
- Extensions → Run Sidecar
- Select sidecar from dropdown
- Click play button

**Via Console**
```javascript
// Trigger all manual sidecars
window.addOnsExtension.triggerAddons();

// Trigger specific ones
window.addOnsExtension.triggerAddons(['addon_id_1', 'addon_id_2']);

// Retry failed sidecar
window.addOnsExtension.retryAddon('addon_id', 'message_id');
```

---

## 🎨 Visual Features

**Badge Colors**
- 🟢 **Auto** - Green badge (runs automatically)
- 🟠 **Manual** - Orange badge (user-triggered)
- 🟢 **Enabled** - Green badge (active)
- 🔴 **Disabled** - Red badge (inactive)

**Card Layout**
- Grid layout (responsive)
- 3 columns max on desktop
- 2 columns on tablet
- 1 column on mobile

**Result Cards**
- Expandable sections
- Edit and copy buttons
- Timestamp display
- Clean, organized display

---

## 🔒 Security Features

**Content Isolation**
- AI-generated content is sandboxed
- Cannot affect SillyTavern UI
- CSS containment and isolation
- Position and z-index locked

**Content Sanitization**
- Removes dangerous elements (script, iframe)
- Strips event handlers
- Blocks malicious CSS
- Escapes error messages

See `SECURITY.md` for technical details.

---

## 💾 Storage

**Modern Storage** (v0.3.0+)
- Results stored in `message.extra.sidecarResults`
- Not sent to AI (saves tokens)
- Clean metadata structure
- Backward compatible

**Benefits:**
- Massive token savings (up to 45K tokens per request)
- No context pollution
- Faster responses
- Lower costs

---

## 🌐 Community Features

**Community Templates**
- Browse templates from GitHub
- Import community creations
- Share your own templates

**GitHub Integration**
- Publish templates via PR
- Contribute to template library
- Easy sharing workflow

---

## 📱 Responsive Design

**Desktop**
- Full feature set
- Grid layout (3 columns)
- All buttons visible

**Tablet**
- Optimized layout
- Grid layout (2 columns)
- Touch-friendly buttons

**Mobile**
- Single column layout
- Stacked buttons
- Optimized spacing

---

## 🎯 Use Cases

**Content Creation**
- Reader comments
- Actor interviews
- Director's commentary
- Soundtrack suggestions

**Tracking & Analysis**
- Relationship matrices
- Emotion tracking
- Scene analysis
- Character states

**Creative Enhancement**
- Art prompt generation
- Perspective flips
- Meta-narration
- Visual descriptions

---

## ⚡ Performance

**Token Efficiency**
- Results stored in metadata (not sent to AI)
- Batch processing for multiple sidecars
- Context control to minimize tokens

**Speed**
- Parallel processing for batch groups
- Retry logic with exponential backoff
- Efficient DOM updates

**Cost Savings**
- Use cheap models for sidecars
- Batch requests reduce API calls
- Token savings from metadata storage

---

## 🔧 Advanced Features

**Connection Profiles**
- Use SillyTavern's connection profiles
- Automatic model loading
- Service provider selection (OpenRouter)

**Presets**
- Use completion presets
- Consistent generation settings
- Profile-based configuration

**Error Handling**
- Automatic retries
- Clear error messages
- Connection testing
- Detailed logging

---

## 📚 Documentation

- [Main README](../README.md) - Installation and overview
- [AI Maker Guide](AI-MAKER-GUIDE.md) - Template generation
- [Template Library](../templates/README.md) - Available templates
- [Security](../SECURITY.md) - Technical security details
- [Storage Migration](STORAGE-MIGRATION.md) - v0.3.0 changes

---

**Need help?** Check the [README](../README.md#troubleshooting) or open an issue on GitHub.
