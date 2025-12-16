# 🪄 AI Template Maker Guide

The AI Template Maker is a built-in feature that creates sidecar configurations for you. Just describe what you want in plain English, and AI generates the complete setup!

## Quick Demo

**Input:** "I want a sidecar that adds reader comments to each chapter with diverse reactions"

**Output:** Complete JSON configuration with:
- Name: "💬 Reader Comments"
- Detailed prompt with formatting instructions
- Appropriate trigger mode (manual)
- Format style (html-css)
- Context settings (messagesCount: 3, no cards needed)
- Ready to use immediately

## Step-by-Step Guide

### 1. Open AI Maker

Click the **🪄 AI Maker** button in Sidecar AI settings (next to "Create Sidecar").

### 2. Describe Your Sidecar

Write a description of what you want. Can be simple or detailed:

**Simple examples:**
```
Track emotions with colored badges
```

```
Add soundtrack suggestions
```

**Detailed examples:**
```
I want a sidecar that tracks character emotions and displays them 
as colored emoji with intensity ratings from 1-10. It should run 
automatically after each message and show results in a collapsible 
card using HTML+CSS formatting.
```

```
Create a behind-the-scenes section where actors break the fourth wall 
and comment on the scene. Keep it short (2-3 lines per character), 
casual tone, genuine reactions. Should trigger manually when I want it.
```

**Complex examples:**
```
Design a comprehensive relationship tracker that monitors:
- Affection, Trust, and Desire on 0-200 scales
- Current relationship status (Friends, Lovers, Complicated, etc.)
- Character physical and emotional states
- Location, time, and weather
- Inner thoughts for each character

Should auto-trigger, use HTML formatting with colored cards and 
proper visual hierarchy. Include last 5 messages of context and 
track history to maintain consistency.
```

### 3. Select API Connection

Choose which API connection profile to use:
- Any provider works (OpenAI, Claude, Gemini, OpenRouter, etc.)
- Uses your existing SillyTavern setup
- No extra API keys needed!

**Recommended models for generation:**
- GPT-4o (best results)
- GPT-4o-mini (fast, cheap, good quality)
- Claude 3.5 Sonnet (excellent at structured output)

### 4. Generate

Click **Generate Template** button.

AI will:
- Analyze your description
- Determine appropriate settings (trigger mode, context needs, format)
- Write a detailed prompt with examples
- Choose sensible defaults
- Return complete JSON configuration

**Generation takes ~5-15 seconds** depending on model and complexity.

### 5. Review Generated Config

The AI shows you the JSON configuration:

```json
{
  "name": "😊 Emotion Tracker",
  "description": "Tracks character emotions with colored badges",
  "prompt": "Analyze the character's emotional state...",
  "triggerMode": "auto",
  "formatStyle": "html-css",
  // ... complete configuration
}
```

**You can:**
- Review the configuration
- Check if settings match your needs
- See the generated prompt

### 6. Export or Add

**Option A: Add to Sidecars (Recommended)**
1. Click **Add to Sidecars**
2. Extension automatically opens the edit modal
3. Add your API key
4. Customize if needed
5. Save and start using!

**Option B: Export as JSON**
1. Click **Export JSON**
2. Saves as a `.json` file
3. Share with others or import later
4. Useful for building a template library

## Tips for Better Results

### Be Specific About Format

❌ **Vague:** "Show emotions"

✅ **Clear:** "Show emotions as colored badges with emoji and intensity numbers"

### Specify Trigger Behavior

Include when it should run:
- "automatically after each message"
- "manually when I click the button"
- "after every AI response"

### Describe Output Format

Help AI understand how to format results:
- "as a collapsible card"
- "as a table with colored cells"
- "as a comment section with user avatars"
- "as simple bullet points"

### Mention Context Needs

Tell AI what context it needs:
- "needs character personality info"
- "only needs last 3 messages"
- "requires world setting details"
- "should track history across messages"

### Examples of Good Descriptions

```
Create a sidecar that generates DVD commentary-style analysis of 
the narrative techniques used in each message. Should identify 
literary devices, character development moments, and foreshadowing. 
Trigger manually, format as markdown with clear headings.
```

```
I want automated relationship tracking between all characters. 
Show Affection, Trust, and Desire on 0-200 scales. Update after 
every message. Display as colored progress bars with labels. 
Include relationship status (Friends/Lovers/etc).
```

```
Add a simulated reader comment section with 4-5 diverse commenters 
who react to the chapter. Some should be positive, some critical, 
some emotional. Include reader-on-reader replies. Use authentic 
internet language (typos, slang, varying quality). Trigger manually 
so I can choose when to add it.
```

## Common Patterns

### For Tracking Sidecars
- Mention "automatically" or "auto-trigger"
- Specify what metrics to track
- Note if history is important ("remember previous values")
- Usually need character card context

### For Analysis Sidecars
- Usually "manual" trigger
- Describe the analysis type (technical, emotional, narrative)
- Specify output format (list, table, prose)
- May need broader context (more messages)

### For Creative Sidecars
- Mention "beautify" or "creative formatting" if you want variety
- Describe visual style preferences
- Note consistency needs if applicable
- Usually manual trigger

### For Meta Sidecars
- Mention "fourth wall" or "meta" or "breaking character"
- Specify tone (serious analysis vs fun commentary)
- Note if should reference previous meta content
- Manual trigger unless it's consistent tracking

## What If Generation Isn't Perfect?

The AI generates a **starting point**, not always a perfect config. You can:

1. **Regenerate:** Try describing it differently
2. **Edit manually:** Click Edit after adding, tweak the prompt
3. **Test and iterate:** Run it, see results, adjust prompt
4. **Combine ideas:** Generate multiple, take best parts of each

Remember: Even if it's 80% there, you saved way more time than writing JSON from scratch!

## Advanced Tips

### Chain with Edit

1. Generate base template with AI Maker
2. Add to sidecars
3. Edit modal opens automatically
4. Fine-tune the prompt, adjust settings
5. Perfect!

### Build Template Collections

1. Use AI Maker to generate multiple variations
2. Export each as JSON
3. Keep your favorites in a personal library
4. Share the best ones with community

### Iterate on Generated Prompts

The AI's generated prompt is a starting point:
- Add specific examples of desired output
- Refine instructions based on actual results
- Add constraints if output is too long/short
- Include style guidelines if needed

## Comparison: AI Maker vs Manual vs Import

| Method | Speed | Customization | Best For |
|--------|-------|---------------|----------|
| **AI Maker** | ⚡⚡⚡ Fast | 🎨🎨🎨 High | Custom ideas, unique needs |
| **Import Template** | ⚡⚡⚡ Instant | 🎨 Low | Standard use cases, proven configs |
| **Manual Creation** | ⚡ Slow | 🎨🎨🎨🎨 Maximum | Power users, specific requirements |

**Recommendation:** Start with AI Maker or Import, refine manually if needed.

## Troubleshooting

**"No API connections configured"**
- Set up at least one API connection in Settings → API Connections
- Any provider works

**Generation takes too long**
- Normal for complex descriptions
- GPT-4o-mini is fastest (5-10 sec)
- GPT-4o is slower but better quality (15-20 sec)

**Generated config doesn't make sense**
- Try simpler language
- Break complex ideas into multiple simpler sidecars
- Specify fewer requirements in one description

**Wrong settings chosen**
- Edit after generation to fix
- Or regenerate with more explicit description
- Mention specific settings you want: "trigger manually", "use markdown format", etc.

## Examples Gallery

### Generated Reader Comments Config

**Input:**
```
Add reader comment section with 5 diverse users reacting to the story
```

**Output:**
```json
{
  "name": "💬 Reader Comments",
  "description": "Simulated reader commentary with community reactions",
  "prompt": "Design a comment section with 5 diverse readers...",
  "triggerMode": "manual",
  "formatStyle": "html-css",
  "contextSettings": {
    "messagesCount": 3,
    "includeHistory": true,
    "historyDepth": 2
  }
}
```

### Generated Emotion Tracker Config

**Input:**
```
Track character emotions automatically with colored badges
```

**Output:**
```json
{
  "name": "😊 Emotion Tracker",
  "description": "Tracks character emotions with visual badges",
  "prompt": "Analyze the character's emotional state...",
  "triggerMode": "auto",
  "formatStyle": "html-css",
  "contextSettings": {
    "messagesCount": 5,
    "includeCharCard": true,
    "includeHistory": true,
    "historyDepth": 3
  }
}
```

---

**Have a great template idea?** Use AI Maker to create it, then share via PR! 🎉
